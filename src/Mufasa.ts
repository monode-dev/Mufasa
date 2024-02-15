import { GetDefaultPersistersFromDocType, initializeDocClass } from "./Doc";
import { initializeFileStoreFactory } from "./FileStore";

export { prop, formula } from "./Doc";
export { list } from "./List";
export { isValid } from "./Utils";

export function initializeMufasa(mfsConfig: {
  getDefaultPersistersFromDocType: GetDefaultPersistersFromDocType;
}) {
  const docClassStuff = initializeDocClass({
    getDefaultPersistersFromDocType:
      mfsConfig.getDefaultPersistersFromDocType ?? (() => ({})),
  });
  return {
    ...docClassStuff,
    ...initializeFileStoreFactory(docClassStuff),
  } as const;
}