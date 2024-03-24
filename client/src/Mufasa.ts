import { initializeDocClass } from "./Doc.js";
import { Session, Device, Cloud } from "./DocStore.js";
import { initializeSyncedFileClass } from "./File.js";
import { doNow, isValid } from "./Utils.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export {
  Cloud,
  Device,
  Session,
  DocJson,
  PersistanceConfig,
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
export function initializeMufasa<T extends {} = {}>(mfsConfig: {
  stage?: string;
  // getWorkspaceId?: () => string | null;
  sessionPersister: Session.Persister;
  devicePersister?: Device.Persister;
  cloudPersister?: Cloud.Persister<T>;
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
  const cloudPersistance = mfsConfig.cloudPersister?.({
    stage: mfsConfig.stage ?? `Dev`,
    sessionPersister: mfsConfig.sessionPersister,
    directoryPersister: mfsConfig.devicePersister?.(`UserMetadata`),
  });
  const getWorkspaceId = () =>
    isValid(cloudPersistance)
      ? cloudPersistance.getWorkspaceId()
      : `default-workspace`;
  return {
    ...initializeDocClass({
      stage: mfsConfig.stage ?? `Dev`,
      getWorkspaceId: getWorkspaceId,
      defaultPersistanceConfig: {
        sessionPersister: mfsConfig.sessionPersister,
        devicePersister: mfsConfig.devicePersister,
        getWorkspacePersister: cloudPersistance?.getWorkspacePersister,
        trackUpload,
        untrackUpload,
      },
    }),
    exports: (cloudPersistance?.exports ?? {}) as T,
    ...initializeSyncedFileClass(),
    get isUploadingToCloud() {
      return isUploadingToCloud.value;
    },
    get workspaceId() {
      return getWorkspaceId();
    },
  } as const;
}
