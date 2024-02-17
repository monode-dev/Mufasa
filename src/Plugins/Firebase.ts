import {
  onSnapshot,
  query,
  where,
  CollectionReference,
  updateDoc,
  doc as docRef,
  setDoc,
  serverTimestamp,
  and,
  QueryFilterConstraint,
  or,
} from "firebase/firestore";
import { DocJson, GlobalDocChange, GlobalDocPersister } from "../DocStore.js";
import {
  uploadString,
  deleteObject,
  getBytes,
  StorageReference,
} from "firebase/storage";
import { isValid } from "../Utils.js";
import { GlobalFilePersister } from "../FileStore.js";

export function firestoreDocPersister(
  collectionRef: CollectionReference,
  ...queryConstraints: QueryFilterConstraint[]
): GlobalDocPersister {
  const CHANGE_DATE_KEY = `mx_changeDate`;
  return {
    start: async (batchUpdate, localJsonFilePersister) => {
      const metaData = localJsonFilePersister.start({
        lastChangeDatePosix: 0,
      });
      metaData.loadedFromLocalStorage.then(() => {
        const testDate = new Date(
          Math.max(metaData.data.lastChangeDatePosix - 30000, 0),
        );
        onSnapshot(
          query(
            collectionRef,
            and(
              or(
                where(CHANGE_DATE_KEY, ">", testDate),
                where(CHANGE_DATE_KEY, "==", null),
              ),
              ...queryConstraints,
            ),
          ),
          (snapshot) => {
            const updates: {
              [docId: string]: DocJson;
            } = {};
            let latestChangeDate = metaData.data.lastChangeDatePosix;
            console.log(snapshot.metadata.hasPendingWrites);
            snapshot.docChanges().forEach((change) => {
              console.log(
                "Firebase.firestoreDocPersister",
                change.type,
                change.doc.id,
                change.doc.data(),
              );
              // Skip removed documents. Documents should never be deleted only flagged.
              if (change.type === "removed") {
                console.error(
                  `The Firestore document "${collectionRef.path}/${change.doc.id}" was removed. Mufasa
                is not currently configured to handle documents being removed.`,
                  change.doc.data(),
                );
                return;
              }

              // Update doc store.
              updates[change.doc.id] = change.doc.data() as DocJson;
              latestChangeDate = Math.max(
                latestChangeDate,
                change.doc.data()[CHANGE_DATE_KEY].seconds * 1000,
              );
            });
            batchUpdate(updates);
            if (latestChangeDate > metaData.data.lastChangeDatePosix) {
              metaData.batchUpdate(
                (data) => (data.lastChangeDatePosix = latestChangeDate),
              );
            }
          },
          (error) => {
            console.log(`Encountered error: ${error}`);
          },
        );
      });
    },
    updateDoc: async (change: GlobalDocChange) => {
      const setOrUpdateDoc = change.isBeingCreatedOrDeleted
        ? setDoc
        : updateDoc;
      await setOrUpdateDoc(docRef(collectionRef, change.docId), {
        ...change.props,
        [CHANGE_DATE_KEY]: serverTimestamp(),
      });
    },
  };
}

export function firebaseFilePersister(
  getStorageRef: (fileId: string) => StorageReference,
): GlobalFilePersister {
  return {
    async uploadFile(fileId, utf8String) {
      await uploadString(getStorageRef(fileId), await utf8ToBase64(utf8String));
    },
    async downloadFile(fileId) {
      const bytes = await getBytes(getStorageRef(fileId)).catch(
        () => undefined,
      );
      if (!isValid(bytes)) return undefined;
      const base64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(bytes) as any),
      );
      return base64ToUtf8(base64);
    },
    async deleteFile(fileId) {
      await deleteObject(getStorageRef(fileId));
    },
  };
}
function utf8ToBase64(string: string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}
function base64ToUtf8(encoded: string) {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}
// function blobToBase64(blob: Blob): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       resolve(reader.result as string);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// }
// function base64DataUrlToBlob(base64DataUrl: string) {
//   // Split the base64 string into parts: the data URL scheme and the base64 encoded data
//   const parts = base64DataUrl.split(";base64,");
//   const contentType = parts[0].split(":")[1]; // Extract MIME type (e.g., 'image/png')
//   const base64 = parts[1];
//   const binaryString = window.atob(base64); // Decode base64

//   // Convert binary string to a Uint8Array
//   const length = binaryString.length;
//   const uint8Array = new Uint8Array(length);

//   for (let i = 0; i < length; i++) {
//     uint8Array[i] = binaryString.charCodeAt(i);
//   }

//   // Create the blob object with the typed array and MIME type
//   const blob = new Blob([uint8Array], { type: contentType });
//   return blob;
// }
