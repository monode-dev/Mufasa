import { initializeDocClass } from "./Doc.js";
import { Device } from "./DocStore.js";
import { initializeSyncedFileClass } from "./File.js";
import { doNow } from "./Utils.js";
import { initializeAuth } from "./Workspace.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export { Cloud, Device, Session, DELETED_KEY, Persistance, } from "./DocStore.js";
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
export function initializeMufasa(mfsConfig) {
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
            isUploadingToCloud: mfsConfig.sessionPersister.useFormula(() => uploadCount.value > 0),
        };
    });
    const user = initializeAuth({
        stage: stage,
        sessionPersister: mfsConfig.sessionPersister,
        directoryPersister: mfsConfig.devicePersister?.(`Auth`) ?? Device.mockDirectoryPersister,
        getCloudAuth: mfsConfig.cloudPersister.getCloudAuth,
    });
    // TODO: This should be inferred.
    const getWorkspaceId = () => user.value.workspace?.id ?? null;
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
        ...initializeSyncedFileClass(),
        get isUploadingToCloud() {
            return isUploadingToCloud.value;
        },
        get workspaceId() {
            return getWorkspaceId();
        },
    };
}
