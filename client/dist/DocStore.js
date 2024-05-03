import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
import { sessionTablePersister } from "./SessionTablePersister.js";
import { createFileStore } from "./FileStore.js";
export const DELETED_KEY = `mx_deleted`;
export const Persistance = {
    session: 0,
    local: 1,
    global: 2,
};
// SECTION: Session Doc Persister Types
export var Session;
(function (Session) {
    Session.mockTablePersister = {
        staticProp: (initVal) => ({ value: initVal }),
        batchUpdate: () => { },
        getProp: (_, __, v) => (typeof v === `function` ? v() : v),
        peekProp: () => undefined,
        getAllDocs: () => [],
        docExists: () => false,
    };
})(Session || (Session = {}));
// SECTION: Local Doc Persister Types
export var Device;
(function (Device) {
    Device.mockDirectoryPersister = {
        jsonFile: () => ({
            start: (initValue) => ({
                loadedFromLocalStorage: Promise.resolve(),
                data: initValue,
                batchUpdate: async (doUpdate) => {
                    await doUpdate({ value: initValue }, () => { });
                },
            }),
        }),
        getWebPath: async () => undefined,
        readFile: async () => undefined,
        writeFile: async () => { },
        deleteFile: async () => { },
        deleteAllData: async () => { },
    };
})(Device || (Device = {}));
// SECTION: Global Doc Persister Types
// TODO: Maybe persisters should probably follow the format: { start: (...props) => { onLoaded, data, batchUpdate} }
export var Cloud;
(function (Cloud) {
    Cloud.mockWorkspacePersister = {
        start: () => { },
        updateDoc: async () => { },
        uploadFile: async () => { },
        downloadFile: async () => undefined,
        deleteFile: async () => { },
        stopUploadsAndDownloads: () => { },
    };
})(Cloud || (Cloud = {}));
export function initializeStoreBank(bankConfig) {
    const managers = {
        doc: new Map(),
        file: new Map(),
    };
    return {
        getStore(params) {
            if (!managers[params.storeType].has(params.docType)) {
                managers[params.storeType].set(params.docType, initializeStoreManager({
                    stage: bankConfig.stage,
                    workspaceSignature: bankConfig.workspaceSignature,
                    ...params,
                }));
            }
            return managers[params.storeType].get(params.docType)?.value;
        },
    };
    function initializeStoreManager(params) {
        // Set up config for this store.
        const persistance = params.getStoreConfig();
        const { useProp, useFormula, doWatch } = persistance.sessionPersister;
        const createStore = (workspaceInstConfig) => {
            const createSpecificStore = params.storeType === "doc" ? createDocStore : createFileStore;
            return createSpecificStore({
                sessionTablePersister: isValid(workspaceInstConfig)
                    ? sessionTablePersister(persistance.sessionPersister)
                    : Session.mockTablePersister,
                deviceDirectoryPersister: isValid(persistance.devicePersister) && isValid(workspaceInstConfig)
                    ? persistance.devicePersister(`${params.docType}/${workspaceInstConfig.instId}`)
                    : Device.mockDirectoryPersister,
                cloudWorkspacePersister: isValid(persistance.getWorkspacePersister) &&
                    isValid(workspaceInstConfig)
                    ? persistance.getWorkspacePersister({
                        stage: params.stage,
                        docType: params.docType,
                        workspaceId: workspaceInstConfig.workspaceId,
                    })
                    : Cloud.mockWorkspacePersister,
                trackUpload: persistance.trackUpload,
                untrackUpload: persistance.untrackUpload,
                onIncomingCreate: persistance.onIncomingCreate ?? (() => { }),
                onIncomingDelete: persistance.onIncomingDelete ?? (() => { }),
            });
        };
        // Load the last workspace instance from disk.
        const instConfig = useProp(null);
        const instConfigJson = persistance
            .devicePersister?.(params.docType)
            .jsonFile(`currentWorkspaceInstConfig.json`)
            .start(null);
        instConfigJson?.loadedFromLocalStorage.then(() => {
            instConfig.value = instConfigJson.data;
        });
        //
        const store = useFormula(() => createStore(instConfig.value));
        doWatch(async () => {
            const newInstConfig = params.workspaceSignature.value;
            await instConfigJson?.loadedFromLocalStorage;
            if (newInstConfig?.userId === instConfig?.value?.userId &&
                newInstConfig?.workspaceId === instConfig.value?.workspaceId)
                return;
            // TODO: store.value.stop();
            instConfig.value = isValid(newInstConfig)
                ? {
                    userId: newInstConfig.userId,
                    workspaceId: newInstConfig.workspaceId,
                    instId: uuidv4(),
                }
                : null;
            /* Wait to delete the old store until a new one is loaded, so
             * that if the user logs right back in they don't have to
             * re-download everything. */
            if (newInstConfig !== null) {
                instConfigJson?.batchUpdate((data) => {
                    data.value = instConfig.value;
                });
                // TODO: deleteStore(instConfigJson?.data);
            }
        }, {
            on: [params.workspaceSignature],
        });
        return store;
    }
}
export function createDocStore(config) {
    const localJsonPersister = config.deviceDirectoryPersister ?? Device.mockDirectoryPersister;
    /** NOTE: Rather than break this up into sub systems we keep it all here so
     * that there is no need to join stuff on save, and when loading we only need
     * to read one file. */
    const localDocs = localJsonPersister.jsonFile(`localDocs`).start({
        docs: {},
    });
    // Pick up any changes that still need pushed.
    localDocs.loadedFromLocalStorage.then(() => {
        config.sessionTablePersister.batchUpdate(Object.entries(localDocs.data.docs)
            .filter((_, v) => isValid(v))
            .reduce((result, [id, props]) => ({
            ...result,
            [id]: props,
        }), {}), false);
    });
    const pushGlobalChange = createPersistedFunction(localJsonPersister.jsonFile(`pushGlobalChange`), async (docChange) => {
        config.trackUpload();
        await config.cloudWorkspacePersister?.updateDoc(docChange);
        config.untrackUpload();
    });
    //
    function batchUpdate(params) {
        const sessionUpdates = {};
        const localUpdates = {};
        const globalUpdates = {};
        const globalCreates = new Set();
        const globalDeletes = new Set();
        Object.entries(params.updates).forEach(([docId, props]) => {
            Object.entries(props).forEach(([key, { value, maxPersistance }]) => {
                if (maxPersistance >= Persistance.session) {
                    if (config.sessionTablePersister.peekProp(docId, key) === value)
                        return;
                    if (!isValid(sessionUpdates[docId]))
                        sessionUpdates[docId] = {};
                    sessionUpdates[docId][key] = value;
                }
                if (maxPersistance >= Persistance.local) {
                    if (!isValid(localUpdates[docId]))
                        localUpdates[docId] = {};
                    localUpdates[docId][key] = value;
                }
                if (maxPersistance === Persistance.global) {
                    if (!isValid(globalUpdates[docId]))
                        globalUpdates[docId] = {};
                    globalUpdates[docId][key] = value;
                }
            });
            const hasGlobalProps = isValid(globalUpdates[docId]);
            if (hasGlobalProps) {
                const docExistsInSession = config.sessionTablePersister.docExists(docId);
                const isBeingDeleted = props[DELETED_KEY]?.value === true;
                if (isBeingDeleted) {
                    globalDeletes.add(docId);
                }
                else if (!docExistsInSession && !params.newDocsAreOnlyVirtual) {
                    // Even if a doc is new, if it has the DELETED_KEY then it is actually deleted.
                    globalCreates.add(docId);
                }
            }
        });
        // Changes are pushed to session store, but never come from there.
        config.sessionTablePersister.batchUpdate(sessionUpdates, params.newDocsAreOnlyVirtual);
        localDocs.loadedFromLocalStorage.then(() => {
            if (params.sourceStoreType !== Persistance.local) {
                localDocs.batchUpdate((data) => {
                    Object.entries(localUpdates).forEach(([docId, props]) => {
                        data.value.docs[docId] = {
                            ...(data.value.docs[docId] ?? {}),
                            ...props,
                        };
                    });
                });
            }
            // Persist updates to cloud.
            if (params.sourceStoreType !== Persistance.global) {
                Object.entries(globalUpdates).forEach(([docId, props]) => {
                    pushGlobalChange({
                        docId,
                        props,
                        isBeingCreatedOrDeleted: params.overwriteGlobally &&
                            params.sourceStoreType === Persistance.session,
                    });
                });
            }
            if (params.sourceStoreType === Persistance.global) {
                globalCreates.forEach((docId) => {
                    config.onIncomingCreate?.(docId);
                });
                globalDeletes.forEach((docId) => config.onIncomingDelete?.(docId));
            }
        });
    }
    // Watch cloud.
    const haveCompletedFirstSync = config.sessionTablePersister.staticProp(false);
    localDocs.loadedFromLocalStorage.then(() => {
        if (!config.cloudWorkspacePersister)
            return;
        config.cloudWorkspacePersister.start((updates) => {
            batchUpdate({
                sourceStoreType: Persistance.global,
                newDocsAreOnlyVirtual: false,
                updates: Object.fromEntries(Object.entries(updates).map(([docId, props]) => [
                    docId,
                    Object.fromEntries(Object.entries(props).map(([key, value]) => [
                        key,
                        { value, maxPersistance: Persistance.global },
                    ])),
                ])),
                overwriteGlobally: false,
            });
            haveCompletedFirstSync.value = true;
        }, localJsonPersister.jsonFile(`globalPersisterMetaData`));
    });
    // This Interface should be all the Class API needs to interface with the store.
    return {
        loadedFromLocalStorage: localDocs.loadedFromLocalStorage,
        batchUpdate(updates, options) {
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: true,
                updates,
                overwriteGlobally: options.overwriteGlobally,
            });
        },
        createDoc(props, manualDocId) {
            const docId = manualDocId ?? uuidv4();
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: false,
                updates: {
                    [docId]: props,
                },
                overwriteGlobally: true,
            });
            return docId;
        },
        deleteDoc(docId) {
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: false,
                updates: {
                    [docId]: {
                        [DELETED_KEY]: {
                            value: true,
                            maxPersistance: Persistance.global,
                        },
                    },
                },
                overwriteGlobally: true,
            });
        },
        isDocDeleted(docId) {
            return this.getProp(docId, DELETED_KEY, false);
        },
        getProp: config.sessionTablePersister.getProp,
        getAllDocs: config.sessionTablePersister.getAllDocs,
        getHaveCompletedFirstSync() {
            return haveCompletedFirstSync.value;
        },
    };
}
