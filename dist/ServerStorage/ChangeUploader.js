"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadChangeUploader = void 0;
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const LocalCache_1 = require("../LocalCache");
const utils_1 = require("../utils");
function loadChangeUploader(firestoreDb, 
// firebaseApp: FirebaseApp,
getClientStorage, serverFileStorage) {
    function isFileChange(change) {
        return (0, utils_1.exists)(change?.newFileId);
    }
    function isFileDelete(change) {
        return (0, utils_1.exists)(change?.idOfFileToDelete);
    }
    // Init
    const cloudEnabled = (0, utils_1.exists)(firestoreDb);
    const storageEnabled = (0, utils_1.exists)(serverFileStorage) && cloudEnabled;
    const promisedClientStorage = getClientStorage(`mx_unPushedChanges`, {});
    let unpromisedClientStorage = undefined;
    (async () => {
        const clientStorage = await promisedClientStorage;
        unpromisedClientStorage = clientStorage;
        for (const changeId of Object.keys(clientStorage.data)) {
            uploadStashedChange(changeId);
        }
    })();
    // Upload a change to the server
    async function uploadStashedChange(changeId) {
        const clientStorage = await promisedClientStorage;
        const change = clientStorage.data[changeId];
        if (!(0, utils_1.exists)(change))
            return;
        // Apply to server
        if (isFileChange(change)) {
            // Upload file
            if (!change.haveUploadedFile) {
                if (!storageEnabled)
                    return;
                const data = await clientStorage.readFile(change.newFileId);
                if (!(0, utils_1.exists)(data)) {
                    clientStorage.updateData({
                        [changeId]: undefined,
                    });
                    return;
                }
                const fileRef = (0, storage_1.ref)(serverFileStorage, change.newFileId);
                await (0, storage_1.uploadString)(fileRef, data);
                // TODO: Figure out why typing isn't working and we have to do `as any`.
                clientStorage.updateData({
                    [changeId]: {
                        haveUploadedFile: true,
                    },
                });
            }
            // Apply doc change
            if ((0, utils_1.exists)(change.propPath)) {
                await applyDocChange({
                    shouldOverwrite: false,
                    docId: change.propPath.docId,
                    data: {
                        [change.propPath.propName]: change.newFileId,
                    },
                });
                // TODO: Figure out why typing isn't working and we have to do `as any`.
                clientStorage.updateData({
                    [changeId]: {
                        propPath: undefined,
                    },
                });
            }
            // Delete old file
            if ((0, utils_1.exists)(change.oldFileId)) {
                // console.log(
                //   `change.oldFileId: ${JSON.stringify(change.oldFileId, null, 2)}`,
                // );
                if (!storageEnabled)
                    return;
                const oldFileRef = (0, storage_1.ref)(serverFileStorage, change.oldFileId);
                // NOTE: I don't think we have to wait for these.
                clientStorage.deleteFile(change.oldFileId);
                try {
                    (0, storage_1.deleteObject)(oldFileRef);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        else if (isFileDelete(change)) {
            try {
                if (!storageEnabled)
                    return;
                await (0, storage_1.deleteObject)((0, storage_1.ref)(serverFileStorage, change.idOfFileToDelete));
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            // Doc Change
            await applyDocChange(change);
        }
        // Mark complete
        clientStorage.updateData({
            [changeId]: undefined,
        });
        // Both file changes and doc changes require a doc change
        async function applyDocChange(change) {
            if (!cloudEnabled)
                return;
            const docRef = (0, firestore_1.doc)(firestoreDb, change.docId);
            const props = {
                ...change.data,
                [LocalCache_1.CHANGE_DATE_KEY]: (0, firestore_1.serverTimestamp)(),
            };
            if (change.shouldOverwrite) {
                await (0, firestore_1.setDoc)(docRef, props);
            }
            else {
                await (0, firestore_1.updateDoc)(docRef, props);
            }
        }
    }
    return {
        async uploadDocChange(change) {
            if (!cloudEnabled)
                return;
            // Save in case app is closed
            const clientStorage = await promisedClientStorage;
            const changeId = (0, firestore_1.doc)((0, firestore_1.collection)(firestoreDb, `Mx_Change`)).path;
            clientStorage.updateData({
                [changeId]: change,
            });
            // Apply to server
            await uploadStashedChange(changeId);
        },
        async uploadFileChange(params) {
            if (!storageEnabled)
                return;
            const clientStorage = await promisedClientStorage;
            // Save in case app is closed
            const changeId = (0, firestore_1.doc)((0, firestore_1.collection)(firestoreDb, `Mx_Change`)).path;
            clientStorage.updateData({
                [changeId]: {
                    newFileId: params.newFileId,
                    haveUploadedFile: false,
                    propPath: {
                        docId: params.docId,
                        propName: params.propName,
                    },
                    oldFileId: params.oldFileId,
                },
            });
            // Notify listeners so that they can show a loading indicator
            params.notifyUploadStarted();
            // Apply to server
            await uploadStashedChange(changeId);
        },
        async deleteFile(params) {
            if (!(0, utils_1.exists)(firestoreDb))
                return;
            const clientStorage = await promisedClientStorage;
            // Save in case app is closed
            const changeId = (0, firestore_1.doc)((0, firestore_1.collection)(firestoreDb, `Mx_Change`)).path;
            clientStorage.updateData({
                [changeId]: {
                    idOfFileToDelete: params.fileId,
                },
            });
            // Apply to server
            await uploadStashedChange(changeId);
        },
        isFileUploading(params) {
            if (!storageEnabled)
                return false;
            if (!(0, utils_1.exists)(unpromisedClientStorage))
                return false;
            for (const change of Object.values(unpromisedClientStorage.data)) {
                if (!isFileChange(change))
                    continue;
                const propPath = change.propPath;
                if (!(0, utils_1.exists)(propPath))
                    continue;
                if (propPath.docId !== params.docId)
                    continue;
                if (propPath.propName !== params.propName)
                    continue;
                // If the prop has the new file id, then the upload has finished, we're just deleting the old file.
                return params.fileId !== change.newFileId;
            }
            return false;
        },
    };
}
exports.loadChangeUploader = loadChangeUploader;
