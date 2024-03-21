import { DELETED_KEY } from "./DocStore.js";
import { isValid } from "./Utils.js";
const IS_VIRTUAL = Symbol("IS_VIRTUAL");
/** This is a virtual store, meaning if you ask for data that doesn't
 * exist we will create the data and return it. This allows the store
 * to work even when data is delayed. */
export function sessionTablePersister(mosaApi) {
    const rootProp = (initialValue) => mosaApi.useRoot(() => mosaApi.useProp(initialValue));
    // TODO: We might be able to track signal disposal and discard currently unused signals.
    const allDocIds = rootProp([]);
    const propSignals = {};
    return {
        batchUpdate(updates, newDocsAreOnlyVirtual) {
            // mosaApi.batch(() => {
            let haveAddedOrRemovedDocs = false;
            // Apply all doc updates
            Object.entries(updates).forEach(([docId, props]) => {
                // Create an object for any new docs
                if (!isValid(propSignals[docId])) {
                    propSignals[docId] = {
                        [IS_VIRTUAL]: rootProp(true),
                    };
                }
                // Flag docs that have just been added to the store.
                if (!newDocsAreOnlyVirtual && propSignals[docId][IS_VIRTUAL].value) {
                    propSignals[docId][IS_VIRTUAL].value = false;
                    haveAddedOrRemovedDocs = true;
                }
                // Update props
                Object.entries(props).forEach(([key, newValue]) => {
                    if (!isValid(propSignals[docId]?.[key])) {
                        propSignals[docId][key] = rootProp(newValue);
                    }
                    propSignals[docId][key].value = newValue;
                    haveAddedOrRemovedDocs ||= key === DELETED_KEY && newValue === true;
                });
            });
            // If docs have been added or removed, then update the list of all docs.
            if (haveAddedOrRemovedDocs) {
                allDocIds.value = Object.keys(propSignals).filter((docId) => !propSignals[docId]?.[DELETED_KEY]?.value &&
                    !propSignals[docId]?.[IS_VIRTUAL].value);
            }
            // });
        },
        getProp(docId, key, fallbackValue) {
            if (!isValid(propSignals[docId])) {
                propSignals[docId] = {
                    [IS_VIRTUAL]: rootProp(true),
                };
            }
            if (!isValid(propSignals[docId]?.[key])) {
                propSignals[docId][key] = mosaApi.useRoot(() => typeof fallbackValue === "function"
                    ? mosaApi.useFormula(fallbackValue)
                    : mosaApi.useProp(fallbackValue));
            }
            return propSignals[docId][key].value;
        },
        peekProp(docId, key) {
            return propSignals[docId]?.[key]?.value;
        },
        getAllDocs() {
            return allDocIds.value;
        },
        docExists(docId) {
            return (propSignals[docId]?.[IS_VIRTUAL].value === false &&
                propSignals[docId]?.[DELETED_KEY]?.value !== true);
        },
    };
}
