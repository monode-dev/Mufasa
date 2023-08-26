"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSignalTree = void 0;
const utils_1 = require("./utils");
function newSignalTree(signal, root = {}, subTreePath = []) {
    // This lets us force create missing data on listens, and ignore missing data on triggers.
    return new Proxy(() => { }, {
        // Don't do anything unitl we know whether this is a trigger or a listen.
        get(_, propKey) {
            return newSignalTree(signal, root, [
                ...subTreePath,
                propKey.toString(),
            ]);
        },
        // Handle triggers and listens.
        apply() {
            if (subTreePath[subTreePath.length - 1] === `trigger`) {
                // Handle trigger
                const pathToSignal = subTreePath.slice(0, subTreePath.length - 1);
                let signalToTrigger = root;
                for (const key of pathToSignal) {
                    signalToTrigger = signalToTrigger?.[key];
                }
                if ((0, utils_1.exists)(signalToTrigger)) {
                    signalToTrigger.value++;
                }
            }
            else {
                // Handle listen
                let signalToListenTo = root;
                // Ensure path exists
                const pathToSignal = subTreePath.slice(0, subTreePath.length - 2);
                for (const key of pathToSignal) {
                    if (!(0, utils_1.exists)(signalToListenTo?.[key])) {
                        signalToListenTo[key] = {};
                    }
                    signalToListenTo = signalToListenTo[key];
                }
                // Ensure signal exists
                const signalKey = subTreePath[subTreePath.length - 2];
                if (!(0, utils_1.exists)(signalToListenTo?.[signalKey])) {
                    signalToListenTo[signalKey] = signal(0);
                }
                // Listen to signal
                signalToListenTo[signalKey].value;
            }
        },
    });
}
exports.newSignalTree = newSignalTree;
