import { Doc, getStage, getWorkspaceId, prop } from "./Doc.js";
import { Persistance } from "./DocStore.js";
import { isValid } from "./Utils.js";
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
