import { initializeDocClass } from "./Doc.js";
import { setUpUploadEvents } from "./DocStore.js";
import { initializeFileStoreFactory } from "./FileStore.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export { DELETED_KEY, } from "./DocStore.js";
export function initializeMufasa(mfsConfig) {
    // TODO: Allow this to be initialized to null.
    const initWorkspaceId = mfsConfig.initWorkspaceId ?? `default-database`;
    setUpUploadEvents(mfsConfig.isUploading);
    const docClassStuff = initializeDocClass({
        workspaceId: initWorkspaceId,
        defaultDocStoreConfig: mfsConfig.defaultDocConfig,
    });
    const fileStoreFactory = initializeFileStoreFactory(docClassStuff);
    return {
        ...docClassStuff,
        ...fileStoreFactory,
        // swapToDatabase(dbId: string | null) {
        //   docClassStuff.swapToDatabase(dbId);
        //   fileStoreFactory.swapToDatabase(dbId);
        // },
        // deleteDatabaseLocally(dbId: string) {
        //   docClassStuff.deleteDatabaseLocally(dbId);
        //   fileStoreFactory.deleteDatabaseLocally(dbId);
        // },
    };
}
