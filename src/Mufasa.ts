import { MosaApi } from "@monode/mosa";
import { initializeDocClass } from "./Doc.js";
import {
  PersistanceConfig,
  LocalJsonPersister,
  GetPersister,
  GlobalDocPersister,
} from "./DocStore.js";
import { initializeSyncedFileClass } from "./FileStore.js";
import { doNow } from "./Utils.js";
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
  PersistanceConfig as DocPersisters,
  DocStore,
  UpdateBatch,
  DELETED_KEY,
  Persistance,
} from "./DocStore.js";
export { UserInfo } from "./Auth.js";
export { WorkspaceIntegration, UserMetadata } from "./Workspace.js";

// TODO: Implement database versioning.
/** Set up Mufasa for your app.
 * ```ts
 * import { initializeMufasa } from "mufasa";
 * import { solidPersister } from "mufasa/solid-js";
 * import { capacitorPersister } from "mufasa/capacitor";
 * import { firebasePersister } from "mufasa/firebase";
 *
 * export const mfs = initializeMufasa({
 *   sessionPersister: solidPersister,
 *   devicePersister: capacitorPersister,
 *   cloudPersister: firebasePersister,
 * });
 * ```
 */
export function initializeMufasa(mfsConfig: {
  stage?: string;
  getWorkspaceId?: () => string | null;
  sessionPersister: MosaApi;
  devicePersister?: GetPersister<LocalJsonPersister>;
  cloudPersister?: GetPersister<GlobalDocPersister>;
}) {
  const { trackUpload, untrackUpload, isUploadingToCloud } = doNow(() => {
    const uploadCount = mfsConfig.sessionPersister.useProp(0);
    return {
      trackUpload() {
        uploadCount.value++;
      },
      untrackUpload() {
        uploadCount.value--;
      },
      isUploadingToCloud: mfsConfig.sessionPersister.useFormula(
        () => uploadCount.value > 0,
      ),
    };
  });
  return {
    ...initializeDocClass({
      stage: mfsConfig.stage ?? `Dev`,
      getWorkspaceId: mfsConfig.getWorkspaceId ?? (() => null),
      defaultPersistanceConfig: {
        sessionConfig: mfsConfig.sessionPersister,
        getDevicePersister: mfsConfig.devicePersister,
        getCloudPersister: mfsConfig.cloudPersister,
        trackUpload,
        untrackUpload,
      },
    }),
    ...initializeSyncedFileClass(),
    get isUploadingToCloud() {
      return isUploadingToCloud.value;
    },
  } as const;
}
