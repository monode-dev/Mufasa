import { v4 as uuidv4 } from "uuid";
import { PENDING, doNow, isValid } from "./Utils";
import { createPersistedFunction } from "./PersistedFunction";
import { sessionTablePersister } from "./SessionTablePersister";
import type { MosaApi, Prop, ReadonlyProp } from "mosa-js";
import type { GetCloudAuth, SignInFuncs } from "./Workspace";
import { FileStore, createFileStore } from "./FileStore";

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
    staticProp<T>(initVal: T): Prop<T>;
    batchUpdate(
      updates: UpdateBatch,
      newDocsAreOnlyVirtual: boolean,
      isInitialDiskLoad: boolean,
    ): void;
    getDocJson(docId: string): DocJson;
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
    staticProp: <T>(initVal: T) => ({ value: initVal } as any),
    batchUpdate: () => {},
    getDocJson: () => ({}),
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
    stop: () => void;
    deleteDirectory: () => Promise<void>;
    export: (
      outputPath: string,
      shouldInclude: (filePath: string) => boolean,
    ) => Promise<void>;
  };
  export type JsonPersister = {
    readonly load: <T extends Json>(initValue: T) => Device.SavedJson<T>;
  };
  export const mockDirectoryPersister: Device.DirectoryPersister = {
    jsonFile: (fileName) => ({
      load: (initValue) => ({
        loadedFromLocalStorage: Promise.resolve(),
        data: initValue as Device.ToReadonlyJson<typeof initValue>,
        fileName: `mock-${fileName}`,
        batchUpdate: async (doUpdate) => {
          await doUpdate({ value: initValue as any }, () => {});
        },
      }),
    }),
    getWebPath: async () => undefined,
    readFile: async () => undefined,
    writeFile: async () => {},
    deleteFile: async () => {},
    stop: () => {},
    deleteDirectory: async () => {},
    export: async () => {},
  };
  export type SavedJson<T extends Json> = {
    readonly loadedFromLocalStorage: Promise<void>;
    readonly data: Device.ToReadonlyJson<T>;
    readonly fileName: string;
    readonly batchUpdate: (
      doUpdate: (
        json: { value: T },
        doNotSave: () => void,
      ) => Promise<unknown> | unknown,
    ) => Promise<void>;
  };
  export type Json =
    | string
    | number
    | boolean
    | undefined
    | null
    | Json[]
    | JsonObj;
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
  export type Persister<T extends SignInFuncs> = {
    getCloudAuth: GetCloudAuth<T>;
    getWorkspacePersister: GetWorkspacePersister;
  };
  export type GetWorkspacePersister = (options: {
    stage: string | null;
    workspaceId: string;
    docType: string;
    // version: number;
  }) => Cloud.WorkspacePersister;
  export type WorkspacePersister = {
    setupWatcher: (
      batchUpdate: (updates: UpdateBatch) => void,
      localMetaDataPersister: Device.JsonPersister,
    ) => {
      start: () => void;
      stop: () => Promise<void>;
    };
    updateDoc: (change: Cloud.DocChange) => Promise<void>;
    uploadFile?: (fileId: string, base64String: string) => Promise<void>;
    downloadFile?: (fileId: string) => Promise<string | undefined>;
    deleteFile?: (fileId: string) => Promise<void>;
  };
  export const mockWorkspacePersister: Cloud.WorkspacePersister = {
    setupWatcher: () => ({
      start: () => {},
      stop: async () => {},
    }),
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
  trackDownload: () => void;
  untrackDownload: () => void;
  onIncomingCreate?: (docId: string) => void;
  onIncomingDelete?: (docId: string) => void;
};
export type DocStoreParams = {
  sessionTablePersister: Session.TablePersister;
  deviceDirectoryPersister: Device.DirectoryPersister;
  cloudWorkspacePersister: Cloud.WorkspacePersister;
  trackUpload: () => void;
  untrackUpload: () => void;
  trackDownload: () => void;
  untrackDownload: () => void;
  onIncomingCreate: (docId: string) => void;
  onIncomingDelete: (docId: string) => void;
};
type WorkspaceSignature = {
  userId: string;
  workspaceId: string;
};
export function getWorkspaceInstDirectory(props: {
  docType: string;
  workspaceInstId: string;
}) {
  return `${props.docType}/${props.workspaceInstId}`;
}
export type StoreBank = ReturnType<typeof initializeStoreBank>;
export function initializeStoreBank(bankConfig: {
  stage: string;
  devicePersister?: Device.Persister;
  workspaceSignature: Promise<
    (watcher: (sig: WorkspaceSignature | null) => void) => void
  >;
}) {
  type WorkspaceInstConfig = WorkspaceSignature & {
    instId: string;
  };
  const managers = {
    doc: new Map<string, StoreManager<"doc">>(),
    file: new Map<string, StoreManager<"file">>(),
  };
  const bankDirectory =
    bankConfig.devicePersister?.(`StoreBank`) ?? Device.mockDirectoryPersister;
  const deleteStoreInst = doNow(() => {
    const activeStoresToStop = new Map<string, DocStore | FileStore>();
    const deleteDirectoryForStoreInst = createPersistedFunction(
      bankDirectory.jsonFile(`deleteStoreInst`),
      async (params: { docType: string; instId: string }) => {
        // If the store is still being used, stop it so we can delete it.
        if (activeStoresToStop.has(params.instId)) {
          await activeStoresToStop.get(params.instId)?.stop();
          activeStoresToStop.delete(params.instId);
        }
        // Delete the store from disk.
        await bankConfig
          .devicePersister?.(
            getWorkspaceInstDirectory({
              docType: params.docType,
              workspaceInstId: params.instId,
            }),
          )
          .deleteDirectory();
      },
    );
    return (params: {
      docType: string;
      instId: string;
      store: DocStore | FileStore;
    }) => {
      activeStoresToStop.set(params.instId, params.store);
      deleteDirectoryForStoreInst({
        docType: params.docType,
        instId: params.instId,
      });
    };
  });
  return {
    getStore<T extends "doc" | "file">(params: {
      storeType: T;
      docType: string;
      getStoreConfig: () => PersistanceConfig;
      onStoreInit?: (store: T extends "doc" ? DocStore : FileStore) => void;
    }): T extends "doc" ? DocStore : FileStore {
      if (!managers[params.storeType].has(params.docType)) {
        managers[params.storeType].set(
          params.docType,
          initializeStoreManager({
            stage: bankConfig.stage,
            workspaceSignature: bankConfig.workspaceSignature,
            deleteStoreInst,
            ...params,
          }) as any,
        );
        params.onStoreInit?.(
          managers[params.storeType].get(params.docType)?.value as any,
        );
      }
      return managers[params.storeType].get(params.docType)?.value as any;
    },
  };
  type StoreManager<T extends "doc" | "file"> = ReturnType<
    typeof initializeStoreManager<T>
  >;
  function initializeStoreManager<T extends "doc" | "file">(params: {
    stage: string;
    workspaceSignature: Promise<
      (watcher: (sig: WorkspaceSignature | null) => void) => void
    >;
    storeType: T;
    docType: string;
    getStoreConfig: () => PersistanceConfig;
    deleteStoreInst: (params: {
      docType: string;
      instId: string;
      store: DocStore | FileStore;
    }) => void;
    onStoreInit?: (store: T extends "doc" ? DocStore : FileStore) => void;
  }): ReadonlyProp<T extends "doc" ? DocStore : FileStore> {
    // Set up config for this store.
    const persistance = params.getStoreConfig();
    const { useProp, doWatch, useRoot, useFormula } =
      persistance.sessionPersister;
    const createStore = (workspaceInstConfig: WorkspaceInstConfig | null) => {
      const createSpecificStore =
        params.storeType === "doc" ? createDocStore : createFileStore;
      return createSpecificStore({
        sessionTablePersister: isValid(workspaceInstConfig)
          ? sessionTablePersister(persistance.sessionPersister, params.docType)
          : Session.mockTablePersister,
        deviceDirectoryPersister:
          isValid(persistance.devicePersister) && isValid(workspaceInstConfig)
            ? persistance.devicePersister(
                getWorkspaceInstDirectory({
                  docType: params.docType,
                  workspaceInstId: workspaceInstConfig.instId,
                }),
              )
            : Device.mockDirectoryPersister,
        cloudWorkspacePersister:
          isValid(persistance.getWorkspacePersister) &&
          isValid(workspaceInstConfig)
            ? persistance.getWorkspacePersister({
                stage: params.stage,
                docType: params.docType,
                workspaceId: workspaceInstConfig.workspaceId,
              })
            : Cloud.mockWorkspacePersister,
        trackUpload: persistance.trackUpload,
        untrackUpload: persistance.untrackUpload,
        trackDownload: persistance.trackDownload,
        untrackDownload: persistance.untrackDownload,
        onIncomingCreate: persistance.onIncomingCreate ?? (() => {}),
        onIncomingDelete: persistance.onIncomingDelete ?? (() => {}),
      });
    };

    return doNow(() => {
      const store = useRoot(() => useProp(createStore(null)));
      const instConfigJson = persistance
        .devicePersister?.(params.docType)
        .jsonFile(`currentWorkspaceInstConfig.json`)
        .load<WorkspaceInstConfig | null>(null);
      // Load the last known workspace signature, and then watch for changes.
      doNow(async () => {
        // Load the last known store signature
        await instConfigJson?.loadedFromLocalStorage;
        const currentInstConfig = useRoot(() =>
          isValid(instConfigJson)
            ? {
                get value() {
                  return instConfigJson!.data;
                },
                set value(v: WorkspaceInstConfig | null) {
                  instConfigJson!.batchUpdate((data) => (data.value = v));
                },
              }
            : useProp(null),
        );
        store.value = createStore(currentInstConfig.value);

        // Watch for changes in the signature
        const incomingSignature = await params.workspaceSignature;
        incomingSignature((newInstSignature) => {
          // Only do something if the workspace signature has changed.
          const oldInstConfig = currentInstConfig.value;
          if (
            newInstSignature?.userId === oldInstConfig?.userId &&
            newInstSignature?.workspaceId === oldInstConfig?.workspaceId
          )
            return;
          const newInstConfig = isValid(newInstSignature)
            ? { ...newInstSignature, instId: uuidv4() }
            : null;

          // Save the new workspace signature to disk
          if (isValid(instConfigJson)) {
            instConfigJson.batchUpdate((data) => {
              data.value = newInstConfig;
            });
          } else {
            currentInstConfig.value = newInstConfig;
          }

          // Create a new store for the new inst.
          const oldStore = store.value;
          store.value = createStore(newInstConfig);

          // Dispose of the old store.
          if (isValid(oldInstConfig?.instId)) {
            params.deleteStoreInst({
              docType: params.docType,
              instId: oldInstConfig.instId,
              store: oldStore,
            });
          }
        });
      });
      return store;
    }) as any;
  }
}
export function createDocStore(config: DocStoreParams) {
  const localJsonPersister =
    config.deviceDirectoryPersister ?? Device.mockDirectoryPersister;
  /** NOTE: Rather than break this up into sub systems we keep it all here so
   * that there is no need to join stuff on save, and when loading we only need
   * to read one file. */
  const localDocs = localJsonPersister.jsonFile(`localDocs`).load({
    docs: {} as {
      [key: string]: DocJson | null;
    },
  });

  // Pick up any changes that still need pushed.
  let haveLoadedFromDisk = config.sessionTablePersister.staticProp(false);
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
      true,
    );
    haveLoadedFromDisk.value = true;
  });

  const pushGlobalChange = createPersistedFunction(
    localJsonPersister.jsonFile(`pushGlobalChange`),
    async (docChange: Cloud.DocChange) => {
      config.trackUpload();
      try {
        await config.cloudWorkspacePersister.updateDoc(docChange);
      } catch (e) {
        // If the doc has already been deleted, no need to push the change.
        const shouldThrow = (e as any)?.code !== `not-found`;
        // If some error occurred, throw so we can re-attempt later.
        if (shouldThrow) {
          console.error(JSON.stringify(docChange, null, 2), e);
          throw e;
        }
      }
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
      false,
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
  const haveCompletedFirstSync = config.sessionTablePersister.staticProp(false);
  const cloudWatcher = config.cloudWorkspacePersister.setupWatcher(
    (updates) => {
      config.trackDownload();
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
      haveCompletedFirstSync.value = true;
      config.untrackDownload();
    },
    localJsonPersister.jsonFile(`globalPersisterMetaData`),
  );
  localDocs.loadedFromLocalStorage.then(() => {
    if (!config.cloudWorkspacePersister) return;
    cloudWatcher.start();
  });

  // This Interface should be all the Class API needs to interface with the store.
  return {
    loadedFromLocalStorage: localDocs.loadedFromLocalStorage,

    async stop() {
      await pushGlobalChange.pauseAll();
      await cloudWatcher.stop();
      await config.deviceDirectoryPersister.stop();
    },

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

    getDocJson: config.sessionTablePersister.getDocJson,

    getHaveCompletedFirstSync() {
      return haveCompletedFirstSync.value;
    },

    getHaveLoadedFromDisk() {
      return haveLoadedFromDisk.value;
    },

    async export(path: string, shouldInclude?: (filePath: string) => boolean) {
      await config.deviceDirectoryPersister.export(
        path,
        shouldInclude ?? (() => true),
      );
    },
  } as const;
}
