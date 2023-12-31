"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCache = exports.MX_PARENT_KEY = exports.DELETED_KEY = void 0;
const Parse_1 = require("./Parse");
const utils_1 = require("./utils");
const SignalTree_1 = require("./SignalTree");
const FirestoreSync_1 = require("./FirestoreSync");
const uuid_1 = require("uuid");
const Reactivity_1 = require("./Reactivity");
exports.DELETED_KEY = `mx_deleted`;
exports.MX_PARENT_KEY = `mx_parent`;
function initializeCache({ getCollectionName, firebaseApp, _signal, formula, persistedFunctionManager, fileSystem, isProduction, }) {
    const offlineCacheFileName = `mfs_offlineCache`;
    const _offlineCache = fileSystem
        .readFile(offlineCacheFileName)
        .then((saveFileString) => {
        return ((0, utils_1.exists)(saveFileString) ? JSON.parse(saveFileString) : {});
    });
    let unPromisedOfflineCache = undefined;
    _offlineCache.then((cache) => {
        unPromisedOfflineCache = cache;
    });
    async function updateOfflineCache(updates) {
        const offlineCache = await _offlineCache;
        updateRec(offlineCache, updates);
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
        requestSave();
    }
    // Start save Loop
    let saveIndex = 0;
    let lastSaveIndex = saveIndex;
    function requestSave() {
        saveIndex += 1;
    }
    _offlineCache.then(async (offlineCache) => {
        while (true) {
            if (lastSaveIndex !== saveIndex) {
                await fileSystem.writeFile(offlineCacheFileName, JSON.stringify(offlineCache));
                lastSaveIndex = saveIndex;
            }
            await (0, utils_1.sleep)(250);
        }
    });
    // Signal tree
    const docSignalTree = (0, SignalTree_1.newSignalTree)(_signal);
    const firestoreSync = (0, FirestoreSync_1.initializeFirestoreSync)(firebaseApp, isProduction, persistedFunctionManager, fileSystem);
    async function updateSessionStorage(params) {
        const offlineCache = await _offlineCache;
        const collectionName = getCollectionName(params.typeName);
        // We use this to defer triggering listeners until after we have updated the cache
        const thingsToTrigger = [];
        // If this doc is being created or deleted, record that so we can notify listeners later
        const isBeingCreated = !(0, utils_1.exists)(offlineCache.types?.[collectionName]?.[params.docId]);
        const isBeingDeleted = params.props[exports.DELETED_KEY] === true;
        if (isBeingCreated || isBeingDeleted) {
            thingsToTrigger.push(() => {
                docSignalTree[params.typeName].docsChanged.trigger();
            });
        }
        // Record all the props that changed so we can notify listeners later
        const oldDoc = offlineCache.types?.[collectionName]?.[params.docId];
        // TODO: Run these notifications even if a previous version doesn't exists.
        for (const propName of Object.keys(params.props)) {
            if (!(0, utils_1.exists)(oldDoc) || oldDoc[propName] !== params.props[propName]) {
                thingsToTrigger.push(() => {
                    docSignalTree[params.typeName].docs[params.docId][propName].trigger();
                });
                if (propName === exports.MX_PARENT_KEY) {
                    // Notify Old Parent
                    if ((0, utils_1.exists)(oldDoc?.[propName])) {
                        await updateOfflineCache({
                            indexes: {
                                [params.typeName]: {
                                    [propName]: {
                                        [oldDoc?.[propName]]: {
                                            [params.docId]: undefined,
                                        },
                                    },
                                },
                            },
                        });
                        thingsToTrigger.push(() => {
                            docSignalTree[params.typeName].indexes[propName][oldDoc?.[propName]].trigger();
                        });
                    }
                    // Notify New Parent
                    if ((0, utils_1.exists)(params.props[propName])) {
                        await updateOfflineCache({
                            indexes: {
                                [params.typeName]: {
                                    [propName]: {
                                        [params.props[propName]]: {
                                            [params.docId]: true,
                                        },
                                    },
                                },
                            },
                        });
                        thingsToTrigger.push(() => {
                            docSignalTree[params.typeName].indexes[propName][params.props[propName]].trigger();
                        });
                    }
                }
            }
        }
        // Download any new files.
        for (const propName of Object.keys(params.props)) {
            const propValue = params.props[propName];
            if (typeof propValue === "object" && propValue?.typeName === `file`) {
                const fileId = propValue.value;
                if (!(0, utils_1.exists)(fileId))
                    continue;
                (async () => {
                    // TODO: Persist this file download in case it gets interrupted.
                    await firestoreSync.downloadFile(fileId);
                    docSignalTree[params.typeName].docs[params.docId][propName].trigger();
                })();
            }
        }
        // Apply the updates locally
        await updateOfflineCache({
            types: {
                [collectionName]: {
                    [params.docId]: params.props,
                },
            },
        });
        // Now that we've made the updates, then trigger the changes.
        thingsToTrigger.forEach((trigger) => trigger());
    }
    // We need to tell the DB what types to watch for.
    const syncedTypes = new Set();
    async function syncType(typeName) {
        await _offlineCache;
        if (syncedTypes.has(typeName))
            return;
        syncedTypes.add(typeName);
        // Start syncing with the DB
        firestoreSync.watchType(typeName, (docId, docUpdates) => {
            updateSessionStorage({
                typeName: typeName,
                docId: docId,
                props: docUpdates,
            });
        });
    }
    _offlineCache.then((offlineCache) => {
        const typeNames = Object.keys(offlineCache.types ?? {});
        // After we load data from the offline cache we should let the app know when the data is loaded.
        for (const typeName of typeNames) {
            docSignalTree[typeName].docsChanged.trigger();
            for (const propName of Object.keys(docSignalTree[typeName].indexes)) {
                for (const propValue of Object.keys(docSignalTree[typeName].indexes[propName])) {
                    docSignalTree[typeName].indexes[propName][propValue].trigger();
                }
            }
            for (const docId of Object.keys(docSignalTree[typeName].docs)) {
                for (const propName of Object.keys(docSignalTree[typeName].docs[docId])) {
                    docSignalTree[typeName].docs[docId][propName].trigger();
                }
            }
        }
        // Start syncing with the DB
        typeNames.forEach(syncType);
    });
    return {
        syncType: syncType,
        listAllObjectsOfType(typeName) {
            docSignalTree[typeName].docsChanged.listen();
            const objects = [];
            for (const [docId, thisDoc] of Object.entries(unPromisedOfflineCache?.types?.[getCollectionName(typeName)] ?? {})) {
                if ((0, utils_1.exists)(thisDoc[exports.DELETED_KEY]) && thisDoc[exports.DELETED_KEY])
                    continue;
                objects.push(docId);
            }
            return objects;
        },
        checkExists(typeName, docId) {
            docSignalTree[typeName].docsChanged.listen();
            return ((0, utils_1.exists)(docId) &&
                (0, utils_1.exists)(unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]));
        },
        getChildDocs(childType, parentId) {
            return this.getIndexedDocs(childType, exports.MX_PARENT_KEY, parentId);
        },
        getIndexedDocs(typeName, propName, propValue) {
            docSignalTree[typeName].indexes[propName][propValue].listen();
            return Object.keys(unPromisedOfflineCache?.indexes?.[typeName]?.[propName]?.[propValue] ??
                {});
        },
        getPropValue(typeName, docId, propName) {
            docSignalTree[typeName].docs[docId][propName].listen();
            const propValue = unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
            if (typeof propValue === "object" && propValue?.typeName === `file`) {
                const fileId = propValue.value;
                //  Check if a new file is being uploaded
                const fileIsUploading = firestoreSync.isFileUploading({
                    docId,
                    propName,
                    fileId: fileId,
                });
                if (fileIsUploading)
                    return Parse_1.UPLOADING_FILE;
                // Read the file from storage.
                return fileSystem.readFile(fileId) ?? utils_1.NONEXISTENT;
            }
            else {
                return propValue ?? utils_1.NONEXISTENT;
            }
        },
        getFilePath(typeName, docId, propName) {
            const fileId = unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
            if (!(0, utils_1.exists)(fileId))
                return null;
            return fileSystem.getFilePath(fileId) ?? null;
        },
        addDoc(typeName, props) {
            const mfsId = (0, uuid_1.v4)();
            firestoreSync.uploadDocChange({
                shouldOverwrite: true,
                typeName,
                docId: mfsId,
                data: props,
            });
            updateSessionStorage({ typeName, docId: mfsId, props });
            return mfsId;
        },
        async setPropValue(typeName, docId, propName, value) {
            if (typeof value === "object" && value?.typeName === `file`) {
                const newFileId = (0, uuid_1.v4)();
                // Write the file
                unPromisedOfflineCache = await _offlineCache;
                await fileSystem.writeFile(newFileId, value.value);
                // Write to server
                const oldFileId = unPromisedOfflineCache.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
                firestoreSync.uploadFileChange({
                    docTypeName: typeName,
                    docId,
                    propName,
                    newFileId,
                    oldFileId: oldFileId ?? undefined,
                    notifyUploadStarted: docSignalTree[typeName].docs[docId][propName].trigger,
                });
            }
            else {
                // Write to server
                const changes = {
                    [propName]: value,
                };
                firestoreSync.uploadDocChange({
                    shouldOverwrite: false,
                    typeName,
                    docId,
                    data: changes,
                });
                // Write locally
                updateSessionStorage({ typeName, docId, props: changes });
            }
        },
        // TODO: Insert a addIndex function here.
        async indexOnProp(typeName, propName) {
            const offlineCache = await _offlineCache;
            const collectionName = getCollectionName(typeName);
            // Index all existing docs
            const indexedData = {};
            for (const [docId, docData] of Object.entries(offlineCache.types?.[collectionName] ?? {})) {
                const propValue = docData[propName];
                if ((0, utils_1.exists)(propValue)) {
                    indexedData[propValue] = {
                        ...(indexedData[propValue] ?? {}),
                        [docId]: true,
                    };
                }
            }
            // Add the index
            updateOfflineCache({
                indexes: {
                    [typeName]: {
                        [propName]: indexedData,
                    },
                },
            });
        },
        createProp(initValue) {
            const signal = _signal(initValue);
            return {
                [Reactivity_1.MFS_IS_PROP]: true,
                get() {
                    return signal.value;
                },
                set(newValue) {
                    signal.value = newValue;
                },
            };
        },
        createFormula: formula,
        deleteDoc(typeName, docId) {
            firestoreSync.uploadDocChange({
                shouldOverwrite: true,
                typeName,
                docId,
                data: {
                    [exports.DELETED_KEY]: true,
                },
            });
            const docData = unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId];
            if ((0, utils_1.exists)(docData)) {
                const propKeys = Object.keys(docData);
                // Delete any files
                for (const propName of Object.keys(docData)) {
                    const propValue = docData[propName];
                    if (typeof propValue === "object" && propValue?.typeName === `file`) {
                        const fileId = propValue.value;
                        if ((0, utils_1.exists)(fileId)) {
                            firestoreSync.deleteFile({ fileId });
                        }
                    }
                }
                // Write locally
                updateSessionStorage({
                    typeName,
                    docId,
                    props: {
                        [exports.DELETED_KEY]: true,
                        [exports.MX_PARENT_KEY]: undefined,
                        ...propKeys.reduce((total, curr) => ({
                            ...total,
                            [curr]: undefined,
                        }), {}),
                    },
                });
            }
        },
    };
}
exports.initializeCache = initializeCache;
