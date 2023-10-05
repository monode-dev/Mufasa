"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCache = exports.MX_PARENT_KEY = exports.DELETED_KEY = void 0;
const Parse_1 = require("./Parse");
const utils_1 = require("./utils");
const SignalTree_1 = require("./SignalTree");
const FirestoreSync_1 = require("./FirestoreSync");
const uuid_1 = require("uuid");
exports.DELETED_KEY = `mx_deleted`;
exports.MX_PARENT_KEY = `mx_parent`;
function initializeCache({ typeSchemas, getCollectionName, firebaseOptions, _signal, persistedFunctionManager, fileSystem, isProduction, }) {
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
    const firestoreSync = (0, FirestoreSync_1.initializeFirestoreSync)(firebaseOptions, isProduction, persistedFunctionManager, fileSystem);
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
                            childLists: {
                                [collectionName]: {
                                    [oldDoc?.[propName]]: {
                                        [params.docId]: undefined,
                                    },
                                },
                            },
                        });
                        thingsToTrigger.push(() => {
                            docSignalTree[params.typeName].parents[oldDoc?.[propName]].trigger();
                        });
                    }
                    // Notify New Parent
                    if ((0, utils_1.exists)(params.props[propName])) {
                        await updateOfflineCache({
                            childLists: {
                                [collectionName]: {
                                    [params.props[propName]]: {
                                        [params.docId]: true,
                                    },
                                },
                            },
                        });
                        thingsToTrigger.push(() => {
                            docSignalTree[params.typeName].parents[params.props[propName]].trigger();
                        });
                    }
                }
            }
        }
        // Download any new files.
        for (const propName of Object.keys(params.props)) {
            if (typeSchemas[params.typeName][propName]?.format === "file") {
                const fileId = params.props[propName];
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
    _offlineCache.then(() => {
        // After we load data from the offline cache we should let the app know when the data is loaded.
        for (const typeName of Object.keys(typeSchemas)) {
            docSignalTree[typeName].docsChanged.trigger();
            for (const parentId of Object.keys(docSignalTree[typeName].parents)) {
                docSignalTree[typeName].parents[parentId].trigger();
            }
            for (const docId of Object.keys(docSignalTree[typeName].docs)) {
                for (const propName of Object.keys(docSignalTree[typeName].docs[docId])) {
                    docSignalTree[typeName].docs[docId][propName].trigger();
                }
            }
        }
        // Start syncing with the DB
        for (const typeName in typeSchemas) {
            firestoreSync.watchCollection(typeName, (docId, docUpdates) => {
                updateSessionStorage({
                    typeName: typeName,
                    docId: docId,
                    props: docUpdates,
                });
            });
        }
    });
    return {
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
            docSignalTree[childType].parents[parentId].listen();
            return Object.keys(unPromisedOfflineCache?.childLists?.[getCollectionName(childType)]?.[parentId] ?? {});
            // const children: string[] = [];
            // for (const [docId, thisDoc] of Object.entries(
            //   clientStorage?.data.types?.[getCollectionName(childType)] ?? {},
            // )) {
            //   if (exists(thisDoc[DELETED_KEY]) && thisDoc[DELETED_KEY]) continue;
            //   if (thisDoc?.[MX_PARENT_KEY] === parentId) {
            //     children.push(docId);
            //   }
            // }
            // return children;
        },
        getPropValue(typeName, docId, propName) {
            docSignalTree[typeName].docs[docId][propName].listen();
            const propValue = unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
            if (typeSchemas[typeName]?.[propName]?.format === "file") {
                if (!(0, utils_1.exists)(propValue) || typeof propValue !== "string")
                    return null;
                //  Check if a new file is being uploaded
                const fileIsUploading = firestoreSync.isFileUploading({
                    docId,
                    propName,
                    fileId: propValue,
                });
                if (fileIsUploading)
                    return Parse_1.UPLOADING_FILE;
                // Read the file from storage.
                return fileSystem.readFile(propValue) ?? null;
            }
            else {
                return propValue;
            }
        },
        getFilePath(typeName, docId, propName) {
            const fileId = unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
            if (!(0, utils_1.exists)(fileId))
                return null;
            return fileSystem.getFilePath(fileId) ?? null;
        },
        addDoc(typeName, props) {
            const docId = (0, uuid_1.v4)();
            firestoreSync.uploadDocChange({
                shouldOverwrite: true,
                typeName,
                docId,
                data: props,
            });
            updateSessionStorage({ typeName, docId, props });
            return docId;
        },
        async setPropValue(typeName, docId, propName, value) {
            if (typeSchemas[typeName]?.[propName]?.format === "file") {
                const newFileId = (0, uuid_1.v4)();
                // Write the file
                unPromisedOfflineCache = await _offlineCache;
                await fileSystem.writeFile(newFileId, value);
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
        deleteDoc(typeName, docId) {
            firestoreSync.uploadDocChange({
                shouldOverwrite: true,
                typeName,
                docId,
                data: {
                    [exports.DELETED_KEY]: true,
                },
            });
            // Delete any files
            for (const propName of Object.keys(typeSchemas[typeName])) {
                if (typeSchemas[typeName][propName]?.format === "file") {
                    const fileId = unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
                    if ((0, utils_1.exists)(fileId)) {
                        firestoreSync.deleteFile({ fileId });
                    }
                }
            }
            // Write locally
            const propKeys = Object.keys(typeSchemas[typeName]);
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
        },
    };
}
exports.initializeCache = initializeCache;
