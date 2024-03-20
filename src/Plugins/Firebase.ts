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
  DocumentReference,
} from "firebase/firestore";
import { DocJson, GlobalDocChange, GlobalDocPersister } from "../DocStore.js";
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
import { Functions, httpsCallable } from "firebase/functions";
import { UserMetadata, WorkspaceIntegration } from "../Workspace.js";

// SECTION: Doc Persister
export function firebasePersister(
  firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
  },
  getStorageRef: (fileId: string) => StorageReference,
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
            firestoreConfig.collectionRef,
            and(
              or(
                // TODO: If a docs CHANGE_DATE_KEY is changed then it is removed and re-added to this query.
                where(CHANGE_DATE_KEY, ">", testDate),
                where(CHANGE_DATE_KEY, "==", null),
                // where(CHANGE_DATE_KEY, "==", useServerTimestamp),
              ),
              // TODO: Maybe there is some way to avoid already deleted docs.
              ...firestoreConfig.queryConstraints,
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
                  `The Firestore document "${firestoreConfig.collectionRef.path}/${change.doc.id}" was removed. Mufasa
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
                (data) => (data.value.lastChangeDatePosix = latestChangeDate),
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
      await setOrUpdateDoc(
        docRef(firestoreConfig.collectionRef, change.docId),
        {
          ...change.props,
          [CHANGE_DATE_KEY]: useServerTimestamp,
        },
      );
    },
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

// SECTION: File Persister
// export function firebaseFilePersister(
//   getStorageRef: (fileId: string) => StorageReference,
// ): GlobalFilePersister {
//   return {
//     async uploadFile(fileId, base64String) {
//       await uploadString(getStorageRef(fileId), base64String);
//     },
//     async downloadFile(fileId) {
//       const bytes = await getBytes(getStorageRef(fileId)).catch(
//         () => undefined,
//       );
//       if (!isValid(bytes)) return undefined;
//       const base64String = new TextDecoder("utf-8").decode(bytes);
//       return base64String;
//     },
//     async deleteFile(fileId) {
//       await deleteObject(getStorageRef(fileId));
//     },
//   };
// }

// SECTION: Auth
export function firebaseAuthIntegration(config: {
  signInToGoogleFromPlatform: () => Promise<string | undefined | null>;
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
          const idToken = await config.signInToGoogleFromPlatform();
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

// SECTION: Workspace
export function firebaseWorkspace(config: {
  firebaseFunctions: Functions;
  userMetadataDoc: DocumentReference;
  workspaceInvitesCollection: CollectionReference;
}): WorkspaceIntegration {
  return {
    onUserMetadata(handle: (metadata: UserMetadata | null) => void) {
      return onSnapshot(config.userMetadataDoc, (snapshot) => {
        const metadata = snapshot.data() as undefined | UserMetadata;
        handle(metadata ?? null);
      });
    },
    async createWorkspace(params: { stage: string }) {
      return (
        await httpsCallable<{ stage: string }, void>(
          config.firebaseFunctions,
          "createWorkspace",
        )(params)
      ).data;
    },
    async createWorkspaceInterface(params: {
      inviteCode: string;
      workspaceId: string;
      validForDays: number;
    }) {
      return await setDoc(
        docRef(config.workspaceInvitesCollection, params.inviteCode),
        {
          workspaceId: params.workspaceId,
          validForDays: params.validForDays,
          createdAt: serverTimestamp(),
        },
      );
    },
    async joinWorkspace(params: { inviteCode: string; stage: string }) {
      return (
        await httpsCallable<{ inviteCode: string; stage: string }, void>(
          config.firebaseFunctions,
          "joinWorkspace",
        )(params)
      ).data;
    },
    async leaveWorkspace(params: { stage: string } | undefined) {
      return (
        await httpsCallable<{ stage: string } | undefined, void>(
          config.firebaseFunctions,
          "leaveWorkspace",
        )(params)
      ).data;
    },
    // async deleteWorkspace(params: { stage: string } | undefined) {
    //   return (
    //     await httpsCallable<{ stage: string } | undefined, void>(
    //       config.firebaseFunctions,
    //       "deleteWorkspace",
    //     )(params)
    //   ).data;
    // },
  };
}
