import { onSnapshot, query, where, updateDoc, doc as docRef, setDoc, serverTimestamp, and, or, collection, doc, } from "firebase/firestore";
import { uploadString, deleteObject, getBytes, ref as storageRef, } from "firebase/storage";
import { doNow, isValid } from "../Utils.js";
import { signInWithCredential, } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
export function firebasePersister(firebaseConfig) {
    return {
        getCloudAuth({ onAuthStateChanged, stage }) {
            return firebaseAuthIntegration({
                ...firebaseConfig,
                stage: stage,
                workspaceInvitesCollection: collection(firebaseConfig.firestore, `${stage}-WorkspaceInvites`),
                onAuthStateChanged,
            });
        },
        getWorkspacePersister: (setup) => workspacePersister({
            collectionRef: collection(firebaseConfig.firestore, `${setup.stage}-Workspaces`, setup.workspaceId, setup.docType),
            queryConstraints: [],
        }, isValid(firebaseConfig.firebaseStorage)
            ? (fileId) => storageRef(firebaseConfig.firebaseStorage, 
            // TODO: Include DocType in the path.
            `${setup.stage}-Workspace-Files/${setup.workspaceId}/${setup.docType}/${fileId}`)
            : undefined),
    };
}
export function workspacePersister(firestoreConfig, getStorageRef) {
    const CHANGE_DATE_KEY = `mx_changeDate`;
    const useServerTimestamp = serverTimestamp();
    return {
        setupWatcher: (batchUpdate, localJsonFilePersister) => {
            const metaData = localJsonFilePersister.load({
                lastChangeDatePosix: 0,
            });
            let shouldStop = false;
            let isProcessingSnapshot = false;
            let disposeSnapshot = undefined;
            return {
                start: async () => {
                    metaData.loadedFromLocalStorage.then(() => {
                        runWatcher();
                        function runWatcher() {
                            if (shouldStop)
                                return;
                            disposeSnapshot = onSnapshot(query(firestoreConfig.collectionRef, and(or(
                            // TODO: If a docs CHANGE_DATE_KEY is changed then it is removed and re-added to this query.
                            where(CHANGE_DATE_KEY, ">", new Date(Math.max(metaData.data.lastChangeDatePosix - 30000, 0))), where(CHANGE_DATE_KEY, "==", null)), 
                            // TODO: Maybe there is some way to avoid already deleted docs.
                            ...firestoreConfig.queryConstraints)), (snapshot) => {
                                isProcessingSnapshot = true;
                                console.log("Processing snapshot");
                                const updates = {};
                                let latestChangeDate = metaData.data.lastChangeDatePosix;
                                snapshot.docChanges().forEach((change) => {
                                    // Skip removed documents. Documents should never be deleted only flagged.
                                    if (change.type === "removed") {
                                        console.warn(`The Firestore document "${firestoreConfig.collectionRef.path}/${change.doc.id}" was removed. Mufasa is not currently configured to handle documents being removed.`, change.doc.data());
                                        return;
                                    }
                                    // Update doc store.
                                    updates[change.doc.id] = change.doc.data();
                                    latestChangeDate = Math.max(latestChangeDate, change.doc.data()[CHANGE_DATE_KEY].seconds * 1000);
                                });
                                batchUpdate(updates);
                                if (latestChangeDate > metaData.data.lastChangeDatePosix) {
                                    metaData.batchUpdate((data) => (data.value.lastChangeDatePosix = latestChangeDate));
                                }
                                isProcessingSnapshot = false;
                            }, (error) => {
                                isProcessingSnapshot = false;
                                disposeSnapshot = undefined;
                                setTimeout(runWatcher, 500);
                                console.warn(`Encountered error: ${error}`);
                            });
                        }
                    });
                },
                async stop() {
                    shouldStop = true;
                    console.log(`Stopping Firebase Watcher`);
                    if (disposeSnapshot) {
                        disposeSnapshot();
                        disposeSnapshot = undefined;
                    }
                    while (isProcessingSnapshot) {
                        await new Promise((resolve) => setTimeout(resolve, 10));
                    }
                    console.log(`Stopped Firebase Watcher`);
                },
            };
        },
        updateDoc: async (change) => {
            const setOrUpdateDoc = change.isBeingCreatedOrDeleted
                ? setDoc
                : updateDoc;
            await setOrUpdateDoc(docRef(firestoreConfig.collectionRef, change.docId), {
                ...change.props,
                [CHANGE_DATE_KEY]: useServerTimestamp,
            });
        },
        ...(isValid(getStorageRef)
            ? {
                async uploadFile(fileId, base64String) {
                    await uploadString(getStorageRef(fileId), base64String);
                },
                async downloadFile(fileId) {
                    const bytes = await getBytes(getStorageRef(fileId)).catch(() => undefined);
                    if (!isValid(bytes))
                        return undefined;
                    const base64String = new TextDecoder("utf-8").decode(bytes);
                    return base64String;
                },
                async deleteFile(fileId) {
                    await deleteObject(getStorageRef(fileId));
                },
            }
            : {}),
    };
}
export function firebaseAuthIntegration(config) {
    let disposePrevEmailVerificationListener;
    config.firebaseAuth.onAuthStateChanged((user) => {
        disposePrevEmailVerificationListener?.();
        config.onAuthStateChanged(user !== null
            ? {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
            }
            : null);
        if (isValid(user) && !user?.emailVerified) {
            doNow(async () => {
                let stopListeningForThisUser = false;
                disposePrevEmailVerificationListener = () => (stopListeningForThisUser = true);
                while (!stopListeningForThisUser) {
                    if (user?.emailVerified) {
                        config.onAuthStateChanged({
                            uid: user.uid,
                            email: user.email,
                            emailVerified: user.emailVerified,
                        });
                        stopListeningForThisUser = true;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
                    if (stopListeningForThisUser)
                        return;
                    await user?.reload();
                }
            });
        }
    });
    const altSignInMethods = Object.fromEntries(Object.entries(config.authProviders ?? {}).map(([providerName, value]) => [
        `signInWith${providerName[0].toUpperCase()}${providerName.slice(1)}`,
        async () => {
            const credential = await value.signIn();
            if (!isValid(credential))
                return;
            return await signInWithCredential(config.firebaseAuth, credential);
        },
    ]));
    return {
        signInFuncs: {
            signUpWithEmail: async (email, password) => {
                return await config.signUpWithEmail(email, password);
            },
            signInWithEmail: async (email, password) => {
                return await config.signInWithEmail(email, password);
            },
            ...altSignInMethods,
            // async signInWithGoogle() {
            //   if (!isValid(config.signInToGoogleFromPlatform)) return;
            //   const idToken = await config.signInToGoogleFromPlatform();
            //   if (!isValid(idToken)) return;
            //   const credential = GoogleAuthProvider.credential(idToken);
            //   await signInWithCredential(config.firebaseAuth, credential);
            // },
        },
        async signOut() {
            try {
                // We have to be carful how we call `firebaseAuth.signOut` because it depends on "this" and JavaScript tends to mess that up.
                await config.signOutFromFirebase();
                // Just try all the providers and make sure none of them are signed in.
                for (const provider of Object.values(config.authProviders ?? {})) {
                    try {
                        await provider.signOut();
                    }
                    catch (error) {
                        console.error("Error during Sign-Out:", error);
                    }
                }
            }
            catch (error) {
                console.error("Error during Sign-Out:", error);
            }
        },
        getWorkspaceIntegration: (uid) => firebaseWorkspace({
            ...config,
            uid: uid,
            userMetadataCollection: collection(config.firestore, `${config.stage}-UserMetadata`),
            workspacesCollection: collection(config.firestore, `${config.stage}-Workspaces`),
            refreshCustomClaims: async () => {
                await config.firebaseAuth.currentUser?.getIdToken(true);
            },
        }),
    };
}
// SECTION: Workspace
export function firebaseWorkspace(config) {
    return {
        async generateInviteCode() {
            return doc(config.workspaceInvitesCollection).id;
        },
        onUserMetadata(handle) {
            return onSnapshot(doc(config.userMetadataCollection, config.uid), (snapshot) => {
                const metadata = snapshot.data();
                handle(metadata ?? null);
            });
        },
        watchEntitlements(workspaceId, onEntitlements) {
            return onSnapshot(doc(config.workspacesCollection, workspaceId), (snapshot) => onEntitlements(snapshot.data()?.entitlements ?? []));
        },
        watchMembers(workspaceId, onMembers) {
            return onSnapshot(query(config.userMetadataCollection, where("workspaceId", "==", workspaceId)), (snapshot) => onMembers(snapshot.docs.map((doc) => doc.data())));
        },
        async createWorkspaceInterface(params) {
            return await setDoc(docRef(config.workspaceInvitesCollection, params.inviteCode), {
                workspaceId: params.workspaceId,
                validForDays: params.validForDays,
                createdAt: serverTimestamp(),
            });
        },
        async createWorkspace(params) {
            const result = (await httpsCallable(config.firebaseFunctions, "createWorkspace")(params)).data;
            try {
                await config.refreshCustomClaims();
            }
            catch (error) {
                console.error("Error refreshing token:", error);
            }
            return result;
        },
        async joinWorkspace(params) {
            const result = (await httpsCallable(config.firebaseFunctions, "joinWorkspace")(params)).data;
            try {
                await config.refreshCustomClaims();
            }
            catch (error) {
                console.error("Error refreshing token:", error);
            }
            return result;
        },
        async leaveWorkspace(params) {
            const result = (await httpsCallable(config.firebaseFunctions, "leaveWorkspace")(params)).data;
            try {
                await config.refreshCustomClaims();
            }
            catch (error) {
                console.error("Error refreshing token:", error);
            }
            return result;
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
