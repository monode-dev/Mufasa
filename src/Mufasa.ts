import { from } from "solid-js";
import { GetDocStoreConfig, initializeDocClass } from "./Doc.js";
import { UploadEvents, setUpUploadEvents } from "./DocStore.js";
import { initializeFileStoreFactory } from "./FileStore.js";

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
  DELETED_KEY,
} from "./DocStore.js";
export { GlobalFilePersister, LocalFilePersister } from "./FileStore.js";

export function initializeMufasa(mfsConfig: {
  getDefaultPersistersFromDocType: GetDocStoreConfig;
  initDatabaseId?: string | null;
  isUploading?: UploadEvents;
}) {
  const initDatabaseId = mfsConfig.initDatabaseId ?? `default-database`;
  setUpUploadEvents(mfsConfig.isUploading);
  const docClassStuff = initializeDocClass({
    databaseId: initDatabaseId,
    getDocStoreConfig:
      mfsConfig.getDefaultPersistersFromDocType ?? (() => ({})),
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
  } as const;
}
