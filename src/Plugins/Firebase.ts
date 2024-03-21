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
  Firestore,
  collection,
  doc,
} from "firebase/firestore";
import { DocJson, Cloud, Device, Session } from "../DocStore.js";
import {
  uploadString,
  deleteObject,
  getBytes,
  StorageReference,
  ref as storageRef,
  FirebaseStorage,
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
import { ReadonlyProp } from "@monode/mosa";

export function firebasePersister(firebaseConfig: {
  firestore: Firestore;
  firebaseStorage: FirebaseStorage;
  firebaseFunctions: Functions;
  authConfig: AuthParams;
}) {
  return ((config) => {
    return {
      exports: {
        ...initializeUser({
          firestore: firebaseConfig.firestore,
          firebaseFunctions: firebaseConfig.firebaseFunctions,
          stage: config.stage,
          sessionPersister: config.sessionPersister,
          directoryPersister:
            config.directoryPersister ?? Device.mockDirectoryPersister,
          authConfig: firebaseConfig.authConfig,
        }),
      },
      getWorkspacePersister: (setup) =>
        workspacePersister(
          {
            collectionRef: collection(
              firebaseConfig.firestore,
              `${setup.stage}-Workspaces`,
              setup.workspaceId,
              setup.docType,
            ),
            queryConstraints: [],
          },
          (fileId) =>
            storageRef(
              firebaseConfig.firebaseStorage,
              // TODO: Include DocType in the path.
              `${setup.stage}-Workspace-Files/${setup.workspaceId}/${setup.docType}/${fileId}`,
            ),
        ),
    };
  }) satisfies Cloud.Persister<any>;
}

function workspacePersister(
  firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
  },
  getStorageRef: (fileId: string) => StorageReference,
): Cloud.WorkspacePersister {
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
    updateDoc: async (change: Cloud.DocChange) => {
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
type AuthParams = Parameters<typeof firebaseAuthIntegration>[0];
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

function initializeUser(config: {
  firestore: Firestore;
  firebaseFunctions: Functions;
  stage: string;
  sessionPersister: Session.Persister;
  directoryPersister: Device.DirectoryPersister;
  authConfig: AuthParams;
}) {
  const { useProp, useFormula, doNow, exists, onDispose } =
    config.sessionPersister;
  function createWorkspaceInterface(
    userId: string,
    workspaceIntegration: WorkspaceIntegration,
    onDispose: (dispose: () => void) => void,
  ) {
    const isCreatingWorkspace = useProp(false);
    const isJoiningWorkspace = useProp(false);
    const isLeavingWorkspace = useProp(false);
    // const isDeletingWorkspace = useProp(false);

    type PendingAsJson = typeof PendingAsJson;
    const PendingAsJson = null;
    type NoneAsJson = typeof NoneAsJson;
    const NoneAsJson = 0;
    const userMetadata = doNow(() => {
      type SavedUserMetadata = PendingAsJson | NoneAsJson | UserMetadata;
      const userMetadata = useProp<SavedUserMetadata>(PendingAsJson);
      const savedMetadata = config.directoryPersister
        .jsonFile(`${userId}.json`)
        .start(PendingAsJson as SavedUserMetadata);
      savedMetadata.loadedFromLocalStorage.then(() => {
        userMetadata.value = savedMetadata.data;
      });
      const disposeOnSnapshot = workspaceIntegration.onUserMetadata(
        (newMetadata) => {
          savedMetadata.batchUpdate((data) => {
            const newMetadataValue =
              exists(newMetadata?.workspaceId) && exists(newMetadata?.role)
                ? {
                    workspaceId: newMetadata.workspaceId,
                    role: newMetadata.role,
                  }
                : NoneAsJson;
            data.value = newMetadataValue;
            userMetadata.value = newMetadataValue;
          });
        },
      );
      onDispose(disposeOnSnapshot);
      return userMetadata as ReadonlyProp<SavedUserMetadata>;
    });

    const WorkspaceStates = {
      pending: {
        isPending: true,
      },
      none: {
        isNone: true,
        async createWorkspace() {
          isCreatingWorkspace.value = true;
          await workspaceIntegration.createWorkspace({
            stage: config.stage,
          });
          isCreatingWorkspace.value = false;
        },
        async joinWorkspace(props: { inviteCode: string }) {
          isJoiningWorkspace.value = true;
          await workspaceIntegration.joinWorkspace({
            inviteCode: props.inviteCode,
            stage: config.stage,
          });
          isJoiningWorkspace.value = false;
        },
      },
      creating: {
        isCreating: true,
      },
      joining: {
        isJoining: true,
      },
      createJoinedInst(userMetadata: UserMetadata) {
        return {
          haveJoined: true,
          id: userMetadata.workspaceId,
          role: userMetadata.role,
          async createWorkspaceInvite() {
            if (userMetadata.role !== `owner`) {
              console.error(
                `Attempted to create a workspace invite without permission.`,
              );
              return;
            }
            if (userMetadata.workspaceId === null) {
              console.error(
                `Attempted to create a workspace invite without a workspace.`,
              );
              return;
            }
            const validForDays = 14;
            const inviteCode = doc(
              collection(config.firestore, `${config.stage}-WorkspaceInvites`),
            ).id;
            await workspaceIntegration.createWorkspaceInterface({
              inviteCode,
              workspaceId: userMetadata.workspaceId,
              validForDays,
            });
            return { inviteCode, validForDays };
          },
          async leaveWorkspace() {
            isLeavingWorkspace.value = true;
            await workspaceIntegration.leaveWorkspace({
              stage: config.stage,
            });
            isLeavingWorkspace.value = false;
          },
          // async deleteWorkspace() {
          //   isLeavingWorkspace.value = true;
          //   await workspaceIntegration.deleteWorkspace();
          //   isLeavingWorkspace.value = false;
          // },
        };
      },
      leaving: {
        isLeaving: true,
      },
      // deleting: {
      //   isDeleting: true,
      // },
    } as const;

    return useFormula(() => {
      console.log(`userMetadata.value`, userMetadata.value);
      return userMetadata.value === PendingAsJson
        ? WorkspaceStates.pending
        : userMetadata.value === NoneAsJson
        ? isCreatingWorkspace.value
          ? WorkspaceStates.creating
          : isJoiningWorkspace.value
          ? WorkspaceStates.joining
          : WorkspaceStates.none
        : isLeavingWorkspace.value
        ? WorkspaceStates.leaving
        : WorkspaceStates.createJoinedInst(userMetadata.value);
    });
  }

  // SECTION: User
  return doNow(() => {
    const userInfo = useProp<undefined | null | UserInfo>(undefined);
    const firebaseAuth = firebaseAuthIntegration(config.authConfig);
    const isSigningIn = useProp(false);
    const isSigningOut = useProp(false);
    // TODO: Force these to be single threaded.
    async function signUpWithEmail(email: string, password: string) {
      isSigningIn.value = true;
      await firebaseAuth.signUpWithEmail(email, password);
      isSigningIn.value = false;
    }
    async function signInWithEmail(email: string, password: string) {
      isSigningIn.value = true;
      await firebaseAuth.signInWithEmail(email, password);
      isSigningIn.value = false;
    }
    async function signInWithGoogle() {
      isSigningIn.value = true;
      await firebaseAuth.signInWithGoogle();
      isSigningIn.value = false;
    }
    async function signOut() {
      isSigningOut.value = true;
      await firebaseAuth.signOut();
      isSigningOut.value = false;
    }
    const UserStates = {
      pending: {
        isPending: true,
      },
      signedOut: {
        isSignedOut: true,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
      },
      signingIn: {
        isSigningIn: true,
      },
      createAwaitingVerificationInst(userInfo: UserInfo) {
        return {
          isAwaitingVerification: true,
          get email() {
            return userInfo.email ?? null;
          },
          signOut,
        };
      },
      // TODO: Maybe swap out the whole object when the user changes.
      createSignedInInst(
        userInfo: UserInfo,
        onDispose: (dispose: () => void) => void,
      ) {
        const workspace = createWorkspaceInterface(
          userInfo.uid,
          firebaseWorkspace({
            firebaseFunctions: config.firebaseFunctions,
            userMetadataDoc: doc(
              collection(config.firestore, `${config.stage}-UserMetadata`),
              userInfo.uid,
            ),
            workspaceInvitesCollection: collection(
              config.firestore,
              `${config.stage}-WorkspaceInvites`,
            ),
          }),
          onDispose,
        );
        return {
          uid: userInfo.uid,
          email: userInfo.email,
          isSignedIn: true,
          // TODO: Leaving a workspace is not updating this.
          // TODO: Maybe use a query to watch this value.
          get workspace() {
            return workspace.value;
          },
          signOut,
        };
      },
      signingOut: {
        isSigningOut: true,
      },
    };

    return useFormula(
      () =>
        userInfo.value === undefined
          ? UserStates.pending
          : userInfo.value === null
          ? isSigningIn.value
            ? UserStates.signingIn
            : UserStates.signedOut
          : isSigningOut.value
          ? UserStates.signingOut
          : UserStates.createSignedInInst(userInfo.value, onDispose),
      // createAwaitingVerificationInst,
    );
  });
}
