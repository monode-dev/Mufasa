import { from } from "solid-js";
import { initializeDocClass } from "./Doc.js";
import { UploadEvents, setUpUploadEvents, DocStoreConfig } from "./DocStore.js";
import { initializeSyncedFileClass } from "./FileStore.js";

export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export {
  GlobalDocPersister,
  LocalJsonFilePersister,
  LocalJsonPersister,
  SessionDocPersister,
  GlobalDocChange,
  DocJson,
  DocStoreConfig as DocPersisters,
  DocStore,
  UpdateBatch,
  GlobalFilePersister,
  LocalFilePersister,
  DELETED_KEY,
} from "./DocStore.js";

// TODO: Implement database versioning.
export function initializeMufasa<
  DefaultDocConfig extends DocStoreConfig,
>(mfsConfig: {
  defaultDocConfig: DefaultDocConfig;
  getWorkspaceId?: () => string | null;
  isUploading?: UploadEvents;
}) {
  setUpUploadEvents(mfsConfig.isUploading);
  const docClassStuff = initializeDocClass({
    getWorkspaceId: mfsConfig.getWorkspaceId ?? (() => `default-workspace`),
    defaultDocStoreConfig: mfsConfig.defaultDocConfig,
  });
  const fileStoreFactory = initializeSyncedFileClass(docClassStuff);
  return {
    ...docClassStuff,
    ...fileStoreFactory,
    // setWorkspace(workspaceId: string | null) {
    //   docClassStuff.swapToDatabase(dbId);
    //   fileStoreFactory.swapToDatabase(dbId);
    // },
    // deleteDatabaseLocally(dbId: string) {
    //   docClassStuff.deleteDatabaseLocally(dbId);
    //   fileStoreFactory.deleteDatabaseLocally(dbId);
    // },
  } as const;
}
