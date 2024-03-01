import { prop } from "./Doc.js";
import { Persistance, trackUpload, untrackUpload, } from "./DocStore.js";
import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
export function initializeFileStoreFactory(factoryConfig) {
    function fileStore(config) {
        const docStoreConfig = {
            ...factoryConfig.defaultDocStoreConfig,
            ...config,
        };
        const persisterConfig = {
            workspaceId: factoryConfig.workspaceId,
            docType: config.storeName,
        };
        const localJsonPersister = docStoreConfig.getLocalJsonPersister(persisterConfig);
        const localFilePersister = docStoreConfig.getLocalFilePersister(persisterConfig);
        const globalFilePersister = docStoreConfig.getGlobalFilePersister?.(persisterConfig);
        const pushCreate = createPersistedFunction(localJsonPersister.jsonFile(`pushCreate`), async (fileId) => {
            trackUpload();
            if (!isValid(fileId))
                return;
            const fileData = await localFilePersister.readFile(fileId);
            if (!isValid(fileData))
                return;
            globalFilePersister?.uploadFile(fileId, fileData);
            SyncedFile._fromId(fileId).flagFileAsUploaded();
            untrackUpload();
        });
        const pullCreate = createPersistedFunction(localJsonPersister.jsonFile(`pullCreate`), async (fileId) => {
            const fileData = await globalFilePersister?.downloadFile(fileId);
            if (!isValid(fileData))
                return null;
            await localFilePersister.writeFile(fileId, fileData);
            SyncedFile._fromId(fileId).flagFileAsDownloaded();
            return fileId;
        });
        const pushDelete = createPersistedFunction(localJsonPersister.jsonFile(`pushDelete`), async (fileId) => {
            trackUpload();
            await localFilePersister.deleteFile(fileId);
            untrackUpload();
            return fileId;
        }).addStep(async (fileId) => {
            await globalFilePersister?.deleteFile(fileId);
        });
        const pullDelete = createPersistedFunction(localJsonPersister.jsonFile(`pullDelete`), async (fileId) => {
            await localFilePersister.deleteFile(fileId);
        });
        const Doc = factoryConfig.Doc.customize({
            docType: config.storeName,
            docStoreConfig: {
                ...docStoreConfig,
                onIncomingCreate: (docId) => {
                    pullCreate(docId);
                    docStoreConfig.onIncomingCreate?.(docId);
                },
                onIncomingDelete: (docId) => {
                    pullDelete(docId);
                    docStoreConfig.onIncomingDelete?.(docId);
                },
            },
        });
        // TODO: Maybe prevent this file from being directly created.
        class SyncedFile extends Doc {
            fileIsUploaded = prop(Boolean, false, Persistance.local);
            flagFileAsUploaded() {
                // Manually persist globally to signify that the file is uploaded.
                SyncedFile._docStore.batchUpdate({
                    [this.docId]: {
                        fileIsUploaded: {
                            value: true,
                            maxPersistance: Persistance.global,
                        },
                    },
                }, { overwriteGlobally: true });
            }
            fileIsDownloaded = prop(Boolean, false, Persistance.local);
            flagFileAsDownloaded() {
                this.fileIsDownloaded = true;
            }
            /** Won't resolve until it retrieves and returns the base64String. */
            async getBase64String() {
                let base64String;
                while (!isValid(base64String)) {
                    base64String = await localFilePersister.readFile(this.docId);
                    if (!isValid(base64String)) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                }
                return base64String;
            }
            static async createFromBase64String(base64String) {
                const docId = uuidv4();
                await localFilePersister.writeFile(docId, base64String);
                pushCreate(docId);
                SyncedFile._docStore.createDoc({
                    fileIsDownloaded: {
                        value: true,
                        maxPersistance: Persistance.local,
                    },
                }, docId);
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
