import { prop } from "./Doc.js";
import { Persistance, } from "./DocStore.js";
import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
export function initializeFileStoreFactory(factoryConfig) {
    function fileStore(config) {
        const pushCreate = createPersistedFunction(config.localJsonPersister.jsonFile(`pushCreate`), async (fileId) => {
            console.log(`Start pushCreate.`);
            const webPath = await config.localFilePersister.getWebPath(fileId);
            if (!isValid(webPath))
                return null;
            // TODO: Not being persisted because the document doesn't exist yet.
            SyncedFile._fromId(fileId).webPath = webPath;
            return fileId;
        }).addStep(async (fileId) => {
            console.log(`Start pushCreate, step 2.`);
            if (!isValid(fileId))
                return;
            const fileData = await config.localFilePersister.readFile(fileId);
            if (!isValid(fileData))
                return;
            config.globalFilePersister?.uploadFile(fileId, fileData);
            // We wait to actually create the doc until the file is uploaded so that others can know when the file is available.
            SyncedFile._docStore.createDoc({}, fileId);
        });
        const pullCreate = createPersistedFunction(config.localJsonPersister.jsonFile(`pullCreate`), async (fileId) => {
            const fileData = await config.globalFilePersister?.downloadFile(fileId);
            if (!isValid(fileData))
                return null;
            await config.localFilePersister.writeFile(fileId, fileData);
            return fileId;
        }).addStep(async (fileId) => {
            if (!isValid(fileId))
                return;
            const webPath = await config.localFilePersister.getWebPath(fileId);
            if (!isValid(webPath))
                return;
            SyncedFile._fromId(fileId).webPath = webPath;
        });
        const pushDelete = createPersistedFunction(config.localJsonPersister.jsonFile(`pushDelete`), async (fileId) => {
            await config.localFilePersister.deleteFile(fileId);
            return fileId;
        }).addStep(async (fileId) => {
            await config.globalFilePersister?.deleteFile(fileId);
        });
        const pullDelete = createPersistedFunction(config.localJsonPersister.jsonFile(`pullDelete`), async (fileId) => {
            await config.localFilePersister.deleteFile(fileId);
        });
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
            webPath = prop([String, null], null, Persistance.local);
            static async createFromBinaryString(byteString) {
                console.log(`Start createFromBinaryString`);
                const docId = uuidv4();
                await config.localFilePersister.writeFile(docId, byteString);
                console.log(`Wrote file.`);
                pushCreate(docId);
                return SyncedFile._fromId(docId);
            }
            onDelete() {
                pushDelete(this.docId);
            }
        }
        return SyncedFile;
    }
    return { fileStore };
}
