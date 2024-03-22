import { initializeDocClass } from "./Doc.js";
import { initializeSyncedFileClass } from "./FileStore.js";
import { doNow } from "./Utils.js";
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
 *   sessionPersister: solidPersister,
 *   devicePersister: capacitorPersister,
 *   cloudPersister: firebasePersister,
 * });
 * ```
 */
export function initializeMufasa(mfsConfig) {
    const workspaceId = mfsConfig.sessionPersister.useProp(null);
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
    const cloudPersistance = mfsConfig.cloudPersister?.({
        stage: mfsConfig.stage ?? `Dev`,
        sessionPersister: mfsConfig.sessionPersister,
        setWorkspaceId: (id) => {
            workspaceId.value = id;
        },
        directoryPersister: mfsConfig.devicePersister?.(`UserMetadata`),
    });
    return {
        ...initializeDocClass({
            stage: mfsConfig.stage ?? `Dev`,
            getWorkspaceId: () => workspaceId.value,
            defaultPersistanceConfig: {
                sessionPersister: mfsConfig.sessionPersister,
                devicePersister: mfsConfig.devicePersister,
                getWorkspacePersister: cloudPersistance?.getWorkspacePersister,
                trackUpload,
                untrackUpload,
            },
        }),
        exports: (cloudPersistance?.exports ?? {}),
        ...initializeSyncedFileClass(),
        get isUploadingToCloud() {
            return isUploadingToCloud.value;
        },
        get workspaceId() {
            return workspaceId.value;
        },
    };
}
