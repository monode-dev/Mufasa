import { initializeDocClass } from "./Doc.js";
import { initializeFileStoreFactory } from "./FileStore.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export function initializeMufasa(mfsConfig) {
    const docClassStuff = initializeDocClass({
        getDefaultPersistersFromDocType: mfsConfig.getDefaultPersistersFromDocType ?? (() => ({})),
    });
    return {
        ...docClassStuff,
        ...initializeFileStoreFactory(docClassStuff),
    };
}
