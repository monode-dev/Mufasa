import { initializeDocClass } from "./Doc.js";
import { Session, Device, Cloud } from "./DocStore.js";
import { initializeSyncedFileClass } from "./File.js";
import { doNow, isValid } from "./Utils.js";
import { CloudAuth, SignInFuncs, initializeAuth } from "./Workspace.js";
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
export function initializeMufasa<
  C extends Cloud.Persister<T>,
  T extends SignInFuncs,
>(mfsConfig: {
  stage?: string;
  sessionPersister: Session.Persister;
  devicePersister?: Device.Persister;
  cloudPersister: C;
}) {
  const stage = mfsConfig.stage ?? `Dev`;
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
  const user = initializeAuth({
    stage: stage,
    sessionPersister: mfsConfig.sessionPersister,
    directoryPersister:
      mfsConfig.devicePersister?.(`Auth`) ?? Device.mockDirectoryPersister,
    getCloudAuth: mfsConfig.cloudPersister.getCloudAuth,
  });
  // TODO: This should be inferred.
  const getWorkspaceId = () =>
    `workspace` in user.value && `id` in user.value.workspace
      ? user.value.workspace.id ?? null
      : null;
  return {
    ...initializeDocClass({
      stage: stage,
      getWorkspaceId: getWorkspaceId,
      defaultPersistanceConfig: {
        sessionPersister: mfsConfig.sessionPersister,
        devicePersister: mfsConfig.devicePersister,
        getWorkspacePersister: mfsConfig.cloudPersister.getWorkspacePersister,
        trackUpload,
        untrackUpload,
      },
    }),
    get user() {
      return user.value;
    },
    // get user(): ReturnType<
    //   typeof initializeAuth<ReturnType<C[`getCloudAuth`]>[`signInFuncs`]>
    // >[`value`] {
    //   return user.value;
    // },
    ...initializeSyncedFileClass(),
    get isUploadingToCloud() {
      return isUploadingToCloud.value;
    },
    get workspaceId() {
      return getWorkspaceId();
    },
  } as const;
}
