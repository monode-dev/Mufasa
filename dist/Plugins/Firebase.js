import { onSnapshot, query, where, updateDoc, doc as docRef, setDoc, serverTimestamp, and, or, } from "firebase/firestore";
import { uploadString, deleteObject, getBytes, } from "firebase/storage";
import { isValid } from "../Utils.js";
export function firestoreDocPersister(collectionRef, ...queryConstraints) {
    const CHANGE_DATE_KEY = `mx_changeDate`;
    const useServerTimestamp = serverTimestamp();
    return {
        start: async (batchUpdate, localJsonFilePersister) => {
            const metaData = localJsonFilePersister.start({
                lastChangeDatePosix: 0,
            });
            metaData.loadedFromLocalStorage.then(() => {
                const testDate = new Date(Math.max(metaData.data.lastChangeDatePosix - 30000, 0));
                onSnapshot(query(collectionRef, and(or(
                // TODO: If a docs CHANGE_DATE_KEY is changed then it is removed and re-added to this query.
                where(CHANGE_DATE_KEY, ">", testDate), where(CHANGE_DATE_KEY, "==", null)), ...queryConstraints)), (snapshot) => {
                    const updates = {};
                    let latestChangeDate = metaData.data.lastChangeDatePosix;
                    // console.log(snapshot.metadata.hasPendingWrites);
                    snapshot.docChanges().forEach((change) => {
                        // console.log(
                        //   "Firebase.firestoreDocPersister",
                        //   change.type,
                        //   change.doc.id,
                        //   change.doc.data(),
                        // );
                        // Skip removed documents. Documents should never be deleted only flagged.
                        if (change.type === "removed") {
                            console.error(`The Firestore document "${collectionRef.path}/${change.doc.id}" was removed. Mufasa
                is not currently configured to handle documents being removed.`, change.doc.data());
                            return;
                        }
                        // Update doc store.
                        updates[change.doc.id] = change.doc.data();
                        latestChangeDate = Math.max(latestChangeDate, change.doc.data()[CHANGE_DATE_KEY].seconds * 1000);
                    });
                    batchUpdate(updates);
                    if (latestChangeDate > metaData.data.lastChangeDatePosix) {
                        metaData.batchUpdate((data) => (data.lastChangeDatePosix = latestChangeDate));
                    }
                }, (error) => {
                    console.log(`Encountered error: ${error}`);
                });
            });
        },
        updateDoc: async (change) => {
            const setOrUpdateDoc = change.isBeingCreatedOrDeleted
                ? setDoc
                : updateDoc;
            await setOrUpdateDoc(docRef(collectionRef, change.docId), {
                ...change.props,
                [CHANGE_DATE_KEY]: useServerTimestamp,
            });
        },
    };
}
export function firebaseFilePersister(getStorageRef) {
    return {
        async uploadFile(fileId, binaryString) {
            await uploadString(getStorageRef(fileId), btoa(binaryString));
        },
        async downloadFile(fileId) {
            const bytes = await getBytes(getStorageRef(fileId)).catch(() => undefined);
            console.log(`got bytes`);
            if (!isValid(bytes))
                return undefined;
            const base64String = new TextDecoder("utf-8").decode(bytes);
            return atob(base64String);
        },
        async deleteFile(fileId) {
            await deleteObject(getStorageRef(fileId));
        },
    };
}
