import { doNow } from "../Utils";
// SECTION: Doc Persister
export function capacitorDocPersister(fileName, capacitor) {
    return {
        start(initJson) {
            let data = JSON.parse(JSON.stringify(initJson));
            // Load json from storage.
            const loadedFromLocalStorage = doNow(async () => {
                const fileString = await readFile(fileName);
                if (!fileString)
                    return;
                data = JSON.parse(fileString);
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
                        if (lastSaveIndex !== saveIndex) {
                            await writeFile(fileName, JSON.stringify(data));
                            lastSaveIndex = saveIndex;
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
                    return data;
                },
                // This allows us to save after a write batch.
                async batchUpdate(doUpdate) {
                    let shouldSave = true;
                    await doUpdate(data, () => (shouldSave = false));
                    if (shouldSave)
                        requestSave();
                },
            };
        },
    };
    // SECTION: Capacitor Storage
    async function readFile(path) {
        try {
            const results = await capacitor.Filesystem.readFile({
                path: path,
                directory: capacitor.Directory.Data,
                encoding: capacitor.Encoding.UTF8,
            });
            return results.data;
        }
        catch (e) {
            // console.log(`Failed to read: ${path}`);
            // console.log(e);
            return undefined;
        }
    }
    async function writeFile(path, contents) {
        await capacitor.Filesystem.writeFile({
            path: path,
            data: contents,
            recursive: true,
            directory: capacitor.Directory.Data,
            encoding: capacitor.Encoding.UTF8,
        });
    }
    async function deleteFile(path) {
        try {
            await capacitor.Filesystem.deleteFile({
                path: path,
                directory: capacitor.Directory.Data,
            });
        }
        catch (e) { }
    }
}
