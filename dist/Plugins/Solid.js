import { batch, createMemo, createSignal, untrack } from "solid-js";
import { DELETED_KEY } from "../DocStore.js";
import { isValid } from "../Utils.js";
const GET_FUNC = 0;
const SET_FUNC = 1;
const IS_VIRTUAL = Symbol("IS_VIRTUAL");
/** This is a virtual store, meaning if you ask for data that doesn't
 * exist we will create the data and return it. This allows the store
 * to work even when data is delayed. */
export function solidPersister() {
    // TODO: We might be able to track signal disposal and discard currently unused signals.
    const [getAllDocIds, setAllDocIds] = untrack(() => createSignal([], {
        equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
    }));
    const propSignals = {};
    return {
        batchUpdate(updates, newDocsAreOnlyVirtual) {
            batch(() => {
                let haveAddedOrRemovedDocs = false;
                // Apply all doc updates
                Object.entries(updates).forEach(([docId, props]) => {
                    // Create an object for any new docs
                    if (!isValid(propSignals[docId])) {
                        propSignals[docId] = {
                            [IS_VIRTUAL]: untrack(() => createSignal(true)),
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
                            propSignals[docId][key] = untrack(() => createSignal(newValue));
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
        getProp(docId, key, fallbackValue) {
            if (!isValid(propSignals[docId])) {
                propSignals[docId] = {
                    [IS_VIRTUAL]: untrack(() => createSignal(true)),
                };
            }
            if (!isValid(propSignals[docId]?.[key])) {
                propSignals[docId][key] = untrack(() => typeof fallbackValue === "function"
                    ? [createMemo(fallbackValue), () => { }]
                    : createSignal(fallbackValue));
            }
            return propSignals[docId][key][GET_FUNC]();
        },
        peekProp(docId, key) {
            return propSignals[docId]?.[key]?.[GET_FUNC]();
        },
        getAllDocs() {
            return getAllDocIds();
        },
        docExists(docId) {
            return (propSignals[docId]?.[IS_VIRTUAL][GET_FUNC]() === false &&
                propSignals[docId]?.[DELETED_KEY]?.[GET_FUNC]() !== true);
        },
    };
}
