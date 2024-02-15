import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
export const DELETED_KEY = `mx_deleted`;
export const Persistance = {
    session: `session`,
    local: `local`,
    global: `global`,
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
        }), {}), true);
    });
    const pushGlobalChange = createPersistedFunction(localJsonPersister.jsonFile(`pushGlobalChange`), async (docChange) => await config.globalDocPersister?.updateDoc(docChange));
    //
    async function batchUpdate(params) {
        await localDocs.loadedFromLocalStorage;
        const sessionUpdates = {};
        const localUpdates = {};
        const globalUpdates = {};
        Object.entries(params.updates).forEach(([docId, props]) => {
            Object.entries(props).forEach(([key, { value, maxPersistance }]) => {
                if (maxPersistance === Persistance.session ||
                    maxPersistance === Persistance.local ||
                    maxPersistance === Persistance.global) {
                    if (!isValid(sessionUpdates[docId]))
                        sessionUpdates[docId] = {};
                    sessionUpdates[docId][key] = value;
                }
                if (maxPersistance === Persistance.local ||
                    maxPersistance === Persistance.global) {
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
        });
        // TODO: Base these off of config.sessionDocPersister.getDocPersistance()
        const docsBeingAddedToSession = new Set();
        const docsBeingRemovedFromSession = new Set();
        const docsBeingAddedToLocal = new Set();
        const docsBeingRemovedFromLocal = new Set();
        const docsBeingAddedToGlobal = new Set();
        const docsBeingRemovedFromGlobal = new Set();
        // Changes are pushed to session store, but never come from there.
        config.sessionDocPersister.batchUpdate(sessionUpdates, params.newDocsAreOnlyVirtual);
        // TODO: Remove these
        const docsBeingCreated = new Set();
        const docsBeingDeleted = new Set();
        if (params.sourceStoreType !== Persistance.local) {
            localDocs.batchUpdate((data) => {
                Object.entries(localUpdates).forEach(([docId, props]) => {
                    if (props[DELETED_KEY] === true) {
                        docsBeingDeleted.add(docId);
                    }
                    else {
                        // Even if a doc is new, if it has the DELETED_KEY then it is actually deleted.
                        docsBeingCreated.add(docId);
                    }
                    data.docs[docId] = {
                        ...(data.docs[docId] ?? {}),
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
                    isBeingCreatedOrDeleted: (docsBeingCreated.has(docId) || docsBeingDeleted.has(docId)) &&
                        params.sourceStoreType === Persistance.session,
                });
            });
        }
        docsBeingCreated.forEach((docId) => config.onIncomingCreate?.(docId));
        docsBeingDeleted.forEach((docId) => config.onIncomingDelete?.(docId));
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
            });
        }, localJsonPersister.jsonFile(`globalPersisterMetaData`));
    });
    // This Interface should be all the Class API needs to interface with the store.
    return {
        loadedFromLocalStorage: localDocs.loadedFromLocalStorage,
        batchUpdate(updates) {
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: true,
                updates,
            });
        },
        createDoc(props, 
        // maxPersistance?: Persistance,
        manualDocId) {
            const docId = manualDocId ?? uuidv4();
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: false,
                updates: {
                    [docId]: props,
                },
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
            });
        },
        isDocDeleted(docId) {
            return this.getProp(docId, DELETED_KEY, false);
        },
        getProp: config.sessionDocPersister.getProp,
        getAllDocs: config.sessionDocPersister.getAllDocs,
    };
}
