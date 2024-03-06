import { DocExports, prop, getWorkspaceId, Doc } from "./Doc.js";
import {
  DocStoreConfig,
  DocStoreParams,
  GetPersister,
  LocalFilePersister,
  LocalJsonPersister,
  Persistance,
  createDocStore,
  initDocStoreConfig,
  trackUpload,
  untrackUpload,
} from "./DocStore.js";
import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";

export function initializeSyncedFileClass() {
  return { SyncedFile };
}

const fileStores = new Map<string | null, Map<string, FileStore>>();
function getFileStore(params: {
  workspaceId: string | null;
  docType: string;
  defaultConfig: DocStoreConfig;
}) {
  if (!fileStores.has(params.workspaceId)) {
    fileStores.set(params.workspaceId, new Map());
  }
  const workspaceFileStores = fileStores.get(params.workspaceId)!;
  if (!workspaceFileStores.has(params.docType)) {
    workspaceFileStores.set(
      params.docType,
      _createFileStore(
        initDocStoreConfig({
          workspaceId: params.workspaceId,
          docType: params.docType,
          config: params.defaultConfig,
        }),
      ),
    );
  }
  return workspaceFileStores.get(params.docType)!;
}
export type FileStore = ReturnType<typeof _createFileStore>;
function _createFileStore(config: DocStoreParams) {
  const pullCreate = createPersistedFunction(
    config.localJsonPersister.jsonFile(`pullCreate`),
    async (fileId: string) => {
      const fileData = await config.globalFilePersister.downloadFile(fileId);
      if (!isValid(fileData)) return null;
      await config.localFilePersister.writeFile(fileId, fileData);
      docStore.batchUpdate(
        {
          [fileId]: {
            fileIsDownloaded: {
              value: true,
              maxPersistance: Persistance.local,
            },
          },
        },
        { overwriteGlobally: false },
      );
      return fileId;
    },
  );
  const pullDelete = createPersistedFunction(
    config.localJsonPersister.jsonFile(`pullDelete`),
    async (fileId: string) => {
      await config.localFilePersister.deleteFile(fileId);
    },
  );
  const docStore = createDocStore({
    ...config,
    onIncomingCreate: (docId) => {
      pullCreate(docId);
      config.onIncomingCreate?.(docId);
    },
    onIncomingDelete: (docId) => {
      pullDelete(docId);
      config.onIncomingDelete?.(docId);
    },
  });
  const pushCreate = createPersistedFunction(
    config.localJsonPersister.jsonFile(`pushCreate`),
    async (fileId: string) => {
      trackUpload();
      if (!isValid(fileId)) return;
      const fileData = await config.localFilePersister.readFile(fileId);
      if (!isValid(fileData)) return;
      config.globalFilePersister.uploadFile(fileId, fileData);
      // Manually persist globally to signify that the file is uploaded.
      docStore.batchUpdate(
        {
          [fileId]: {
            fileIsUploaded: {
              value: true,
              maxPersistance: Persistance.global,
            },
          },
        },
        { overwriteGlobally: true },
      );
      untrackUpload();
    },
  );
  return {
    docStore: docStore,
    async pushCreate(params: { base64String: string; manualDocId?: string }) {
      const docId = params.manualDocId ?? uuidv4();
      await config.localFilePersister.writeFile(docId, params.base64String);
      docStore.createDoc(
        {
          fileIsDownloaded: {
            value: true,
            maxPersistance: Persistance.local,
          },
        },
        docId,
      );
      pushCreate(docId);
      return docId;
    },
    pullCreate,
    pushDelete: createPersistedFunction(
      config.localJsonPersister.jsonFile(`pushDelete`),
      async (fileId: string) => {
        trackUpload();
        await config.localFilePersister.deleteFile(fileId);
        untrackUpload();
        return fileId;
      },
    ).addStep(async (fileId) => {
      await config.globalFilePersister.deleteFile(fileId);
    }),
    pullDelete,
    async readFile(fileId: string) {
      return await config.localFilePersister.readFile(fileId);
    },
  };
}

// TODO: Maybe prevent this file from being directly created.
class SyncedFile extends Doc {
  static get _fileStore(): FileStore {
    return getFileStore({
      workspaceId: getWorkspaceId(),
      docType: this.docType,
      defaultConfig: this.getDocStoreConfig(),
    });
  }
  get _fileStore() {
    return (this.constructor as typeof SyncedFile)._fileStore;
  }
  static get _docStore() {
    return this._fileStore.docStore;
  }
  readonly fileIsUploaded = prop(Boolean, false, Persistance.local);
  readonly fileIsDownloaded = prop(Boolean, false, Persistance.local);

  /** Won't resolve until it retrieves and returns the base64String. */
  async getBase64String(): Promise<string> {
    let base64String: string | undefined;
    while (!isValid(base64String)) {
      base64String = await this._fileStore.readFile(this.docId);
      if (!isValid(base64String)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    return base64String;
  }

  static async createFromBase64String(base64String: string) {
    return this._fromId(await this._fileStore.pushCreate({ base64String }));
  }

  onDelete(): void {
    this._fileStore.pushDelete(this.docId);
  }
}
