"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capacitorStorage = void 0;
const utils_1 = require("../utils");
function capacitorStorage(fileSystem) {
    return async function (fileName, init) {
        fileName = `${fileName}.json`;
        // Load data
        let data = await (async () => {
            const savedData = await fileSystem.readFile(fileName);
            if ((0, utils_1.exists)(savedData)) {
                return JSON.parse(savedData);
            }
            else {
                return init;
            }
        })();
        // Start save Loop
        let saveIndex = 0;
        let lastSaveIndex = saveIndex;
        function requestSave() {
            saveIndex += 1;
        }
        (async () => {
            while (true) {
                if (lastSaveIndex !== saveIndex) {
                    lastSaveIndex = saveIndex;
                    await fileSystem.writeFile(fileName, JSON.stringify(data));
                }
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        })();
        // Return interface
        return {
            // Adds and updates the given data
            updateData: ((updates) => {
                updateRec(data, updates);
                requestSave();
                function updateRec(original, updates) {
                    for (const propName in updates) {
                        const value = updates[propName];
                        if (value === undefined) {
                            // Undefined means delete
                            delete original[propName];
                        }
                        else if (typeof value === "object" &&
                            value !== null &&
                            !Array.isArray(value)) {
                            // Objects
                            if (!(0, utils_1.exists)(original[propName]) ||
                                typeof original[propName] !== "object" ||
                                Array.isArray(original[propName]) ||
                                original[propName] === null) {
                                original[propName] = {};
                            }
                            updateRec(original[propName], value);
                        }
                        else {
                            // Primitives
                            original[propName] = value;
                        }
                    }
                }
            }),
            /** Readonly access to the data. */
            data: data,
            // File operations
            readFile: fileSystem.readFile,
            writeFile: fileSystem.writeFile,
            deleteFile: fileSystem.deleteFile,
        };
    };
}
exports.capacitorStorage = capacitorStorage;
