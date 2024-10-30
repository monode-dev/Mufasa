import { batch } from "solid-js";
import { initializeDocClass } from "./Doc";
import { Session, Device, Cloud, initializeStoreBank } from "./DocStore";
import { initializeSyncedFileClass } from "./File";
import { doNow, isValid } from "./Utils";
import { User, initializeAuth } from "./Workspace";
import { WorkspaceClass } from "./WorkspaceClass";
export { prop, formula } from "./Doc";
export { list } from "./List";
export type { ReadonlyList } from "./List";
export { isValid } from "./Utils";
export { Cloud, Device, Session, DELETED_KEY, Persistance } from "./DocStore";
export type {
  DocJson,
  PersistanceConfig,
  DocStore,
  UpdateBatch,
} from "./DocStore";
export type { WorkspaceIntegration, UserMetadata, UserInfo } from "./Workspace";
export { WorkspaceClass as Workspace } from "./WorkspaceClass";

// TODO: Implement database versioning.
/** Set up Mufasa for your app.
 * ```ts
 * import { initializeMufasa } from "@/mufasa/Mufasa";
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
  C extends Cloud.Persister<any>,
  W extends typeof WorkspaceClass,
>(mfsConfig: {
  stage?: string;
  workspaceClass?: W;
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
  const user = initializeAuth<{}, typeof WorkspaceClass>({
    stage: stage,
    sessionPersister: mfsConfig.sessionPersister,
    directoryPersister:
      mfsConfig.devicePersister?.(`Auth`) ?? Device.mockDirectoryPersister,
    getCloudAuth: mfsConfig.cloudPersister.getCloudAuth,
    workspaceClass: mfsConfig.workspaceClass,
  });
  const storeBank = initializeStoreBank({
    stage: stage,
    devicePersister: mfsConfig.devicePersister,
    workspaceSignature: doNow(async () => {
      while (user.value.isPending || user.value.workspace?.isPending) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      type WorkspaceSignature = { userId: string; workspaceId: string };
      type WorkspaceSignatureWatcher = (sig: WorkspaceSignature | null) => void;
      const workspaceSignatureWatchers: WorkspaceSignatureWatcher[] = [];
      let lastWorkspaceSignature: WorkspaceSignature | null = null;
      mfsConfig.sessionPersister.useRoot(() =>
        mfsConfig.sessionPersister.doWatch(() => {
          const newWorkspaceSignature =
            isValid(user.value.uid) && isValid(user.value.workspace?.id)
              ? {
                  userId: user.value.uid,
                  workspaceId: user.value.workspace.id,
                }
              : null;
          if (
            lastWorkspaceSignature?.userId === newWorkspaceSignature?.userId &&
            lastWorkspaceSignature?.workspaceId ===
              newWorkspaceSignature?.workspaceId
          ) {
            return;
          }
          lastWorkspaceSignature = newWorkspaceSignature;
          batch(() =>
            workspaceSignatureWatchers.forEach((watcher) =>
              watcher(lastWorkspaceSignature),
            ),
          );
        }),
      );
      return (newWatcher: WorkspaceSignatureWatcher) => {
        workspaceSignatureWatchers.push(newWatcher);
        newWatcher(lastWorkspaceSignature);
      };
      // return mfsConfig.sessionPersister.useRoot(() =>
      //   mfsConfig.sessionPersister.useFormula(() =>
      //     isValid(user.value.uid) && isValid(user.value.workspace?.id)
      //       ? {
      //           userId: user.value.uid,
      //           workspaceId: user.value.workspace.id,
      //         }
      //       : null,
      //   ),
      // );
    }),
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
    get user(): User<C, W> {
      return user.value as any;
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
