import { prop, getWorkspaceId, Doc, getStage, trackUpload, untrackUpload, } from "./Doc.js";
import { Persistance, createDocStore, } from "./DocStore.js";
import { v4 as uuidv4 } from "uuid";
import { isValid } from "./Utils.js";
import { createPersistedFunction } from "./PersistedFunction.js";
import { getFileStore } from "./Workspace.js";
export function initializeSyncedFileClass() {
    return {
        File(...params) {
            return File.customize({
                docType: params[0],
                ...params[1],
            });
        },
    };
}
export function createFileStore(config) {
    const pullCreate = createPersistedFunction(config.deviceDirectoryPersister.jsonFile(`pullCreate`), async (fileId) => {
        const fileData = await config.cloudWorkspacePersister.downloadFile(fileId);
        if (!isValid(fileData))
            return null;
        await config.deviceDirectoryPersister.writeFile(fileId, fileData);
        docStore.batchUpdate({
            [fileId]: {
                fileIsDownloaded: {
                    value: true,
                    maxPersistance: Persistance.local,
                },
            },
        }, { overwriteGlobally: false });
        return fileId;
    });
    const pullDelete = createPersistedFunction(config.deviceDirectoryPersister.jsonFile(`pullDelete`), async (fileId) => {
        await config.deviceDirectoryPersister.deleteFile(fileId);
    });
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
    const pushCreate = createPersistedFunction(config.deviceDirectoryPersister.jsonFile(`pushCreate`), async (fileId) => {
        trackUpload();
        if (!isValid(fileId))
            return;
        const fileData = await config.deviceDirectoryPersister.readFile(fileId);
        if (!isValid(fileData))
            return;
        config.cloudWorkspacePersister.uploadFile(fileId, fileData);
        // Manually persist globally to signify that the file is uploaded.
        docStore.batchUpdate({
            [fileId]: {
                fileIsUploaded: {
                    value: true,
                    maxPersistance: Persistance.global,
                },
            },
        }, { overwriteGlobally: true });
        untrackUpload();
    });
    return {
        docStore: docStore,
        async pushCreate(params) {
            const docId = params.manualDocId ?? uuidv4();
            await config.deviceDirectoryPersister.writeFile(docId, params.base64String);
            docStore.createDoc({
                fileIsDownloaded: {
                    value: true,
                    maxPersistance: Persistance.local,
                },
            }, docId);
            pushCreate(docId);
            return docId;
        },
        pullCreate,
        pushDelete: createPersistedFunction(config.deviceDirectoryPersister.jsonFile(`pushDelete`), async (fileId) => {
            trackUpload();
            await config.deviceDirectoryPersister.deleteFile(fileId);
            untrackUpload();
            return fileId;
        }).addStep(async (fileId) => {
            await config.cloudWorkspacePersister.deleteFile(fileId);
        }),
        pullDelete,
        async readFile(fileId) {
            return await config.deviceDirectoryPersister.readFile(fileId);
        },
    };
}
// TODO: Maybe prevent this file from being directly created.
class File extends Doc {
    static get _fileStore() {
        return getFileStore({
            stage: getStage(),
            workspaceId: getWorkspaceId(),
            docType: this.docType,
            getStoreConfig: this.getDocStoreConfig,
        });
    }
    get _fileStore() {
        return this.constructor._fileStore;
    }
    static get _docStore() {
        return this._fileStore.docStore;
    }
    fileIsUploaded = prop(Boolean, false, Persistance.local);
    fileIsDownloaded = prop(Boolean, false, Persistance.local);
    /** Won't resolve until it retrieves and returns the base64String. */
    async getBase64String() {
        let base64String;
        while (!isValid(base64String)) {
            base64String = await this._fileStore.readFile(this.docId);
            if (!isValid(base64String)) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }
        return base64String;
    }
    static async createFromBase64String(base64String) {
        return this._fromId(await this._fileStore.pushCreate({ base64String }));
    }
    onDelete() {
        this._fileStore.pushDelete(this.docId);
    }
}
