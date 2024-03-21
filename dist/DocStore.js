import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
import { sessionDocPersister } from "./SessionDocPersister.js";
export const DELETED_KEY = `mx_deleted`;
export const Persistance = {
    session: 0,
    local: 1,
    global: 2,
};
export const fakeSessionDocPersister = {
    batchUpdate: () => { },
    getProp: (_, __, v) => (typeof v === `function` ? v() : v),
    peekProp: () => undefined,
    getAllDocs: () => [],
    docExists: () => false,
};
const fakeLocalJsonPersister = {
    jsonFile: () => ({
        start: (initValue) => ({
            loadedFromLocalStorage: Promise.resolve(),
            data: initValue,
            batchUpdate: async (doUpdate) => {
                await doUpdate(initValue, () => { });
            },
        }),
    }),
    getWebPath: async () => undefined,
    readFile: async () => undefined,
    writeFile: async () => { },
    deleteFile: async () => { },
};
export const fakeGlobalDocPersister = {
    start: () => { },
    updateDoc: async () => { },
    uploadFile: async () => { },
    downloadFile: async () => undefined,
    deleteFile: async () => { },
};
export function initDocStoreConfig(params) {
    const persisterConfig = isValid(params.workspaceId)
        ? {
            stage: params.stage,
            docType: params.docType,
            workspaceId: params.workspaceId,
        }
        : undefined;
    return {
        sessionDocPersister: isValid(persisterConfig)
            ? sessionDocPersister(params.persistance.sessionConfig)
            : fakeSessionDocPersister,
        localJsonPersister: isValid(params.persistance.getDevicePersister) && isValid(persisterConfig)
            ? params.persistance.getDevicePersister(persisterConfig)
            : fakeLocalJsonPersister,
        globalDocPersister: isValid(params.persistance.getCloudPersister) && isValid(persisterConfig)
            ? params.persistance.getCloudPersister(persisterConfig)
            : fakeGlobalDocPersister,
        trackUpload: params.persistance.trackUpload,
        untrackUpload: params.persistance.untrackUpload,
        onIncomingCreate: params.persistance.onIncomingCreate ?? (() => { }),
        onIncomingDelete: params.persistance.onIncomingDelete ?? (() => { }),
    };
}
export function createDocStore(config) {
    // const config = {
    //   sessionDocPersister: _config.getSessionDocPersister(_config),
    //   localJsonPersister: _config.getLocalJsonPersister?.(_config),
    //   globalDocPersister: _config.getGlobalDocPersister?.(_config),
    //   onIncomingCreate: _config.onIncomingCreate,
    //   onIncomingDelete: _config.onIncomingDelete,
    // };
    const localJsonPersister = config.localJsonPersister ?? fakeLocalJsonPersister;
    /** NOTE: Rather than break this up into sub systems we keep it all here so
     * that there is no need to join stuff on save, and when loading we only need
     * to read one file. */
    const localDocs = localJsonPersister.jsonFile(`localDocs`).start({
        docs: {},
    });
    // Pick up any changes that still need pushed.
    localDocs.loadedFromLocalStorage.then(() => {
        console.log(localDocs.data);
        config.sessionDocPersister.batchUpdate(Object.entries(localDocs.data.docs)
            .filter((_, v) => isValid(v))
            .reduce((result, [id, props]) => ({
            ...result,
            [id]: props,
        }), {}), false);
    });
    const pushGlobalChange = createPersistedFunction(localJsonPersister.jsonFile(`pushGlobalChange`), async (docChange) => {
        config.trackUpload();
        await config.globalDocPersister?.updateDoc(docChange);
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
                    if (config.sessionDocPersister.peekProp(docId, key) === value)
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
                const docExistsInSession = config.sessionDocPersister.docExists(docId);
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
        config.sessionDocPersister.batchUpdate(sessionUpdates, params.newDocsAreOnlyVirtual);
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
    localDocs.loadedFromLocalStorage.then(() => {
        if (!config.globalDocPersister)
            return;
        config.globalDocPersister.start((updates) => {
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
        getProp: config.sessionDocPersister.getProp,
        getAllDocs: config.sessionDocPersister.getAllDocs,
    };
}
