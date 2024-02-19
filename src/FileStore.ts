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
  uploadFile: (fileId: string, base64String: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<string | undefined>;
  deleteFile: (fileId: string) => Promise<void>;
};
export type LocalFilePersister = {
  getWebPath: (fileId: string) => Promise<string | undefined>;
  readFile: (fileId: string) => Promise<string | undefined>;
  writeFile: (fileId: string, base64String: string) => Promise<void>;
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
        if (!isValid(fileId)) return;
        const fileData = await config.localFilePersister.readFile(fileId);
        if (!isValid(fileData)) return;
        config.globalFilePersister?.uploadFile(fileId, fileData);
        SyncedFile._fromId(fileId).flagFileAsUploaded();
      },
    );
    const pullCreate = createPersistedFunction(
      config.localJsonPersister.jsonFile(`pullCreate`),
      async (fileId: string) => {
        console.log(`Start pullCreate.`);
        const fileData = await config.globalFilePersister?.downloadFile(fileId);
        console.log(`Downloaded file.`);
        if (!isValid(fileData)) return null;
        await config.localFilePersister.writeFile(fileId, fileData);
        SyncedFile._fromId(fileId).flagFileAsDownloaded();
        return fileId;
      },
    );
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
      readonly fileIsUploaded = prop(Boolean, false, Persistance.local);
      flagFileAsUploaded() {
        // Manually persist globally to signify that the file is uploaded.
        SyncedFile._docStore.batchUpdate(
          {
            [this.docId]: {
              fileIsUploaded: {
                value: true,
                maxPersistance: Persistance.global,
              },
            },
          },
          { overwriteGlobally: true },
        );
      }
      readonly fileIsDownloaded = prop(Boolean, false, Persistance.local);
      flagFileAsDownloaded() {
        (this.fileIsDownloaded as any) = true;
      }

      /** Won't resolve until it retrieves and returns the base64String. */
      async getBase64String(): Promise<string> {
        let base64String: string | undefined;
        console.log(`Start getBase64String ${this.docId}`);
        while (!isValid(base64String)) {
          base64String = await config.localFilePersister.readFile(this.docId);
          if (!isValid(base64String)) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        console.log(`Got base64String.`);
        return base64String;
      }

      static async createFromBase64String(base64String: string) {
        console.log(`Start createFromBinaryString`);
        const docId = uuidv4();
        await config.localFilePersister.writeFile(docId, base64String);
        console.log(`Wrote file.`);
        pushCreate(docId);
        SyncedFile._docStore.createDoc(
          {
            fileIsDownloaded: {
              value: true,
              maxPersistance: Persistance.local,
            },
          },
          docId,
        );
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
