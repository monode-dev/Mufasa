import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Device } from "../DocStore.js";
import { doNow } from "../Utils.js";
import { Capacitor } from "@capacitor/core";

// SECTION: Doc Persister
export function capacitorPersister(): Device.Persister {
  let shouldStop = false;
  let liveOperationCount = 0;
  return (directoryPath: string) => {
    const getFilePath = (fileId: string) => `${directoryPath}/${fileId}`;
    const readFile = async (fileId: string) => {
      if (shouldStop) return undefined;
      liveOperationCount++;
      let result: string | undefined = undefined;
      try {
        const data = (
          await Filesystem.readFile({
            path: getFilePath(fileId),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
          })
        ).data;
        result = typeof data === `string` ? data : await data.text();
      } catch (e) {}
      liveOperationCount--;
      return result;
    };
    const writeFile = async (fileId: string, base64String: string) => {
      if (shouldStop) return;
      liveOperationCount++;
      await Filesystem.writeFile({
        path: getFilePath(fileId),
        data: base64String,
        recursive: true,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      liveOperationCount--;
    };
    const deleteFile = async (fileId: string) => {
      if (shouldStop) return;
      liveOperationCount++;
      try {
        await Filesystem.deleteFile({
          path: getFilePath(fileId),
          directory: Directory.Data,
        });
      } catch (e) {}
      liveOperationCount--;
    };
    return {
      jsonFile: (fileName: string) => ({
        load<T extends Device.Json>(initJson: T) {
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
          const requestSave = async () => {
            await loadedFromLocalStorage;
            await writeFile(filePath, JSON.stringify(data.value));
          };

          // Give limited access to the json.
          return {
            get loadedFromLocalStorage() {
              return loadedFromLocalStorage;
            },
            get data() {
              return data.value as Device.ToReadonlyJson<T>;
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
      readFile,
      writeFile,
      deleteFile,
      stop: async () => {
        shouldStop = true;
        while (liveOperationCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      },
      deleteAllData: async () => {
        // TODO: Implement
      },
    };
  };
}
