import { ClientStorage, GetClientStorage, JsonObject } from "./ClientStorage";
import { exists } from "../utils";

export function capacitorStorage(fileSystem: {
  readFile: (path: string) => Promise<string | undefined>;
  writeFile: (path: string, data: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
}): GetClientStorage {
  return async function <T extends JsonObject>(fileName: string, init: T) {
    fileName = `${fileName}.json`;

    // Load data
    let data: JsonObject = await (async () => {
      const savedData = await fileSystem.readFile(fileName);
      if (exists(savedData)) {
        return JSON.parse(savedData);
      } else {
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
        function updateRec(original: JsonObject, updates: JsonObject) {
          for (const propName in updates) {
            const value = updates[propName];
            if (value === undefined) {
              // Undefined means delete
              delete original[propName];
            } else if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              // Objects
              if (
                !exists(original[propName]) ||
                typeof original[propName] !== "object" ||
                Array.isArray(original[propName]) ||
                original[propName] === null
              ) {
                original[propName] = {};
              }
              updateRec(original[propName] as JsonObject, value);
            } else {
              // Primitives
              original[propName] = value;
            }
          }
        }
      }) as ClientStorage<T>["updateData"],

      /** Readonly access to the data. */
      data: data as ClientStorage<T>["data"],

      // File operations
      readFile: fileSystem.readFile,
      writeFile: fileSystem.writeFile,
      deleteFile: fileSystem.deleteFile,
    };
  };
}
