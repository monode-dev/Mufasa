import { initializeDocClass } from "./Doc.js";
import { setUpUploadEvents } from "./DocStore.js";
import { initializeSyncedFileClass } from "./FileStore.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export { DELETED_KEY, Persistance, } from "./DocStore.js";
// TODO: Implement database versioning.
export function initializeMufasa(mfsConfig) {
    setUpUploadEvents(mfsConfig.isUploading);
    return {
        ...initializeDocClass({
            getStage: mfsConfig.getStage ?? (() => `Dev`),
            getWorkspaceId: mfsConfig.getWorkspaceId ?? (() => `default-workspace`),
            defaultDocStoreConfig: mfsConfig.defaultDocConfig,
        }),
        ...initializeSyncedFileClass(),
    };
}
