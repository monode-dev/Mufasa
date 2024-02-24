import { v4 as uuidv4 } from "uuid";
import { doNow, isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
export const Persistance = {
    session: 0,
    local: 1,
    global: 2,
};
const fakeLocalJsonPersister = {
    jsonFile: (fileId) => ({
        start: (initValue) => ({
            loadedFromLocalStorage: Promise.resolve(),
            data: initValue,
            batchUpdate: async (doUpdate) => {
                await doUpdate(initValue, () => { });
            },
        }),
    }),
};
export const { trackUpload, untrackUpload, setUpUploadEvents } = doNow(() => {
    let uploadCount = 0;
    let uploadEvents = undefined;
    return {
        trackUpload() {
            uploadCount++;
            if (uploadCount === 1) {
                uploadEvents?.onStartUploadBatch?.();
            }
        },
        untrackUpload() {
            uploadCount--;
            if (uploadCount === 0) {
                uploadEvents?.onFinishUploadBatch?.();
            }
        },
        setUpUploadEvents(newUploadEvents) {
            uploadEvents = newUploadEvents;
            if (uploadCount > 0) {
                uploadEvents?.onStartUploadBatch?.();
            }
        },
    };
});
export function createDocStore(config) {
    const localJsonPersister = config.localJsonPersister ?? fakeLocalJsonPersister;
    /** NOTE: Rather than break this up into sub systems we keep it all here so
     * that there is no need to join stuff on save, and when loading we only need
     * to read one file. */
    const localDocs = localJsonPersister.jsonFile(`localDocs`).start({
        docs: {},
    });
    // Pick up any changes that still need pushed.
    localDocs.loadedFromLocalStorage.then(() => {
        config.sessionDocPersister.batchUpdate(Object.entries(localDocs.data.docs)
            .filter((_, v) => isValid(v))
            .reduce((result, [id, props]) => ({
            ...result,
            [id]: props,
        }), {}), false);
    });
    const pushGlobalChange = createPersistedFunction(localJsonPersister.jsonFile(`pushGlobalChange`), async (docChange) => {
        trackUpload();
        let haveSuccessfullyUploaded = false;
        while (!haveSuccessfullyUploaded) {
            try {
                await config.globalDocPersister?.updateDoc(docChange);
                haveSuccessfullyUploaded = true;
            }
            catch (error) {
                const shouldRetry = (await config.shouldRetryUpload?.(docChange)) ?? true;
                haveSuccessfullyUploaded = !shouldRetry;
            }
        }
        untrackUpload();
    });
    //
    function batchUpdate(params) {
        const sessionUpdates = {};
        const localUpdates = {};
        const globalUpdates = {};
        const globalCreates = new Set();
        const globalDeletes = new Set();
        Object.entries(params.updates).forEach(([docId, props]) => {
            if (typeof props === `number`) {
                if (props >= Persistance.session) {
                    if (!config.sessionDocPersister.docExists(docId))
                        return;
                    sessionUpdates[docId] = null;
                }
                if (props >= Persistance.local) {
                    localUpdates[docId] = null;
                }
                if (props === Persistance.global) {
                    globalUpdates[docId] = {
                        metadata: {},
                        props: null,
                    };
                }
            }
            else {
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
                            globalUpdates[docId] = {
                                metadata: {},
                                props: {},
                            };
                        globalUpdates[docId].props[key] = value;
                    }
                });
            }
            const hasGlobalUpdates = globalUpdates[docId] !== undefined;
            if (hasGlobalUpdates) {
                globalUpdates[docId].metadata =
                    config.collectDocMetadata?.(docId, globalUpdates[docId].props) ?? {};
                const docExistsInSession = config.sessionDocPersister.docExists(docId);
                const isBeingDeleted = globalUpdates[docId].props === null;
                if (isBeingDeleted) {
                    globalDeletes.add(docId);
                }
                else if (!docExistsInSession && !params.newDocsAreOnlyVirtual) {
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
                        data.docs[docId] = {
                            ...(data.docs[docId] ?? {}),
                            ...props,
                        };
                    });
                });
            }
            // Persist updates to cloud.
            if (params.sourceStoreType !== Persistance.global) {
                Object.entries(globalUpdates).forEach(([docId, updates]) => {
                    pushGlobalChange({
                        docId,
                        props: updates.props,
                        metadata: updates.metadata,
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
                    props === null
                        ? Persistance.global
                        : Object.fromEntries(Object.entries(props).map(([key, value]) => [
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
                    [docId]: Persistance.global,
                },
                overwriteGlobally: true,
            });
        },
        docExists: config.sessionDocPersister.docExists,
        getProp: config.sessionDocPersister.getProp,
        getAllDocs: config.sessionDocPersister.getAllDocs,
    };
}
