import { DELETED_KEY } from "../DocStore";
import { isValid } from "../Utils";
const GET_FUNC = 0;
const SET_FUNC = 1;
const IS_VIRTUAL = Symbol("IS_VIRTUAL");
/** This is a virtual store, meaning if you ask for data that doesn't
 * exist we will create the data and return it. This allows the store
 * to work even when data is delayed. */
export function solidPersister(solidJs) {
    // TODO: We might be able to track signal disposal and discard currently unused signals.
    const [getAllDocIds, setAllDocIds] = solidJs.untrack(() => solidJs.createSignal([], {
        equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
    }));
    const propSignals = {};
    return {
        batchUpdate(updates, newDocsAreOnlyVirtual) {
            solidJs.batch(() => {
                let haveAddedOrRemovedDocs = false;
                // Apply all doc updates
                Object.entries(updates).forEach(([docId, props]) => {
                    // Create an object for any new docs
                    if (!isValid(propSignals[docId])) {
                        propSignals[docId] = {
                            [IS_VIRTUAL]: solidJs.untrack(() => solidJs.createSignal(true)),
                        };
                    }
                    // Flag docs that have just been added to the store.
                    if (!newDocsAreOnlyVirtual &&
                        propSignals[docId][IS_VIRTUAL][GET_FUNC]()) {
                        propSignals[docId][IS_VIRTUAL][SET_FUNC](false);
                        haveAddedOrRemovedDocs = true;
                    }
                    // Update props
                    Object.entries(props).forEach(([key, newValue]) => {
                        if (!isValid(propSignals[docId]?.[key])) {
                            propSignals[docId][key] = solidJs.untrack(() => solidJs.createSignal(newValue));
                        }
                        propSignals[docId][key][SET_FUNC](newValue);
                        haveAddedOrRemovedDocs ||= key === DELETED_KEY && newValue === true;
                    });
                });
                // If docs have been added or removed, then update the list of all docs.
                if (haveAddedOrRemovedDocs) {
                    setAllDocIds(Object.keys(propSignals).filter((docId) => !propSignals[docId]?.[DELETED_KEY]?.[GET_FUNC]() &&
                        !propSignals[docId]?.[IS_VIRTUAL][GET_FUNC]()));
                }
            });
        },
        getProp(docId, key, initValue) {
            if (!isValid(propSignals[docId])) {
                propSignals[docId] = {
                    [IS_VIRTUAL]: solidJs.untrack(() => solidJs.createSignal(true)),
                };
            }
            if (!isValid(propSignals[docId]?.[key])) {
                propSignals[docId][key] = solidJs.untrack(() => typeof initValue === "function"
                    ? [solidJs.createMemo(initValue), () => { }]
                    : solidJs.createSignal(initValue));
            }
            return propSignals[docId][key][GET_FUNC]();
        },
        getAllDocs() {
            return getAllDocIds();
        },
    };
}
