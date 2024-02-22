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

const DELETED_KEY = `mx_deleted`;

export function firestoreDocPersister(
  collectionRef: CollectionReference,
  ...queryConstraints: QueryFilterConstraint[]
): GlobalDocPersister {
  const CHANGE_DATE_KEY = `mx_changeDate`;
  const useServerTimestamp = serverTimestamp();
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
                // TODO: If a docs CHANGE_DATE_KEY is changed then it is removed and re-added to this query.
                where(CHANGE_DATE_KEY, ">", testDate),
                where(CHANGE_DATE_KEY, "==", null),
                // where(CHANGE_DATE_KEY, "==", useServerTimestamp),
              ),
              // TODO: Maybe there is some way to avoid already deleted docs.
              ...queryConstraints,
            ),
          ),
          (snapshot) => {
            const updates: {
              [docId: string]: DocJson;
            } = {};
            let latestChangeDate = metaData.data.lastChangeDatePosix;
            snapshot.docChanges().forEach((change) => {
              // Skip removed documents. Documents should never be deleted only flagged.
              if (change.type === "removed") {
                console.warn(
                  `The Firestore document "${collectionRef.path}/${change.doc.id}" was removed. Mufasa
                is not currently configured to handle documents being removed.`,
                  change.doc.data(),
                );
                return;
              }

              // Update doc store.
              updates[change.doc.id] = Object.fromEntries(
                Object.entries(change.doc.data() as DocJson).filter(
                  ([key]) => ![CHANGE_DATE_KEY, DELETED_KEY].includes(key),
                ),
              );
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
      const isDelete = change.props === null;
      const props = isDelete ? { [DELETED_KEY]: true } : change.props;
      await setDoc(
        docRef(collectionRef, change.docId),
        {
          ...props,
          [CHANGE_DATE_KEY]: useServerTimestamp,
        },
        {
          merge: !isDelete,
        },
      );
    },
  };
}

export function firebaseFilePersister(
  getStorageRef: (fileId: string) => StorageReference,
): GlobalFilePersister {
  return {
    async uploadFile(fileId, base64String) {
      await uploadString(getStorageRef(fileId), base64String);
    },
    async downloadFile(fileId) {
      const bytes = await getBytes(getStorageRef(fileId)).catch(
        () => undefined,
      );
      if (!isValid(bytes)) return undefined;
      const base64String = new TextDecoder("utf-8").decode(bytes);
      return base64String;
    },
    async deleteFile(fileId) {
      await deleteObject(getStorageRef(fileId));
    },
  };
}
