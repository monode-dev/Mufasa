import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Device } from "../DocStore.js";
import { doNow, isValid } from "../Utils.js";
import { Capacitor } from "@capacitor/core";

// SECTION: Doc Persister
export function capacitorPersister(): Device.Persister {
  return (directoryPath: string) => {
    let shouldStop = false;
    let liveOperationCount = 0;
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
          const data = {
            value: JSON.parse(JSON.stringify(initJson)) as T,
          };

          // Load json from storage.
          const loadedFromLocalStorage = doNow(async () => {
            const fileString = await readFile(fileName);
            if (!isValid(fileString)) return;
            data.value = JSON.parse(fileString);
          });

          // Give limited access to the json.
          return {
            get loadedFromLocalStorage() {
              return loadedFromLocalStorage;
            },
            get data() {
              return data.value as Device.ToReadonlyJson<T>;
            },
            get fileName() {
              return fileName;
            },
            // This allows us to save after a write batch.
            async batchUpdate(
              doUpdate: (
                json: { value: T },
                doNotSave: () => void,
              ) => Promise<unknown> | unknown,
            ) {
              await loadedFromLocalStorage;
              let shouldSave = true;
              await doUpdate(data, () => (shouldSave = false));
              if (shouldSave) {
                await writeFile(fileName, JSON.stringify(data.value));
              }
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
      deleteDirectory: async () => {
        console.log(`Deleting directory: ${directoryPath}`);
        try {
          const files = await Filesystem.readdir({
            path: directoryPath,
            directory: Directory.Data,
          });
          console.log(
            `Files in directory: ${files.files
              .map((file) => file.name)
              .join(`, `)}`,
          );
          await Promise.all(
            files.files.map((file) =>
              Filesystem.deleteFile({
                path: `${directoryPath}/${file.name}`,
                directory: Directory.Data,
              }).catch((e) => {
                console.warn;
              }),
            ),
          );
          await Filesystem.rmdir({
            path: directoryPath,
            directory: Directory.Data,
          });
          console.log(`Deleted directory: ${directoryPath}`);
        } catch (e) {
          console.warn(e);
        }
      },
      async export(outputPath) {
        console.log(`Capacitor export: ${directoryPath} to ${outputPath}`);
        await Filesystem.mkdir({
          path: outputPath,
          recursive: true,
          directory: Directory.Data,
        }).catch((e) => {
          console.warn(e);
        });
        try {
          const files = await Filesystem.readdir({
            path: directoryPath,
            directory: Directory.Data,
          });
          console.log(files.files.map((file) => file.name).join(`, `));
          // TODO: Decode all images.
          await Promise.all(
            files.files.map((file) =>
              Filesystem.readFile({
                path: `${directoryPath}/${file.name}`,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
              }).then(({ data }) => {
                Filesystem.writeFile({
                  path: `${outputPath}/${file.name}`,
                  data,
                  directory: Directory.Data,
                  encoding: Encoding.UTF8,
                })
                  .then(() => {
                    console.log(
                      `Exported: ${
                        file.name
                      } to ${`${outputPath}/${file.name}`}`,
                    );
                  })
                  .catch((e) => {
                    console.warn(e);
                  });
              }),
            ),
          );
        } catch (e) {
          console.warn(e);
        }
      },
    };
  };
}
