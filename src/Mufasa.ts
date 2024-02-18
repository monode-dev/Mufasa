import { GetDefaultPersistersFromDocType, initializeDocClass } from "./Doc.js";
import { initializeFileStoreFactory } from "./FileStore.js";

export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";

export function initializeMufasa(mfsConfig: {
  getDefaultPersistersFromDocType: GetDefaultPersistersFromDocType;
}) {
  const docClassStuff = initializeDocClass({
    getDefaultPersistersFromDocType:
      mfsConfig.getDefaultPersistersFromDocType ?? (() => ({})),
  });
  const fileStoreFactory = initializeFileStoreFactory(docClassStuff);
  return {
    ...docClassStuff,
    ...fileStoreFactory,
  } as const;
}
