import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import {
  GetPersister,
  Json,
  LocalJsonPersister,
  PersisterSetup,
  ToReadonlyJson,
} from "../DocStore.js";
import { doNow } from "../Utils.js";
import { Capacitor } from "@capacitor/core";

// SECTION: Doc Persister
export function capacitorPersister(
  getDirectoryPath?: (setup: PersisterSetup) => string,
): GetPersister<LocalJsonPersister> {
  return (setup: PersisterSetup) => {
    const directoryPath =
      getDirectoryPath?.(setup) ?? `${setup.workspaceId}/${setup.docType}`;
    const getFilePath = (fileId: string) => `${directoryPath}/${fileId}`;
    return {
      jsonFile: (fileName: string) => ({
        start<T extends Json>(initJson: T) {
          const filePath = `${directoryPath}/${fileName}`;
          const data = {
            value: JSON.parse(JSON.stringify(initJson)) as T,
          };

          // Load json from storage.
          const loadedFromLocalStorage = doNow(async () => {
            const fileString = await readFile(filePath);
            if (!fileString) return;
            data.value = JSON.parse(fileString);
          });

          // Save doc store to device.
          const requestSave = doNow(() => {
            let saveIndex = 0;
            let lastSaveIndex = saveIndex;
            doNow(async () => {
              await loadedFromLocalStorage;
              /* Using a loop enables multi-threaded saving preventing concurrent
               * writes to disk. I'm not sure if this is necessary. */
              while (true) {
                const saveIndexAtStart = saveIndex;
                if (lastSaveIndex !== saveIndexAtStart) {
                  lastSaveIndex = saveIndexAtStart;
                  await writeStringFile(filePath, JSON.stringify(data));
                }
                await new Promise((resolve) => setTimeout(resolve, 10));
              }
            });
            return () => (saveIndex += 1);
          });

          // Give limited access to the json.
          return {
            get loadedFromLocalStorage() {
              return loadedFromLocalStorage;
            },
            get data() {
              return data.value as ToReadonlyJson<T>;
            },
            // This allows us to save after a write batch.
            async batchUpdate(
              doUpdate: (
                json: { value: T },
                doNotSave: () => void,
              ) => Promise<unknown> | unknown,
            ) {
              let shouldSave = true;
              await doUpdate(data, () => (shouldSave = false));
              if (shouldSave) requestSave();
            },
          };
        },
      }),
      getWebPath: (fileId) =>
        Filesystem.getUri({
          path: getFilePath(fileId),
          directory: Directory.Data,
        })
          .then(({ uri }) => Capacitor.convertFileSrc(uri))
          .catch(() => undefined),
      // TODO: We need to use strings for this.
      readFile: (fileId) => readFile(getFilePath(fileId)),
      writeFile: (fileId, base64String) =>
        writeStringFile(getFilePath(fileId), base64String),
      deleteFile: (fileId) => deleteFile(getFilePath(fileId)),
      // localJsonPersister: capacitorJsonPersister(`${directoryPath}.json`),
    };
  };
}

// export function capacitorFilePersister(
//   directoryPath: string,
// ): LocalFilePersister {
//   const getFilePath = (fileId: string) => `${directoryPath}/${fileId}`;
//   return {
//     getWebPath: (fileId) =>
//       Filesystem.getUri({
//         path: getFilePath(fileId),
//         directory: Directory.Data,
//       })
//         .then(({ uri }) => Capacitor.convertFileSrc(uri))
//         .catch(() => undefined),
//     // TODO: We need to use strings for this.
//     readFile: (fileId) => readFile(getFilePath(fileId)),
//     writeFile: (fileId, base64String) =>
//       writeStringFile(getFilePath(fileId), base64String),
//     deleteFile: (fileId) => deleteFile(getFilePath(fileId)),
//     localJsonPersister: capacitorJsonPersister(`${directoryPath}.json`),
//   };
// }

// SECTION: Capacitor Storage
async function readFile(path: string): Promise<string | undefined> {
  try {
    const results = await Filesystem.readFile({
      path: path,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    const data = results.data;
    return typeof data === `string` ? data : await data.text();
  } catch (e) {
    // console.log(`Failed to read: ${path}`);
    // console.log(e);
    return undefined;
  }
}
async function writeStringFile(path: string, contents: string) {
  await Filesystem.writeFile({
    path: path,
    data: contents,
    recursive: true,
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });
}
async function deleteFile(path: string) {
  try {
    await Filesystem.deleteFile({
      path: path,
      directory: Directory.Data,
    });
  } catch (e) {}
}
