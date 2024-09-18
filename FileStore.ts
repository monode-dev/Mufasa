import { DocStoreParams, Persistance, createDocStore } from "./DocStore";
import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils";
import { createPersistedFunction } from "./PersistedFunction";

export type FileStore = ReturnType<typeof createFileStore>;
export function createFileStore(config: DocStoreParams) {
  const pullCreate = createPersistedFunction(
    config.deviceDirectoryPersister.jsonFile(`pullCreate`),
    async (fileId: string) => {
      config.trackDownload();
      if (!isValid(config.cloudWorkspacePersister.downloadFile)) return null;
      const fileData = await config.cloudWorkspacePersister.downloadFile(
        fileId,
      );
      if (!isValid(fileData)) return null;
      await config.deviceDirectoryPersister.writeFile(fileId, fileData);
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
      config.untrackDownload();
      return fileId;
    },
  );
  const pullDelete = createPersistedFunction(
    config.deviceDirectoryPersister.jsonFile(`pullDelete`),
    async (fileId: string) => {
      config.trackDownload();
      await config.deviceDirectoryPersister.deleteFile(fileId);
      config.untrackDownload();
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
    config.deviceDirectoryPersister.jsonFile(`pushCreate`),
    async (fileId: string) => {
      config.trackUpload();
      if (!isValid(fileId)) return;
      const fileData = await config.deviceDirectoryPersister.readFile(fileId);
      if (!isValid(fileData)) return;
      await config.cloudWorkspacePersister.uploadFile?.(fileId, fileData);
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
      config.untrackUpload();
    },
  );
  const pushDelete = createPersistedFunction(
    config.deviceDirectoryPersister.jsonFile(`pushDelete`),
    async (fileId: string) => {
      config.trackUpload();
      await config.deviceDirectoryPersister.deleteFile(fileId);
      config.untrackUpload();
      return fileId;
    },
  ).addStep(async (fileId) => {
    await config.cloudWorkspacePersister.deleteFile?.(fileId);
  });
  return {
    docStore: docStore,
    async stop() {
      await Promise.all([
        pullCreate.pauseAll(),
        pullDelete.pauseAll(),
        pushCreate.pauseAll(),
        pushDelete.pauseAll(),
      ]);
      await docStore.stop();
    },
    async pushCreate(params: { base64String: string; manualDocId?: string }) {
      const docId = params.manualDocId ?? uuidv4();
      await config.deviceDirectoryPersister.writeFile(
        docId,
        params.base64String,
      );
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
    async reUpload(fileId: string) {
      config.trackUpload();
      if (!isValid(fileId)) return;
      const fileData = await config.deviceDirectoryPersister.readFile(fileId);
      if (!isValid(fileData)) return;
      await config.cloudWorkspacePersister.uploadFile?.(fileId, fileData);
      config.untrackUpload();
    },
    pullCreate,
    pushDelete,
    pullDelete,
    async readFile(fileId: string) {
      return await config.deviceDirectoryPersister.readFile(fileId);
    },
  };
}
