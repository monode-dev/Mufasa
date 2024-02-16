import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";

export const DELETED_KEY = `mx_deleted`;
export const MAX_PERSISTANCE_KEY = `maxPersistance`;
export type Persistance = (typeof Persistance)[keyof typeof Persistance];
export const Persistance = {
  session: 0,
  local: 1,
  global: 2,
} as const;
export type PrimVal = boolean | number | string | null;
export type DocJson = {
  [key: string]: PrimVal;
};
export type WritableUpdateBatch = {
  [docId: string]: DocJson;
};
export type UpdateBatch = ToReadonlyJson<WritableUpdateBatch>;
export type WritablePersistanceTaggedUpdateBatch = {
  [docId: string]: {
    [key: string]: {
      value: PrimVal;
      maxPersistance: Persistance;
    };
  };
};
export type PersistanceTaggedUpdateBatch =
  ToReadonlyJson<WritablePersistanceTaggedUpdateBatch>;

// SECTION: Session Doc Persister Types
export type SessionDocPersister = {
  batchUpdate(updates: UpdateBatch, newDocsAreOnlyVirtual: boolean): void;
  getProp(
    id: string,
    key: string,
    initValue: PrimVal | (() => PrimVal),
  ): PrimVal;
  getAllDocs(): string[];
  docExists(docId: string): boolean;
};

// SECTION: Local Doc Persister Types
/** TODO: We can make this simpler by giving it the format
 * `{ persist: <T extends JsonObj>(fileId: string, initValue: T) => Promise<T> }`
 * We can still batch updates by using `new Promise(() => save())`
 * This will delay the save until the end of the current thread. */
export type LocalJsonPersister = {
  readonly jsonFile: (fileId: string) => LocalJsonFilePersister;
};
export type LocalJsonFilePersister = {
  readonly start: <T extends Json>(initValue: T) => SavedJson<T>;
};
const fakeLocalJsonPersister: LocalJsonPersister = {
  jsonFile: (fileId: string) => ({
    start: (initValue) => ({
      loadedFromLocalStorage: Promise.resolve(),
      data: initValue as ToReadonlyJson<typeof initValue>,
      batchUpdate: async (doUpdate) => {
        await doUpdate(initValue as any, () => {});
      },
    }),
  }),
};
export type SavedJson<T extends Json> = {
  readonly loadedFromLocalStorage: Promise<void>;
  readonly data: ToReadonlyJson<T>;
  readonly batchUpdate: (
    doUpdate: (json: T, doNotSave: () => void) => Promise<unknown> | unknown,
  ) => Promise<void>;
};
export type Json = string | number | boolean | null | Json[] | JsonObj;
export type JsonObj = { [key: string]: Json };
export type ToReadonlyJson<T extends Json> = T extends Json[]
  ? ReadonlyArray<ToReadonlyJson<T[number]>>
  : T extends JsonObj
  ? { readonly [K in keyof T]: ToReadonlyJson<T[K]> }
  : T;

// SECTION: Global Doc Persister Types
// TODO: Maybe persisters should probably follow the format: { start: (...props) => { onLoaded, data, batchUpdate} }
export type GlobalDocPersister = {
  start: (
    batchUpdate: (updates: UpdateBatch) => void,
    localMetaDataPersister: LocalJsonFilePersister,
  ) => void;
  updateDoc: (change: GlobalDocChange) => Promise<void>;
  // TODO: Maybe this should require a local persister of some sort so that we can complete unfinished uploads.
};
export type GlobalDocChange = {
  docId: string;
  props: DocJson;
  isBeingCreatedOrDeleted: boolean;
};

// TODO: Support type unions.
// TODO: Support files.
// TODO: Figure out how to ignore changes incoming server changes that have been overridden by more recent local changes.
export type DocStore = ReturnType<typeof createDocStore>;
export type DocPersisters = {
  sessionDocPersister: SessionDocPersister;
  localJsonPersister?: LocalJsonPersister;
  globalDocPersister?: GlobalDocPersister;
  onIncomingCreate?: (docId: string) => void;
  onIncomingDelete?: (docId: string) => void;
};
export function createDocStore(config: DocPersisters) {
  const localJsonPersister =
    config.localJsonPersister ?? fakeLocalJsonPersister;
  /** NOTE: Rather than break this up into sub systems we keep it all here so
   * that there is no need to join stuff on save, and when loading we only need
   * to read one file. */
  const localDocs = localJsonPersister.jsonFile(`localDocs`).start({
    docs: {} as {
      [key: string]: DocJson | null;
    },
  });

  // Pick up any changes that still need pushed.
  localDocs.loadedFromLocalStorage.then(() => {
    config.sessionDocPersister.batchUpdate(
      Object.entries(localDocs.data.docs)
        .filter((_, v) => isValid(v))
        .reduce(
          (result, [id, props]) => ({
            ...result,
            [id]: props,
          }),
          {},
        ),
      true,
    );
  });

  const pushGlobalChange = createPersistedFunction(
    localJsonPersister.jsonFile(`pushGlobalChange`),
    async (docChange: GlobalDocChange) =>
      await config.globalDocPersister?.updateDoc(docChange),
  );

  function getMaxPersistance(docId: string) {
    return config.sessionDocPersister.getProp(
      docId,
      MAX_PERSISTANCE_KEY,
      null,
    ) as Persistance | null;
  }

  //
  async function batchUpdate(params: {
    sourceStoreType: Persistance;
    newDocsAreOnlyVirtual: boolean;
    updates: PersistanceTaggedUpdateBatch;
  }) {
    // TODO: Handle "maxPersistance".
    await localDocs.loadedFromLocalStorage;
    const sessionUpdates: WritableUpdateBatch = {};
    const localUpdates: WritableUpdateBatch = {};
    const globalUpdates: WritableUpdateBatch = {};
    const globalCreates = new Set<string>();
    const globalDeletes = new Set<string>();
    Object.entries(params.updates).forEach(([docId, props]) => {
      const prevMaxPersistance = getMaxPersistance(docId);
      const newMaxPersistance = (props[MAX_PERSISTANCE_KEY]?.value ??
        params.sourceStoreType) as Persistance;
      const docMaxPersistance = Math.max(
        prevMaxPersistance ?? Persistance.session,
        newMaxPersistance,
      );
      if (docMaxPersistance === Persistance.global) {
        const docExistsInSession = config.sessionDocPersister.docExists(docId);
        const isBeingDeleted = props[DELETED_KEY]?.value === true;
        const docIsBeingPromotedToGlobal =
          prevMaxPersistance !== Persistance.global &&
          newMaxPersistance === Persistance.global;
        if (isBeingDeleted) {
          globalDeletes.add(docId);
        } else if (!docExistsInSession || docIsBeingPromotedToGlobal) {
          // Even if a doc is new, if it has the DELETED_KEY then it is actually deleted.
          globalCreates.add(docId);
        }
      }
      Object.entries({
        ...props,
        [MAX_PERSISTANCE_KEY]: {
          value: docMaxPersistance,
          maxPersistance: docMaxPersistance,
        },
      }).forEach(([key, { value, maxPersistance: propMaxPersistance }]) => {
        const actualMaxPersistance = Math.min(
          docMaxPersistance,
          propMaxPersistance,
        );
        console.log(`docId: ${docId}, key: ${key}, value: ${value}`);
        // console.log(
        //   `docMaxPersistance: ${docMaxPersistance}, propMaxPersistance: ${propMaxPersistance}, actualMaxPersistance: ${actualMaxPersistance}, prevMaxPersistance: ${prevMaxPersistance}, newMaxPersistance: ${newMaxPersistance}`,
        // );
        if (actualMaxPersistance >= Persistance.session) {
          if (!isValid(sessionUpdates[docId])) sessionUpdates[docId] = {};
          sessionUpdates[docId][key] = value;
        }
        if (actualMaxPersistance >= Persistance.local) {
          if (!isValid(localUpdates[docId])) localUpdates[docId] = {};
          localUpdates[docId][key] = value;
        }
        if (actualMaxPersistance === Persistance.global) {
          if (!isValid(globalUpdates[docId])) globalUpdates[docId] = {};
          globalUpdates[docId][key] = value;
        }
      });
    });

    // Changes are pushed to session store, but never come from there.
    config.sessionDocPersister.batchUpdate(
      sessionUpdates,
      params.newDocsAreOnlyVirtual,
    );
    // console.log("Firebase.batchUpdate.session", sessionUpdates);

    if (params.sourceStoreType !== Persistance.local) {
      // console.log("Firebase.batchUpdate.local", localUpdates);
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
      // console.log("Firebase.batchUpdate.global", globalUpdates);
      Object.entries(globalUpdates).forEach(([docId, props]) => {
        pushGlobalChange({
          docId,
          props: Object.fromEntries(
            Object.entries(props).filter(
              ([key]) => key !== MAX_PERSISTANCE_KEY,
            ),
          ),
          isBeingCreatedOrDeleted:
            (globalCreates.has(docId) || globalDeletes.has(docId)) &&
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
    if (!config.globalDocPersister) return;
    config.globalDocPersister.start((updates) => {
      batchUpdate({
        sourceStoreType: Persistance.global,
        newDocsAreOnlyVirtual: false,
        updates: Object.fromEntries(
          Object.entries(updates).map(([docId, props]) => [
            docId,
            Object.fromEntries(
              Object.entries(props).map(([key, value]) => [
                key,
                { value, maxPersistance: Persistance.global },
              ]),
            ),
          ]),
        ),
      });
    }, localJsonPersister.jsonFile(`globalPersisterMetaData`));
  });

  // This Interface should be all the Class API needs to interface with the store.
  return {
    loadedFromLocalStorage: localDocs.loadedFromLocalStorage,

    batchUpdate(updates: PersistanceTaggedUpdateBatch) {
      batchUpdate({
        sourceStoreType: Persistance.session,
        newDocsAreOnlyVirtual: true,
        updates,
      });
    },

    createDoc(
      props: PersistanceTaggedUpdateBatch[string],
      maxPersistance?: Persistance,
      manualDocId?: string,
    ) {
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

    deleteDoc(docId: string) {
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

    isDocDeleted(docId: string): boolean {
      return this.getProp(docId, DELETED_KEY, false) as boolean;
    },

    getProp: config.sessionDocPersister.getProp,

    getAllDocs: config.sessionDocPersister.getAllDocs,

    getMaxPersistance,

    promoteDocPersistance(docId: string, newPersistance: Persistance) {
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
  } as const;
}
