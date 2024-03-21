import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
import { sessionTablePersister } from "./SessionTablePersister.js";
import type { MosaApi } from "@monode/mosa";

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
export type UpdateBatch = Device.ToReadonlyJson<WritableUpdateBatch>;
export type WritablePersistanceTaggedUpdateBatch = {
  [docId: string]: {
    [key: string]: {
      value: PrimVal;
      maxPersistance: Persistance;
    };
  };
};
export type PersistanceTaggedUpdateBatch =
  Device.ToReadonlyJson<WritablePersistanceTaggedUpdateBatch>;

// SECTION: Session Doc Persister Types
export namespace Session {
  export type Persister = MosaApi;
  export type TablePersister = {
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
  export const mockTablePersister: Session.TablePersister = {
    batchUpdate: () => {},
    getProp: (_, __, v) => (typeof v === `function` ? v() : v),
    peekProp: () => undefined,
    getAllDocs: () => [],
    docExists: () => false,
  };
}

// SECTION: Local Doc Persister Types
export namespace Device {
  export type Persister = (directoryPath: string) => Device.DirectoryPersister;
  /** TODO: We can make this simpler by giving it the format
   * `{ persist: <T extends JsonObj>(fileId: string, initValue: T) => Promise<T> }`
   * We can still batch updates by using `new Promise(() => save())`
   * This will delay the save until the end of the current thread. */
  export type DirectoryPersister = {
    readonly jsonFile: (fileId: string) => Device.JsonPersister;
    getWebPath: (fileId: string) => Promise<string | undefined>;
    readFile: (fileId: string) => Promise<string | undefined>;
    writeFile: (fileId: string, base64String: string) => Promise<void>;
    deleteFile: (fileId: string) => Promise<void>;
  };
  export type JsonPersister = {
    readonly start: <T extends Json>(initValue: T) => Device.SavedJson<T>;
  };
  export const mockDirectoryPersister: Device.DirectoryPersister = {
    jsonFile: () => ({
      start: (initValue) => ({
        loadedFromLocalStorage: Promise.resolve(),
        data: initValue as Device.ToReadonlyJson<typeof initValue>,
        batchUpdate: async (doUpdate) => {
          await doUpdate(initValue as any, () => {});
        },
      }),
    }),
    getWebPath: async () => undefined,
    readFile: async () => undefined,
    writeFile: async () => {},
    deleteFile: async () => {},
  };
  export type SavedJson<T extends Json> = {
    readonly loadedFromLocalStorage: Promise<void>;
    readonly data: Device.ToReadonlyJson<T>;
    readonly batchUpdate: (
      doUpdate: (
        json: { value: T },
        doNotSave: () => void,
      ) => Promise<unknown> | unknown,
    ) => Promise<void>;
  };
  export type Json = string | number | boolean | null | Json[] | JsonObj;
  export type JsonObj = { [key: string]: Json };
  export type ToReadonlyJson<T extends Json> = T extends Json[]
    ? ReadonlyArray<Device.ToReadonlyJson<T[number]>>
    : T extends JsonObj
    ? { readonly [K in keyof T]: Device.ToReadonlyJson<T[K]> }
    : T;
}

// SECTION: Global Doc Persister Types
// TODO: Maybe persisters should probably follow the format: { start: (...props) => { onLoaded, data, batchUpdate} }
export namespace Cloud {
  export type Persister<T extends {}> = (config: {
    stage: string;
    setWorkspaceId: (workspaceId: string) => void;
    sessionPersister: Session.Persister;
    directoryPersister?: Device.DirectoryPersister;
  }) => {
    getWorkspacePersister: GetWorkspacePersister;
    exports: T;
  };
  export type GetWorkspacePersister = (options: {
    stage: string | null;
    workspaceId: string;
    docType: string;
    // version: number;
  }) => Cloud.WorkspacePersister;
  export type WorkspacePersister = {
    start: (
      batchUpdate: (updates: UpdateBatch) => void,
      localMetaDataPersister: Device.JsonPersister,
    ) => void;
    updateDoc: (change: Cloud.DocChange) => Promise<void>;
    uploadFile: (fileId: string, base64String: string) => Promise<void>;
    downloadFile: (fileId: string) => Promise<string | undefined>;
    deleteFile: (fileId: string) => Promise<void>;
    // dispose: () => void;
  };
  export const mockWorkspacePersister: Cloud.WorkspacePersister = {
    start: () => {},
    updateDoc: async () => {},
    uploadFile: async () => {},
    downloadFile: async () => undefined,
    deleteFile: async () => {},
  };
  export type DocChange = {
    docId: string;
    props: DocJson;
    isBeingCreatedOrDeleted: boolean;
  };
  export type UploadEvents = {
    onStartUploadBatch?: () => void;
    onFinishUploadBatch?: () => void;
  };
}

// TODO: Support type unions.
// TODO: Figure out how to ignore changes incoming server changes that have been overridden by more recent local changes.
export type DocStore = ReturnType<typeof createDocStore>;
export type PersisterSetup = {
  stage: string | null;
  workspaceId: string;
  docType: string;
  // version: number;
};
export type PersistanceConfig = {
  sessionPersister: Session.Persister;
  devicePersister?: Device.Persister;
  getWorkspacePersister?: Cloud.GetWorkspacePersister;
  trackUpload: () => void;
  untrackUpload: () => void;
  onIncomingCreate?: (docId: string) => void;
  onIncomingDelete?: (docId: string) => void;
};
export type DocStoreParams = {
  sessionTablePersister: Session.TablePersister;
  deviceDirectoryPersister: Device.DirectoryPersister;
  cloudWorkspacePersister: Cloud.WorkspacePersister;
  trackUpload: () => void;
  untrackUpload: () => void;
  onIncomingCreate: (docId: string) => void;
  onIncomingDelete: (docId: string) => void;
};
export function initDocStoreConfig(params: {
  persistance: PersistanceConfig;
  stage: string | null;
  workspaceId: string | null;
  docType: string;
}): DocStoreParams {
  return {
    sessionTablePersister: isValid(params.workspaceId)
      ? sessionTablePersister(params.persistance.sessionPersister)
      : Session.mockTablePersister,
    deviceDirectoryPersister:
      isValid(params.persistance.devicePersister) && isValid(params.workspaceId)
        ? params.persistance.devicePersister(
            `${params.workspaceId}/${params.docType}`,
          )
        : Device.mockDirectoryPersister,
    cloudWorkspacePersister:
      isValid(params.persistance.getWorkspacePersister) &&
      isValid(params.workspaceId)
        ? params.persistance.getWorkspacePersister({
            stage: params.stage,
            docType: params.docType,
            workspaceId: params.workspaceId,
          })
        : Cloud.mockWorkspacePersister,
    trackUpload: params.persistance.trackUpload,
    untrackUpload: params.persistance.untrackUpload,
    onIncomingCreate: params.persistance.onIncomingCreate ?? (() => {}),
    onIncomingDelete: params.persistance.onIncomingDelete ?? (() => {}),
  };
}
export function createDocStore(config: DocStoreParams) {
  // const config = {
  //   sessionDocPersister: _config.getSessionDocPersister(_config),
  //   localJsonPersister: _config.getLocalJsonPersister?.(_config),
  //   globalDocPersister: _config.getGlobalDocPersister?.(_config),
  //   onIncomingCreate: _config.onIncomingCreate,
  //   onIncomingDelete: _config.onIncomingDelete,
  // };
  const localJsonPersister =
    config.deviceDirectoryPersister ?? Device.mockDirectoryPersister;
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
    config.sessionTablePersister.batchUpdate(
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
    async (docChange: Cloud.DocChange) => {
      config.trackUpload();
      await config.cloudWorkspacePersister?.updateDoc(docChange);
      config.untrackUpload();
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
          if (config.sessionTablePersister.peekProp(docId, key) === value)
            return;
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
        const docExistsInSession =
          config.sessionTablePersister.docExists(docId);
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
    config.sessionTablePersister.batchUpdate(
      sessionUpdates,
      params.newDocsAreOnlyVirtual,
    );

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
    if (!config.cloudWorkspacePersister) return;
    config.cloudWorkspacePersister.start((updates) => {
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

    getProp: config.sessionTablePersister.getProp,

    getAllDocs: config.sessionTablePersister.getAllDocs,
  } as const;
}
