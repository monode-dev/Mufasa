import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Device } from "../DocStore";
import { doNow, isValid } from "../Utils";
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
        try {
          const files = await Filesystem.readdir({
            path: directoryPath,
            directory: Directory.Data,
          });
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
            // recursive: true,
          });
        } catch (e) {
          console.warn(e);
        }
      },
      async export(outputPath, shouldInclude) {
        await Filesystem.mkdir({
          path: outputPath,
          recursive: true,
          directory: Directory.Cache,
        }).catch((e) => {
          console.warn(e);
        });
        try {
          const files = await Filesystem.readdir({
            path: directoryPath,
            directory: Directory.Data,
          });
          // TODO: Decode all images.
          const _shouldInclude = (path: string) => {
            const fileName = path.split(`/`).pop()!;
            if (fileName.startsWith(`global`)) return false;
            if (fileName.startsWith(`push`)) return false;
            if (fileName.startsWith(`pull`)) return false;
            return true;
          };
          await Promise.all(
            files.files.map((file) =>
              _shouldInclude(`${directoryPath}/${file.name}`)
                ? Filesystem.readFile({
                    path: `${directoryPath}/${file.name}`,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                  })
                    .then((result) =>
                      Filesystem.writeFile(
                        file.name === `localDocs`
                          ? {
                              data: result.data,
                              path: `${outputPath}/${file.name}.json`,
                              encoding: Encoding.UTF8,
                              directory: Directory.Cache,
                            }
                          : {
                              data: result.data,
                              path: `${outputPath}/${file.name}.jpg`,
                              directory: Directory.Cache,
                            },
                      ),
                    )
                    .catch(async (e) => {
                      // await Filesystem.writeFile({
                      //   data: JSON.stringify(e, null, 2),
                      //   path: `${outputPath}/${file.name}.txt`,
                      //   encoding: Encoding.UTF8,
                      //   directory: Directory.Cache,
                      // });
                      console.warn(e);
                    })
                : Promise.resolve(),
            ),
          );
        } catch (e) {
          console.warn(e);
        }
      },
    };
  };
}
