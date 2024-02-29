import { v4 as uuidv4 } from "uuid";
import { doNow, isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";

export const DELETED_KEY = `mx_deleted`;
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
  peekProp(id: string, key: string): PrimVal | undefined;
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
  // dispose: () => void;
  // TODO: Maybe this should require a local persister of some sort so that we can complete unfinished uploads.
};
export type GlobalDocChange = {
  docId: string;
  props: DocJson;
  isBeingCreatedOrDeleted: boolean;
};
export type UploadEvents = {
  onStartUploadBatch?: () => void;
  onFinishUploadBatch?: () => void;
};
export const { trackUpload, untrackUpload, setUpUploadEvents } = doNow(() => {
  let uploadCount = 0;
  let uploadEvents: UploadEvents | undefined = undefined;
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
    setUpUploadEvents(newUploadEvents: UploadEvents | undefined) {
      uploadEvents = newUploadEvents;
      if (uploadCount > 0) {
        uploadEvents?.onStartUploadBatch?.();
      }
    },
  };
});

// TODO: Support type unions.
// TODO: Support files.
// TODO: Figure out how to ignore changes incoming server changes that have been overridden by more recent local changes.
export type DocStore = ReturnType<typeof createDocStore>;
export type GetPersister<T> = (config: {
  docType: string;
  workspaceId: string;
}) => T;
export type DocStoreConfig = {
  getSessionDocPersister: GetPersister<SessionDocPersister>;
  getLocalJsonPersister?: GetPersister<LocalJsonPersister>;
  getGlobalDocPersister?: GetPersister<GlobalDocPersister>;
  onIncomingCreate?: (docId: string) => void;
  onIncomingDelete?: (docId: string) => void;
};
export function createDocStore(
  _config: DocStoreConfig & {
    docType: string;
    workspaceId: string;
  },
) {
  const config = {
    sessionDocPersister: _config.getSessionDocPersister(_config),
    localJsonPersister: _config.getLocalJsonPersister?.(_config),
    globalDocPersister: _config.getGlobalDocPersister?.(_config),
    onIncomingCreate: _config.onIncomingCreate,
    onIncomingDelete: _config.onIncomingDelete,
  };
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
      false,
    );
  });

  const pushGlobalChange = createPersistedFunction(
    localJsonPersister.jsonFile(`pushGlobalChange`),
    async (docChange: GlobalDocChange) => {
      trackUpload();
      await config.globalDocPersister?.updateDoc(docChange);
      untrackUpload();
    },
  );

  //
  function batchUpdate(params: {
    sourceStoreType: Persistance;
    newDocsAreOnlyVirtual: boolean;
    updates: PersistanceTaggedUpdateBatch;
    overwriteGlobally: boolean;
  }) {
    const sessionUpdates: WritableUpdateBatch = {};
    const localUpdates: WritableUpdateBatch = {};
    const globalUpdates: WritableUpdateBatch = {};
    const globalCreates = new Set<string>();
    const globalDeletes = new Set<string>();
    Object.entries(params.updates).forEach(([docId, props]) => {
      Object.entries(props).forEach(([key, { value, maxPersistance }]) => {
        if (maxPersistance >= Persistance.session) {
          if (config.sessionDocPersister.peekProp(docId, key) === value) return;
          if (!isValid(sessionUpdates[docId])) sessionUpdates[docId] = {};
          sessionUpdates[docId][key] = value;
        }
        if (maxPersistance >= Persistance.local) {
          if (!isValid(localUpdates[docId])) localUpdates[docId] = {};
          localUpdates[docId][key] = value;
        }
        if (maxPersistance === Persistance.global) {
          if (!isValid(globalUpdates[docId])) globalUpdates[docId] = {};
          globalUpdates[docId][key] = value;
        }
      });
      const hasGlobalProps = isValid(globalUpdates[docId]);
      if (hasGlobalProps) {
        const docExistsInSession = config.sessionDocPersister.docExists(docId);
        const isBeingDeleted = props[DELETED_KEY]?.value === true;
        if (isBeingDeleted) {
          globalDeletes.add(docId);
        } else if (!docExistsInSession && !params.newDocsAreOnlyVirtual) {
          // Even if a doc is new, if it has the DELETED_KEY then it is actually deleted.
          globalCreates.add(docId);
        }
      }
    });

    // Changes are pushed to session store, but never come from there.
    config.sessionDocPersister.batchUpdate(
      sessionUpdates,
      params.newDocsAreOnlyVirtual,
    );

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
        Object.entries(globalUpdates).forEach(([docId, props]) => {
          pushGlobalChange({
            docId,
            props,
            isBeingCreatedOrDeleted:
              params.overwriteGlobally &&
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
        overwriteGlobally: false,
      });
    }, localJsonPersister.jsonFile(`globalPersisterMetaData`));
  });

  // This Interface should be all the Class API needs to interface with the store.
  return {
    loadedFromLocalStorage: localDocs.loadedFromLocalStorage,

    batchUpdate(
      updates: PersistanceTaggedUpdateBatch,
      options: {
        overwriteGlobally: boolean;
      },
    ) {
      batchUpdate({
        sourceStoreType: Persistance.session,
        newDocsAreOnlyVirtual: true,
        updates,
        overwriteGlobally: options.overwriteGlobally,
      });
    },

    createDoc(
      props: PersistanceTaggedUpdateBatch[string],
      manualDocId?: string,
    ) {
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
        overwriteGlobally: true,
      });
    },

    isDocDeleted(docId: string): boolean {
      return this.getProp(docId, DELETED_KEY, false) as boolean;
    },

    getProp: config.sessionDocPersister.getProp,

    getAllDocs: config.sessionDocPersister.getAllDocs,
  } as const;
}
