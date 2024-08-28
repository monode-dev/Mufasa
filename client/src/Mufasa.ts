import { initializeDocClass } from "./Doc.js";
import { Session, Device, Cloud, initializeStoreBank } from "./DocStore.js";
import { initializeSyncedFileClass } from "./File.js";
import { doNow, isValid } from "./Utils.js";
import { User, initializeAuth } from "./Workspace.js";
export { prop, formula } from "./Doc.js";
export { list, ReadonlyList } from "./List.js";
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
export { WorkspaceIntegration, UserMetadata, UserInfo } from "./Workspace.js";

// TODO: Implement database versioning.
/** Set up Mufasa for your app.
 * ```ts
 * import { initializeMufasa } from "mufasa";
 * import { solidPersister } from "mufasa/solid-js";
 * import { capacitorPersister } from "mufasa/capacitor";
 * import { firebasePersister } from "mufasa/firebase";
 *
 * export const mfs = initializeMufasa({
 *   sessionPersister: solidPersister(),
 *   devicePersister: capacitorPersister(),
 *   cloudPersister: firebasePersister(...),
 * });
 * ```
 */
export function initializeMufasa<C extends Cloud.Persister<any>>(mfsConfig: {
  stage?: string;
  sessionPersister: Session.Persister;
  devicePersister?: Device.Persister;
  cloudPersister: C;
}) {
  const stage = mfsConfig.stage ?? `Dev`;
  const { trackUpload, untrackUpload, isUploadingToCloud } = doNow(() => {
    const { useProp, useFormula, useRoot } = mfsConfig.sessionPersister;
    const uploadCount = useProp(0);
    return {
      trackUpload() {
        uploadCount.value++;
      },
      untrackUpload() {
        uploadCount.value--;
      },
      isUploadingToCloud: useRoot(() =>
        useFormula(() => uploadCount.value > 0),
      ),
    };
  });
  const { trackDownload, untrackDownload, isDownloadingFromCloud } = doNow(
    () => {
      const { useProp, useFormula, useRoot } = mfsConfig.sessionPersister;
      const downloadCount = useProp(0);
      return {
        trackDownload() {
          downloadCount.value++;
        },
        untrackDownload() {
          downloadCount.value--;
        },
        isDownloadingFromCloud: useRoot(() =>
          useFormula(() => (downloadCount.value > 0 ? `definitely` : `maybe`)),
        ),
      };
    },
  );
  const mfsAuth = initializeAuth<{}>({
    stage: stage,
    sessionPersister: mfsConfig.sessionPersister,
    directoryPersister:
      mfsConfig.devicePersister?.(`Auth`) ?? Device.mockDirectoryPersister,
    getCloudAuth: mfsConfig.cloudPersister.getCloudAuth,
  });
  const storeBank = initializeStoreBank({
    stage: stage,
    devicePersister: mfsConfig.devicePersister,
    workspaceCacheId: mfsConfig.sessionPersister.useRoot(() =>
      mfsConfig.sessionPersister.useFormula(() => mfsAuth.workspaceCacheId),
    ),
  });
  const docSetup = initializeDocClass({
    storeBank: storeBank,
    defaultPersistance: {
      sessionPersister: mfsConfig.sessionPersister,
      devicePersister: mfsConfig.devicePersister,
      getWorkspacePersister: mfsConfig.cloudPersister.getWorkspacePersister,
      trackUpload,
      untrackUpload,
      trackDownload,
      untrackDownload,
    },
  });
  const fileSetup = initializeSyncedFileClass();
  return {
    Doc: docSetup.Doc,
    get user(): User<C> {
      return mfsAuth.user;
    },
    File: fileSetup.File,
    get isUploadingToCloud() {
      return isUploadingToCloud.value;
    },
    get isDownloadingFromCloud() {
      return isDownloadingFromCloud.value;
    },
  } as const;
}
