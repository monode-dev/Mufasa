"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCache = exports.MX_PARENT_KEY = exports.DELETED_KEY = exports.CHANGE_DATE_KEY = void 0;
const firestore_1 = require("firebase/firestore");
const Parse_1 = require("./Parse");
const utils_1 = require("./utils");
const SignalTree_1 = require("./SignalTree");
const ChangeUploader_1 = require("./ServerStorage/ChangeUploader");
const storage_1 = require("firebase/storage");
exports.CHANGE_DATE_KEY = `mx_changeDate`;
exports.DELETED_KEY = `mx_deleted`;
exports.MX_PARENT_KEY = `mx_parent`;
function createCache({ typeSchemas, getCollectionName, firebaseApp, firestoreDb, _signal, getClientStorage, isProduction, }) {
    console.log(`About to Load client storage.`);
    const promisedClientStorage = getClientStorage(`mx_docs`, {
        lastChangeDate: {
            dev: 0,
            prod: 0,
        },
        types: {},
    });
    let clientStorage = undefined;
    (async () => {
        clientStorage = await promisedClientStorage;
    })();
    const docSignalTree = (0, SignalTree_1.newSignalTree)(_signal);
    const changeUploader = (0, ChangeUploader_1.loadChangeUploader)(firestoreDb, firebaseApp, getClientStorage);
    const serverFileStorage = (0, storage_1.getStorage)(firebaseApp);
    async function updateSessionStorage(params) {
        const clientStorage = await promisedClientStorage;
        const collectionName = getCollectionName(params.typeName);
        // We use this to defer triggering listeners until after we have updated the cache
        const thingsToTrigger = [];
        // If this doc is being created or deleted, record that so we can notify listeners later
        const isBeingCreated = !(0, utils_1.exists)(clientStorage.data?.types?.[collectionName]?.[params.docId]);
        const isBeingDeleted = params.props[exports.DELETED_KEY] === true;
        if (isBeingCreated || isBeingDeleted) {
            thingsToTrigger.push(() => {
                docSignalTree[params.typeName].docsChanged.trigger();
            });
        }
        // Record all the props that changed so we can notify listeners later
        const oldDoc = clientStorage.data?.types?.[collectionName]?.[params.docId];
        // TODO: Run these notifications even if a previous version doesn't exists.
        for (const propName of Object.keys(params.props)) {
            if (!(0, utils_1.exists)(oldDoc) || oldDoc[propName] !== params.props[propName]) {
                thingsToTrigger.push(() => {
                    docSignalTree[params.typeName].docs[params.docId][propName].trigger();
                });
                if (propName === exports.MX_PARENT_KEY) {
                    thingsToTrigger.push(() => {
                        docSignalTree[params.typeName].parents[params.props[propName]].trigger();
                    });
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
                    const bytes = await (0, storage_1.getBytes)((0, storage_1.ref)(serverFileStorage, fileId));
                    const asString = new TextDecoder("utf-8").decode(bytes);
                    await clientStorage.writeFile(fileId, asString);
                    docSignalTree[params.typeName].docs[params.docId][propName].trigger();
                })();
            }
        }
        // Apply the updates locally
        clientStorage.updateData({
            types: {
                [collectionName]: {
                    [params.docId]: params.props,
                },
            },
        });
        // Now that we've made the updates, then trigger the changes.
        thingsToTrigger.forEach((trigger) => trigger());
    }
    (async () => {
        const lastChangeDateProdKey = isProduction ? "prod" : "dev";
        const clientStorage = await promisedClientStorage;
        console.log(`Finished Loading promisedClientStorage`);
        for (const typeName of Object.keys(typeSchemas)) {
            console.log(`${typeName}: ${Object.keys(clientStorage.data.types?.[typeName] ?? {}).length}`);
            // Let the app know when the data is loaded.
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
        console.log(`lastChangeDate: ${clientStorage.data.lastChangeDate?.[lastChangeDateProdKey]}`);
        // for (const typeName in typeSchemas) {
        //   onSnapshot(
        //     query(
        //       collection(firestoreDb, getCollectionName(typeName)),
        //       where(
        //         CHANGE_DATE_KEY,
        //         ">",
        //         new Date(
        //           (clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ??
        //             0) *
        //             1000 -
        //             30,
        //         ),
        //       ),
        //     ),
        //     (snapshot) => {
        //       let mostRecentChangeDate =
        //         clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ?? 0;
        //       snapshot.docChanges().forEach((change) => {
        //         if (change.type !== "removed") {
        //           const docData = change.doc.data();
        //           mostRecentChangeDate = Math.max(
        //             mostRecentChangeDate,
        //             docData[CHANGE_DATE_KEY].seconds,
        //           );
        //           updateSessionStorage({
        //             typeName: typeName,
        //             docId: change.doc.ref.path,
        //             props: docData,
        //           });
        //         }
        //       });
        //       console.log(
        //         `${typeName} docs changed: ${snapshot.docChanges().length}`,
        //       );
        //       if (
        //         mostRecentChangeDate >
        //         (clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ?? 0)
        //       ) {
        //         clientStorage.updateData({
        //           lastChangeDate: {
        //             [lastChangeDateProdKey]: mostRecentChangeDate,
        //           } as any,
        //         });
        //         console.log(
        //           new Date(
        //             (clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ??
        //               0) *
        //               1000 -
        //               30,
        //           ),
        //         );
        //       }
        //     },
        //   );
        // }
    })();
    const result = {
        listAllObjectsOfType(typeName) {
            docSignalTree[typeName].docsChanged.listen();
            const objects = [];
            for (const [docId, thisDoc] of Object.entries(clientStorage?.data.types?.[getCollectionName(typeName)] ?? {})) {
                if ((0, utils_1.exists)(thisDoc[exports.DELETED_KEY]) && thisDoc[exports.DELETED_KEY])
                    continue;
                objects.push(docId);
            }
            return objects;
        },
        checkExists(typeName, docId) {
            docSignalTree[typeName].docsChanged.listen();
            return ((0, utils_1.exists)(docId) &&
                (0, utils_1.exists)(clientStorage?.data.types?.[getCollectionName(typeName)]?.[docId]));
        },
        getChildDocs(childType, parentId) {
            docSignalTree[childType].parents[parentId].listen();
            const children = [];
            for (const [docId, thisDoc] of Object.entries(clientStorage?.data.types?.[getCollectionName(childType)] ?? {})) {
                if ((0, utils_1.exists)(thisDoc[exports.DELETED_KEY]) && thisDoc[exports.DELETED_KEY])
                    continue;
                if (thisDoc?.[exports.MX_PARENT_KEY] === parentId) {
                    children.push(docId);
                }
            }
            return children;
        },
        getPropValue(typeName, docId, propName) {
            docSignalTree[typeName].docs[docId][propName].listen();
            const propValue = clientStorage?.data.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
            if (typeSchemas[typeName]?.[propName]?.format === "file") {
                if (!(0, utils_1.exists)(propValue) || typeof propValue !== "string")
                    return null;
                //  Check if a new file is being uploaded
                const fileIsUploading = changeUploader.isFileUploading({
                    docId,
                    propName,
                    fileId: propValue,
                });
                if (fileIsUploading)
                    return Parse_1.UPLOADING_FILE;
                // Read the file from storage.
                return clientStorage?.readFile(propValue) ?? null;
            }
            else {
                return propValue;
            }
        },
        addDoc(typeName, props) {
            const docId = (0, firestore_1.doc)((0, firestore_1.collection)(firestoreDb, getCollectionName(typeName))).path;
            changeUploader.uploadDocChange({
                shouldOverwrite: true,
                docId,
                data: props,
            });
            updateSessionStorage({ typeName, docId, props });
            return docId;
        },
        async setPropValue(typeName, docId, propName, value) {
            if (typeSchemas[typeName]?.[propName]?.format === "file") {
                const newFileId = (0, firestore_1.doc)((0, firestore_1.collection)(firestoreDb, `Mx_File`)).path;
                // Write the file
                clientStorage = await promisedClientStorage;
                await clientStorage.writeFile(newFileId, value);
                // Write to server
                const oldFileId = clientStorage?.data.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
                changeUploader.uploadFileChange({
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
                changeUploader.uploadDocChange({
                    shouldOverwrite: false,
                    docId,
                    data: changes,
                });
                // Write locally
                updateSessionStorage({ typeName, docId, props: changes });
            }
        },
        deleteDoc(typeName, docId) {
            changeUploader.uploadDocChange({
                shouldOverwrite: true,
                docId,
                data: {
                    [exports.DELETED_KEY]: true,
                },
            });
            // Delete any files
            for (const propName of Object.keys(typeSchemas[typeName])) {
                if (typeSchemas[typeName][propName]?.format === "file") {
                    const fileId = clientStorage?.data.types?.[getCollectionName(typeName)]?.[docId]?.[propName];
                    if ((0, utils_1.exists)(fileId)) {
                        changeUploader.deleteFile({ fileId });
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
    return result;
}
exports.createCache = createCache;
