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
import {
  DocJson,
  GlobalDocChange,
  GlobalDocPersister,
  GlobalFilePersister,
} from "../DocStore.js";
import {
  uploadString,
  deleteObject,
  getBytes,
  StorageReference,
} from "firebase/storage";
import { doNow, isValid } from "../Utils.js";
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UserInfo } from "../Auth.js";

// SECTION: Doc Persister
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
                console.warn(
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
        [CHANGE_DATE_KEY]: useServerTimestamp,
      });
    },
  };
}

// SECTION: File Persister
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

// SECTION: Auth
export function firebaseAuthIntegration(config: {
  signInWithGoogleFromPlatform: () => Promise<string | undefined | null>;
  signOutFromPlatform: () => Promise<void>;
  firebaseAuth: Auth;
  onAuthStateChanged: (user: UserInfo | null) => void;
}) {
  config.firebaseAuth.onAuthStateChanged((user) => {
    config.onAuthStateChanged(
      user !== null ? { uid: user.uid, email: user.email } : null,
    );
  });

  return {
    signUpWithEmail: async (email: string, password: string) => {
      try {
        await createUserWithEmailAndPassword(
          config.firebaseAuth,
          email,
          password,
        );
      } catch (error) {
        console.error("Error during email sign-up:", error);
      }
    },
    signInWithEmail: async (email: string, password: string) => {
      try {
        signInWithEmailAndPassword(config.firebaseAuth, email, password);
      } catch (error) {
        console.error("Error during email sign-in:", error);
      }
    },
    async signInWithGoogle() {
      await doNow(async () => {
        try {
          const idToken = await config.signInWithGoogleFromPlatform();
          if (!isValid(idToken)) return;
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(config.firebaseAuth, credential);
          // console.log("Google Sign-In Success:", credential);
        } catch (error) {
          console.error("Error during Google Sign-In:", error);
        }
      });
    },
    async signOut() {
      try {
        // We have to be carful how we call `firebaseAuth.signOut` because it depends on "this" and JavaScript tends to mess that up.
        await config.firebaseAuth.signOut();
        await config.signOutFromPlatform();
      } catch (error) {
        console.error("Error during Sign-Out:", error);
      }
    },
  };
}
