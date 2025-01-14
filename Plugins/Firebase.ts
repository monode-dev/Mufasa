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
  Firestore,
  collection,
  doc,
  orderBy,
  // startAfter,
  startAt,
  documentId
} from "firebase/firestore";
import { DocJson, Cloud } from "../DocStore";
import {
  uploadString,
  deleteObject,
  getBytes,
  StorageReference,
  ref as storageRef,
  FirebaseStorage
} from "firebase/storage";
import { doNow, isValid } from "../Utils";
import { Auth, OAuthCredential, signInWithCredential, UserCredential } from "firebase/auth";
import { Functions, httpsCallable } from "firebase/functions";
import { CloudAuth, UserMetadata, WorkspaceIntegration, UserInfo, Member } from "../Workspace";
import { exists } from "miwi";

export function firebasePersister<T extends AuthProviders>(
  firebaseConfig: {
    firestore: Firestore;
    firebaseStorage?: FirebaseStorage;
    firebaseFunctions: Functions;
  } & AuthParams<T>
) {
  const refreshCustomClaims = doNow(() => {
    let isRefreshing = false;
    return async () => {
      if (isRefreshing) return;
      isRefreshing = true;
      await firebaseConfig.firebaseAuth.currentUser?.getIdToken(true);
      isRefreshing = false;
    };
  });
  return {
    getCloudAuth({ onAuthStateChanged, stage }) {
      return firebaseAuthIntegration({
        ...firebaseConfig,
        stage: stage,
        workspaceInvitesCollection: collection(firebaseConfig.firestore, `${stage}-WorkspaceInvites`),
        onAuthStateChanged,
        refreshCustomClaims
      });
    },
    getWorkspacePersister: (setup) =>
      workspacePersister(
        {
          collectionRef: collection(
            firebaseConfig.firestore,
            `${setup.stage}-Workspaces`,
            // Null means get the root workspace document.
            ...(setup.docType === null ? [] : [setup.workspaceId, setup.docType])
          ),
          queryConstraints:
            setup.docType === null
              ? // If we are getting the root workspace document, then just get that one document.
                [where(documentId(), "==", setup.workspaceId)]
              : [],
          watchChangeDateKey: setup.docType !== null
        },
        refreshCustomClaims,
        isValid(firebaseConfig.firebaseStorage)
          ? (fileId) =>
              storageRef(
                firebaseConfig.firebaseStorage!,
                // TODO: Include DocType in the path.
                `${setup.stage}-Workspace-Files/${setup.workspaceId}/${setup.docType}/${fileId}`
              )
          : undefined
      )
  } satisfies Cloud.Persister<any>;
}

export function workspacePersister(
  firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
    watchChangeDateKey: boolean;
  },
  refreshCustomClaims: () => Promise<void>,
  getStorageRef?: (fileId: string) => StorageReference
): Cloud.WorkspacePersister {
  const CHANGE_DATE_KEY = `mx_changeDate`;
  const useServerTimestamp = serverTimestamp();
  return {
    setupWatcher: (batchUpdate, localJsonFilePersister) => {
      const metaData = localJsonFilePersister.load({
        lastChangeDatePosix: 0,
        lastChangedDocId: null as string | null
      });
      let shouldStop = false;
      let isProcessingSnapshot = false;
      let disposeSnapshot: (() => void) | undefined = undefined;
      return {
        start: async () => {
          metaData.loadedFromLocalStorage.then(() => {
            runWatcher();
            function runWatcher() {
              if (shouldStop) {
                return;
              }
              disposeSnapshot = onSnapshot(
                query(
                  firestoreConfig.collectionRef,
                  and(
                    ...(firestoreConfig.watchChangeDateKey
                      ? [
                          or(
                            // TODO: If a docs CHANGE_DATE_KEY is changed then it is removed and re-added to this query.
                            where(
                              CHANGE_DATE_KEY,
                              ">",
                              new Date(Math.max(metaData.data.lastChangeDatePosix - 30000, 0))
                            ),
                            where(CHANGE_DATE_KEY, "==", null)
                            // where(CHANGE_DATE_KEY, "==", useServerTimestamp),
                          )
                        ]
                      : []),
                    // TODO: Maybe there is some way to avoid already deleted docs.
                    ...firestoreConfig.queryConstraints
                  ),
                  ...(firestoreConfig.watchChangeDateKey ? [orderBy(CHANGE_DATE_KEY, `asc`)] : []),
                  orderBy(`__name__`, `asc`),
                  ...(exists(metaData.data.lastChangedDocId) && firestoreConfig.watchChangeDateKey
                    ? [startAt(metaData.data.lastChangeDatePosix, metaData.data.lastChangedDocId)]
                    : [])
                ),
                (snapshot) => {
                  isProcessingSnapshot = true;
                  const updates: {
                    [docId: string]: DocJson;
                  } = {};
                  // console.log(
                  //   `Processing snapshot ${
                  //     snapshot.docChanges().length
                  //   } docs changed: ${firestoreConfig.collectionRef.path}`,
                  // );
                  let latestChange = metaData.data;
                  snapshot.docChanges().forEach((change) => {
                    const docData = change.doc.data();
                    /** Change date is formatted like {seconds: ..., nanoseconds: ...}
                     * We need to combine seconds and nano seconds to get the milliseconds since epoch. */
                    const docChangeDatePosix =
                      (docData[CHANGE_DATE_KEY]?.seconds ?? -1) * 1_000 +
                      (docData[CHANGE_DATE_KEY]?.nanoseconds ?? -1) / 1_000_000;
                    const isSubDelivery = firestoreConfig.collectionRef.path.includes("SubDeliver");
                    if (isSubDelivery) {
                      // console.log(docData);
                    }

                    // console.log(
                    //   `${change.type}: ${change.doc.id} \n${JSON.stringify(
                    //     docData,
                    //     null,
                    //     2,
                    //   )}`,
                    // );
                    // Skip removed documents. Documents should never be deleted only flagged.
                    if (change.type === "removed") {
                      console.warn(
                        `The Firestore document "${firestoreConfig.collectionRef.path}/${change.doc.id}" was removed. Mufasa is not currently configured to handle documents being removed.`,
                        docData
                      );
                      return;
                    }
                    // The first one is usually a duplicate.
                    if (
                      docChangeDatePosix === latestChange.lastChangeDatePosix &&
                      change.doc.id === metaData.data.lastChangedDocId
                    ) {
                      return;
                    }

                    // Update doc store.
                    updates[change.doc.id] = docData as DocJson;
                    // We shouldn't need to to this comparison since the last document should be the most recent.
                    // If this is not how it works, then our "startAfter" above will be in trouble.
                    if (docChangeDatePosix > latestChange.lastChangeDatePosix) {
                      latestChange = {
                        lastChangeDatePosix: docChangeDatePosix,
                        lastChangedDocId: change.doc.id
                      };
                    }
                  });
                  batchUpdate(updates);
                  // console.log(
                  //   `latestChange: ${JSON.stringify(
                  //     latestChange,
                  //     null,
                  //     2,
                  //   )}, metaData.data: ${JSON.stringify(
                  //     metaData.data,
                  //     null,
                  //     2,
                  //   )}`,
                  // );
                  if (latestChange.lastChangeDatePosix > metaData.data.lastChangeDatePosix) {
                    metaData.batchUpdate((data) => (data.value = latestChange));
                  }
                  isProcessingSnapshot = false;
                },
                (error) => {
                  isProcessingSnapshot = false;
                  disposeSnapshot = undefined;

                  if (error.code === "permission-denied") {
                    refreshCustomClaims();
                  }
                  setTimeout(runWatcher, 500);
                  console.warn(`Encountered error: ${error}`);
                }
              );
            }
          });
        },
        async stop() {
          shouldStop = true;
          if (disposeSnapshot) {
            disposeSnapshot();
            disposeSnapshot = undefined;
          }
          while (isProcessingSnapshot) {
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        }
      };
    },
    updateDoc: async (change: Cloud.DocChange) => {
      // console.log(
      //   `Updating doc ${firestoreConfig.collectionRef.path}/${
      //     change.docId
      //   }:\n${JSON.stringify(change.props, null, 2)}`,
      // );
      const setOrUpdateDoc = change.isBeingCreatedOrDeleted ? setDoc : updateDoc;
      await setOrUpdateDoc(docRef(firestoreConfig.collectionRef, change.docId), {
        ...change.props,
        [CHANGE_DATE_KEY]: useServerTimestamp
      });
    },
    ...(isValid(getStorageRef)
      ? {
          async uploadFile(fileId, base64String) {
            await uploadString(getStorageRef(fileId), base64String);
          },
          async downloadFile(fileId) {
            const bytes = await getBytes(getStorageRef(fileId)).catch(() => undefined);
            if (!isValid(bytes)) return undefined;
            const base64String = new TextDecoder("utf-8").decode(bytes);
            return base64String;
          },
          async deleteFile(fileId) {
            await deleteObject(getStorageRef(fileId));
          }
        }
      : {})
  };
}

// SECTION: Auth
type AuthParams<T extends AuthProviders> = Omit<
  Parameters<typeof firebaseAuthIntegration<T>>[0],
  `onAuthStateChanged` | `workspaceInvitesCollection` | `stage` | `firestore` | `refreshCustomClaims`
>;
type AuthProviders = {
  [key: string]: {
    signIn: (...params: any) => Promise<OAuthCredential | undefined>;
    signOut: () => Promise<void>;
  };
};
export function firebaseAuthIntegration<T extends AuthProviders>(config: {
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signOutFromFirebase: () => Promise<void>;
  authProviders?: T;
  firebaseAuth: Auth;
  refreshCustomClaims: () => Promise<void>;
  onAuthStateChanged: (user: UserInfo | null) => void;
  firebaseFunctions: Functions;
  workspaceInvitesCollection: CollectionReference;
  firestore: Firestore;
  stage: string;
}): CloudAuth<
  {
    signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
    signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  } & {
    [Key in keyof T & string as `signInWith${Capitalize<Key>}`]: (
      ...params: Parameters<T[Key][`signIn`]>
    ) => Promise<UserCredential>;
  }
> {
  let disposePrevEmailVerificationListener: (() => void) | undefined;
  config.firebaseAuth.onAuthStateChanged((user) => {
    disposePrevEmailVerificationListener?.();
    config.onAuthStateChanged(
      user !== null
        ? {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified
          }
        : null
    );
    if (isValid(user) && !user?.emailVerified) {
      doNow(async () => {
        let stopListeningForThisUser = false;
        disposePrevEmailVerificationListener = () => (stopListeningForThisUser = true);
        while (!stopListeningForThisUser) {
          if (user?.emailVerified) {
            config.onAuthStateChanged({
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified
            });
            stopListeningForThisUser = true;
          }
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          if (stopListeningForThisUser) return;
          await user?.reload();
        }
      });
    }
  });

  const altSignInMethods = Object.fromEntries(
    Object.entries(config.authProviders ?? {}).map(([providerName, value]) => [
      `signInWith${providerName[0].toUpperCase()}${providerName.slice(1)}`,
      async () => {
        const credential = await value.signIn();
        if (!isValid(credential)) return;
        return await signInWithCredential(config.firebaseAuth, credential);
      }
    ])
  );

  return {
    signInFuncs: {
      signUpWithEmail: async (email: string, password: string) => {
        return await config.signUpWithEmail(email, password);
      },
      signInWithEmail: async (email: string, password: string) => {
        return await config.signInWithEmail(email, password);
      },
      ...(altSignInMethods as any)
      // async signInWithGoogle() {
      //   if (!isValid(config.signInToGoogleFromPlatform)) return;
      //   const idToken = await config.signInToGoogleFromPlatform();
      //   if (!isValid(idToken)) return;
      //   const credential = GoogleAuthProvider.credential(idToken);
      //   await signInWithCredential(config.firebaseAuth, credential);
      // },
    },
    signOut: signOut,
    getWorkspaceIntegration: (uid: string) =>
      firebaseWorkspace({
        ...config,
        uid: uid,
        userMetadataCollection: collection(config.firestore, `${config.stage}-UserMetadata`),
        workspacesCollection: collection(config.firestore, `${config.stage}-Workspaces`),
        refreshCustomClaims: config.refreshCustomClaims,
        signOut: signOut
      })
  } satisfies CloudAuth<any>;

  async function signOut() {
    try {
      // We have to be carful how we call `firebaseAuth.signOut` because it depends on "this" and JavaScript tends to mess that up.
      await config.signOutFromFirebase();
      // Just try all the providers and make sure none of them are signed in.
      for (const provider of Object.values(config.authProviders ?? {})) {
        try {
          await provider.signOut();
        } catch (error) {
          console.error("Error during Sign-Out:", error);
        }
      }
    } catch (error) {
      console.error("Error during Sign-Out:", error);
    }
  }
}

// SECTION: Workspace
export function firebaseWorkspace(config: {
  firebaseFunctions: Functions;
  uid: string;
  userMetadataCollection: CollectionReference;
  workspaceInvitesCollection: CollectionReference;
  workspacesCollection: CollectionReference;
  refreshCustomClaims: () => Promise<void>;
  signOut: () => Promise<void>;
}): WorkspaceIntegration {
  return {
    async generateInviteCode() {
      return doc(config.workspaceInvitesCollection).id;
    },
    onUserMetadata(handle: (metadata: UserMetadata | null) => void) {
      let disposeSnapShot = () => {};
      let shouldStop = false;
      const startOnSnapshot = () => {
        if (shouldStop) return;
        disposeSnapShot = onSnapshot(
          doc(config.userMetadataCollection, config.uid),
          (snapshot) => {
            /* If the app starts up offline, onSnapshot sends `undefined` data, even though it hasn't
             * actually pinged the server. This is overwriting our locally saved copy. Firestore shouldn't
             * send any updates until it has actually checked with the server. We can tell the difference
             * between these two `undefined`s by checking snapshot.metadata.fromCache. Firestore caching
             * should be disabled, so if it is from the cache it is not from the server and should be
             * discarded. */
            if (snapshot.metadata.fromCache) return;
            const metadata = snapshot.data() as undefined | UserMetadata;
            handle(metadata ?? null);
          },
          (error) => {
            console.warn(error);
            if (error.code === "permission-denied") {
              config.refreshCustomClaims().then(() => startOnSnapshot());
            }
          }
        );
      };
      startOnSnapshot();
      return () => {
        shouldStop = true;
        disposeSnapShot();
      };
    },
    watchEntitlements(workspaceId, onEntitlements) {
      let disposeSnapShot = () => {};
      let shouldStop = false;
      const startOnSnapshot = () => {
        if (shouldStop) return;
        disposeSnapShot = onSnapshot(
          doc(config.workspacesCollection, workspaceId),
          (snapshot) => onEntitlements(snapshot.data()?.entitlements ?? []),
          (error) => {
            console.warn(error);
            if (error.code === "permission-denied") {
              config.refreshCustomClaims().then(() => startOnSnapshot());
            }
          }
        );
      };
      startOnSnapshot();
      return () => {
        shouldStop = true;
        disposeSnapShot();
      };
    },
    watchMembers(workspaceId, onMembers) {
      let disposeSnapShot = () => {};
      let shouldStop = false;
      const startOnSnapshot = () => {
        if (shouldStop) return;
        disposeSnapShot = onSnapshot(
          query(config.userMetadataCollection, where("workspaceId", "==", workspaceId)),
          (snapshot) => onMembers(snapshot.docs.map((doc) => doc.data() as Member)),
          (error) => {
            console.warn(error);
            if (error.code === "permission-denied") {
              config.refreshCustomClaims().then(() => startOnSnapshot());
            }
          }
        );
      };
      startOnSnapshot();
      return () => {
        shouldStop = true;
        disposeSnapShot();
      };
    },
    async createWorkspaceInterface(params: { inviteCode: string; workspaceId: string; validForDays: number }) {
      return await setDoc(docRef(config.workspaceInvitesCollection, params.inviteCode), {
        workspaceId: params.workspaceId,
        validForDays: params.validForDays,
        createdAt: serverTimestamp()
      });
    },
    async createWorkspace(params: { stage: string }) {
      const result = (await httpsCallable<{ stage: string }, void>(config.firebaseFunctions, "createWorkspace")(params))
        .data;
      try {
        await config.refreshCustomClaims();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
      return result;
    },
    async refreshToken() {
      await config.refreshCustomClaims();
    },
    async joinWorkspace(params: { inviteCode: string; stage: string }) {
      const result = (
        await httpsCallable<{ inviteCode: string; stage: string }, void>(
          config.firebaseFunctions,
          "joinWorkspace"
        )(params)
      ).data;
      try {
        await config.refreshCustomClaims();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
      return result;
    },
    async leaveWorkspace(params: { stage: string } | undefined) {
      const result = (
        await httpsCallable<{ stage: string } | undefined, void>(config.firebaseFunctions, "leaveWorkspace")(params)
      ).data;
      try {
        await config.refreshCustomClaims();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
      return result;
    },
    async removeMember(params: { uid: string; stage: string }) {
      return (
        await httpsCallable<{ uid: string; stage: string }, void>(config.firebaseFunctions, "removeMember")(params)
      ).data;
    },
    async deleteWorkspace(params: { stage: string }) {
      return (await httpsCallable<{ stage: string }, void>(config.firebaseFunctions, "deleteWorkspace")(params)).data;
    },
    async deleteAccount(params: { stage: string }) {
      await httpsCallable<{ stage: string }, void>(config.firebaseFunctions, "deleteAccount")(params);
      await config.signOut();
    }
  };
}
