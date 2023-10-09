"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirestoreSync = exports.CHANGE_DATE_KEY = void 0;
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const utils_1 = require("./utils");
const PersistedFunctionManager_1 = require("./PersistedFunctionManager");
exports.CHANGE_DATE_KEY = `mfs_changeDate`;
function initializeFirestoreSync(firebaseApp, firestore, firebaseStorage, auth, isProduction, persistedFunctionManager, fileSystem) {
    const getFirestorePathToTypeCollection = (typeName) => {
        const collectionName = `${isProduction ? `Prod` : `Dev`}_${typeName}`;
        const userId = auth.currentUser?.uid;
        const path = `userData/${auth.currentUser?.uid}/${collectionName}`;
        return collectionName;
    };
    const savedDataFileName = `mfs_firestoreSavedData`;
    const _savedData = fileSystem
        .readFile(savedDataFileName)
        .then((saveFileString) => {
        return (0, utils_1.exists)(saveFileString)
            ? JSON.parse(saveFileString)
            : {};
    });
    async function updateSavedData(collectionName, mostRecentChangeDate) {
        const savedData = await _savedData;
        savedData[collectionName] = mostRecentChangeDate;
        requestSave();
    }
    // Start save Loop
    let saveIndex = 0;
    let lastSaveIndex = saveIndex;
    function requestSave() {
        saveIndex += 1;
    }
    _savedData.then(async (savedData) => {
        while (true) {
            if (lastSaveIndex !== saveIndex) {
                await fileSystem.writeFile(savedDataFileName, JSON.stringify(savedData));
                lastSaveIndex = saveIndex;
            }
            await (0, utils_1.sleep)(250);
        }
    });
    // Both file changes and doc changes require a doc change
    async function applyDocChange(change) {
        const docRef = (0, firestore_1.doc)(firestore, getFirestorePathToTypeCollection(change.typeName), change.docId);
        const props = {
            ...change.data,
            [exports.CHANGE_DATE_KEY]: (0, firestore_1.serverTimestamp)(),
        };
        if (change.shouldOverwrite) {
            await (0, firestore_1.setDoc)(docRef, props);
        }
        else {
            await (0, firestore_1.updateDoc)(docRef, props);
        }
    }
    const uploadFileChangeTypeName = `uploadFileChangeToGoogleStorage`;
    const uploadFileChange = persistedFunctionManager
        // Upload the new file
        .createPersistedFunction(uploadFileChangeTypeName, async (props) => {
        const data = await fileSystem.readFile(props.newFileId);
        if (!(0, utils_1.exists)(data))
            return PersistedFunctionManager_1.QUIT_PERSISTED_FUNCTION;
        const fileRef = (0, storage_1.ref)(firebaseStorage, props.newFileId);
        await (0, storage_1.uploadString)(fileRef, data);
        return props;
    })
        // Update the doc
        .addStage(async (props) => {
        await applyDocChange({
            shouldOverwrite: false,
            typeName: props.docTypeName,
            docId: props.docId,
            data: {
                [props.propName]: props.newFileId,
            },
        });
        return props;
    })
        // Delete the old file
        .addStage(async (props) => {
        if ((0, utils_1.exists)(props.oldFileId)) {
            const oldFileRef = (0, storage_1.ref)(firebaseStorage, props.oldFileId);
            // NOTE: I don't think we have to wait for these.
            fileSystem.deleteFile(props.oldFileId);
            try {
                (0, storage_1.deleteObject)(oldFileRef);
            }
            catch (e) {
                console.error(e);
            }
        }
    });
    const changeUploaders = {
        uploadDocChange: persistedFunctionManager.createPersistedFunction(`uploadDocChangeToFirestore`, applyDocChange),
        uploadFileChange(props) {
            uploadFileChange({
                docTypeName: props.docTypeName,
                docId: props.docId,
                propName: props.propName,
                newFileId: props.newFileId,
                oldFileId: props.oldFileId,
            });
            // Notify listeners so that they can show a loading indicator
            props.notifyUploadStarted();
        },
        deleteFile: persistedFunctionManager.createPersistedFunction(`deleteFileFromFirestore`, async (props) => {
            try {
                await (0, storage_1.deleteObject)((0, storage_1.ref)(firebaseStorage, props.fileId));
            }
            catch (e) {
                console.error(e);
            }
        }),
        isFileUploading(props) {
            const state = persistedFunctionManager.findFunctionData((functionData) => {
                return (functionData.functionTypeName === uploadFileChangeTypeName &&
                    functionData.stageIndex < 2 &&
                    functionData.props.docId === props.docId &&
                    functionData.props.propName === props.propName);
            });
            return (0, utils_1.exists)(state) && props.fileId === state.props.newFileId;
        },
        async downloadFile(fileId) {
            const bytes = await (0, storage_1.getBytes)((0, storage_1.ref)(firebaseStorage, fileId));
            const asString = new TextDecoder("utf-8").decode(bytes);
            await fileSystem.writeFile(fileId, asString);
        },
        async watchType(typeName, handleUpdate) {
            const savedData = await _savedData;
            const mostRecentChangeDateOnStartup = savedData[typeName] ?? 0;
            (0, firestore_1.onSnapshot)((0, firestore_1.query)((0, firestore_1.collection)(firestore, getFirestorePathToTypeCollection(typeName)), (0, firestore_1.where)(exports.CHANGE_DATE_KEY, ">", new Date(mostRecentChangeDateOnStartup * 1000 - 30))), (snapshot) => {
                let mostRecentChangeDate = savedData[typeName] ?? 0;
                snapshot.docChanges().forEach((change) => {
                    if (change.type !== "removed") {
                        const docData = change.doc.data();
                        mostRecentChangeDate = Math.max(mostRecentChangeDate, docData[exports.CHANGE_DATE_KEY].seconds);
                        handleUpdate(change.doc.ref.id, docData);
                    }
                });
                if (mostRecentChangeDate > savedData[typeName] ?? 0) {
                    updateSavedData(typeName, mostRecentChangeDate);
                }
            });
        },
    };
    return changeUploaders;
}
exports.initializeFirestoreSync = initializeFirestoreSync;
