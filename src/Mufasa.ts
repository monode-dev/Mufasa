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
  Persistance,
} from "./DocStore.js";
export { UserInfo } from "./Auth.js";
export { WorkspaceIntegration, UserMetadata } from "./Workspace.js";

// TODO: Implement database versioning.
export function initializeMufasa<
  DefaultDocConfig extends DocStoreConfig,
>(mfsConfig: {
  defaultDocConfig: DefaultDocConfig;
  getStage?: () => string | null;
  getWorkspaceId?: () => string | null;
  isUploading?: UploadEvents;
}) {
  setUpUploadEvents(mfsConfig.isUploading);
  return {
    ...initializeDocClass({
      getStage: mfsConfig.getStage ?? (() => `Dev`),
      getWorkspaceId: mfsConfig.getWorkspaceId ?? (() => `default-workspace`),
      defaultDocStoreConfig: mfsConfig.defaultDocConfig,
    }),
    ...initializeSyncedFileClass(),
  } as const;
}
