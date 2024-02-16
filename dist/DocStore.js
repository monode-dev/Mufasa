import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
export const DELETED_KEY = `mx_deleted`;
export const MAX_PERSISTANCE_KEY = `maxPersistance`;
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
    function getMaxPersistance(docId) {
        return config.sessionDocPersister.getProp(docId, MAX_PERSISTANCE_KEY, null);
    }
    //
    async function batchUpdate(params) {
        // TODO: Handle "maxPersistance".
        await localDocs.loadedFromLocalStorage;
        const sessionUpdates = {};
        const localUpdates = {};
        const globalUpdates = {};
        const globalCreates = new Set();
        const globalDeletes = new Set();
        Object.entries(params.updates).forEach(([docId, props]) => {
            const prevMaxPersistance = getMaxPersistance(docId);
            const newMaxPersistance = (props[MAX_PERSISTANCE_KEY]?.value ??
                params.sourceStoreType);
            const docMaxPersistance = Math.max(prevMaxPersistance ?? Persistance.session, newMaxPersistance);
            if (docMaxPersistance === Persistance.global) {
                const docExistsInSession = config.sessionDocPersister.docExists(docId);
                const isBeingDeleted = props[DELETED_KEY]?.value === true;
                const docIsBeingPromotedToGlobal = prevMaxPersistance !== Persistance.global &&
                    newMaxPersistance === Persistance.global;
                if (isBeingDeleted) {
                    globalDeletes.add(docId);
                }
                else if (!docExistsInSession || docIsBeingPromotedToGlobal) {
                    // Even if a doc is new, if it has the DELETED_KEY then it is actually deleted.
                    globalCreates.add(docId);
                }
            }
            Object.entries(props).forEach(([key, { value, maxPersistance: propMaxPersistance }]) => {
                const actualMaxPersistance = Math.min(docMaxPersistance, propMaxPersistance);
                if (actualMaxPersistance >= Persistance.session) {
                    if (!isValid(sessionUpdates[docId]))
                        sessionUpdates[docId] = {};
                    sessionUpdates[docId][key] = value;
                }
                if (actualMaxPersistance >= Persistance.local) {
                    if (!isValid(localUpdates[docId]))
                        localUpdates[docId] = {};
                    localUpdates[docId][key] = value;
                }
                if (actualMaxPersistance === Persistance.global) {
                    if (!isValid(globalUpdates[docId]))
                        globalUpdates[docId] = {};
                    globalUpdates[docId][key] = value;
                }
            });
            sessionUpdates[docId][MAX_PERSISTANCE_KEY] = docMaxPersistance;
            localUpdates[docId][MAX_PERSISTANCE_KEY] = docMaxPersistance;
            globalUpdates[docId][MAX_PERSISTANCE_KEY] = docMaxPersistance;
        });
        // Changes are pushed to session store, but never come from there.
        config.sessionDocPersister.batchUpdate(sessionUpdates, params.newDocsAreOnlyVirtual);
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
            Object.entries(globalUpdates).forEach(([docId, props]) => {
                pushGlobalChange({
                    docId,
                    props,
                    isBeingCreatedOrDeleted: (globalCreates.has(docId) || globalDeletes.has(docId)) &&
                        params.sourceStoreType === Persistance.session,
                });
            });
        }
        if (params.sourceStoreType === Persistance.global) {
            globalCreates.forEach((docId) => config.onIncomingCreate?.(docId));
            globalDeletes.forEach((docId) => config.onIncomingDelete?.(docId));
        }
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
                    Object.fromEntries(Object.entries(props)
                        .filter(([key]) => key !== MAX_PERSISTANCE_KEY)
                        .map(([key, value]) => [
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
        createDoc(props, maxPersistance, manualDocId) {
            const docId = manualDocId ?? uuidv4();
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: false,
                updates: {
                    [docId]: {
                        ...props,
                        [MAX_PERSISTANCE_KEY]: {
                            value: maxPersistance ?? Persistance.global,
                            maxPersistance: maxPersistance ?? Persistance.global,
                        },
                    },
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
        getMaxPersistance,
        promoteDocPersistance(docId, newPersistance) {
            batchUpdate({
                sourceStoreType: Persistance.session,
                newDocsAreOnlyVirtual: false,
                updates: {
                    [docId]: {
                        [MAX_PERSISTANCE_KEY]: {
                            value: newPersistance,
                            maxPersistance: newPersistance,
                        },
                    },
                },
            });
        },
    };
}
