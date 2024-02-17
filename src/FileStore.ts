import { DocExports, prop } from "./Doc.js";
import {
  GlobalDocPersister,
  LocalJsonPersister,
  Persistance,
  SessionDocPersister,
} from "./DocStore.js";
import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";

export type GlobalFilePersister = {
  uploadFile: (fileId: string, data: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<string | undefined>;
  deleteFile: (fileId: string) => Promise<void>;
};
export type LocalFilePersister = {
  getWebPath: (fileId: string) => Promise<string | undefined>;
  readFile: (fileId: string) => Promise<string | undefined>;
  writeFile: (fileId: string, data: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  localJsonPersister: LocalJsonPersister;
};

export function initializeFileStoreFactory(factoryConfig: DocExports) {
  function fileStore(config: {
    storeName: string;
    sessionDocPersister: SessionDocPersister;
    localJsonPersister: LocalJsonPersister;
    globalDocPersister?: GlobalDocPersister;
    localFilePersister: LocalFilePersister;
    globalFilePersister?: GlobalFilePersister;
  }) {
    const pushCreate = createPersistedFunction(
      config.localJsonPersister.jsonFile(`pushCreate`),
      async (fileId: string) => {
        console.log(`Start pushCreate.`);
        const webPath = await config.localFilePersister.getWebPath(fileId);
        if (!isValid(webPath)) return null;
        (SyncedFile._fromId(fileId).webPath as any) = webPath;
        return fileId;
      },
    ).addStep(async (fileId) => {
      console.log(`Start pushCreate, step 2.`);
      if (!isValid(fileId)) return;
      const fileData = await config.localFilePersister.readFile(fileId);
      if (!isValid(fileData)) return;
      config.globalFilePersister?.uploadFile(fileId, fileData);
      // Manually persist globally to signify that the file is uploaded.
      SyncedFile._docStore.batchUpdate({
        [fileId]: {
          fileIsUploaded: {
            value: true,
            maxPersistance: Persistance.global,
          },
        },
      });
    });
    const pullCreate = createPersistedFunction(
      config.localJsonPersister.jsonFile(`pullCreate`),
      async (fileId: string) => {
        console.log(`Start pullCreate.`);
        const fileData = await config.globalFilePersister?.downloadFile(fileId);
        console.log(`Downloaded file.`);
        if (!isValid(fileData)) return null;
        await config.localFilePersister.writeFile(fileId, fileData);
        return fileId;
      },
    ).addStep(async (fileId) => {
      if (!isValid(fileId)) return;
      console.log(`Start pullCreate, step 2.`);
      const webPath = await config.localFilePersister.getWebPath(fileId);
      console.log(`Got webPath.`);
      if (!isValid(webPath)) return;
      (SyncedFile._fromId(fileId).webPath as any) = webPath;
      console.log(`Set webPath.`);
    });
    const pushDelete = createPersistedFunction(
      config.localJsonPersister.jsonFile(`pushDelete`),
      async (fileId: string) => {
        await config.localFilePersister.deleteFile(fileId);
        return fileId;
      },
    ).addStep(async (fileId) => {
      await config.globalFilePersister?.deleteFile(fileId);
    });
    const pullDelete = createPersistedFunction(
      config.localJsonPersister.jsonFile(`pullDelete`),
      async (fileId: string) => {
        await config.localFilePersister.deleteFile(fileId);
      },
    );

    const Doc = factoryConfig.Doc.newTypeFromPersisters({
      sessionDocPersister: config.sessionDocPersister,
      localJsonPersister: config.localJsonPersister,
      globalDocPersister: config.globalDocPersister,
      onIncomingCreate: pullCreate,
      onIncomingDelete: pullDelete,
    });
    // TODO: Maybe prevent this file from being directly created.
    class SyncedFile extends Doc {
      static get typeName() {
        return config.storeName;
      }

      readonly webPath = prop([String, null], null, Persistance.local);
      readonly fileIsUploaded = prop(Boolean, false, Persistance.local);

      static async createFromBinaryString(byteString: string) {
        console.log(`Start createFromBinaryString`);
        const docId = uuidv4();
        await config.localFilePersister.writeFile(docId, byteString);
        console.log(`Wrote file.`);
        pushCreate(docId);
        SyncedFile._docStore.createDoc({}, docId);
        return SyncedFile._fromId(docId);
      }

      onDelete(): void {
        pushDelete(this.docId);
      }
    }
    return SyncedFile;
  }

  return { fileStore };
}
