import { onSnapshot, query, where, updateDoc, doc as docRef, setDoc, serverTimestamp, and, or, collection, doc, } from "firebase/firestore";
import { Device } from "../DocStore.js";
import { uploadString, deleteObject, getBytes, ref as storageRef, } from "firebase/storage";
import { doNow, isValid } from "../Utils.js";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithCredential, signInWithEmailAndPassword, } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
export function firebasePersister(firebaseConfig) {
    return ((config) => {
        const user = initializeUser({
            firestore: firebaseConfig.firestore,
            firebaseFunctions: firebaseConfig.firebaseFunctions,
            stage: config.stage,
            sessionPersister: config.sessionPersister,
            directoryPersister: config.directoryPersister ?? Device.mockDirectoryPersister,
            authConfig: firebaseConfig.authConfig,
        });
        return {
            getWorkspaceId: () => user.value?.workspace?.id ?? null,
            exports: {
                get user() {
                    return user.value;
                },
            },
            getWorkspacePersister: (setup) => workspacePersister({
                collectionRef: collection(firebaseConfig.firestore, `${setup.stage}-Workspaces`, setup.workspaceId, setup.docType),
                queryConstraints: [],
            }, (fileId) => storageRef(firebaseConfig.firebaseStorage, 
            // TODO: Include DocType in the path.
            `${setup.stage}-Workspace-Files/${setup.workspaceId}/${setup.docType}/${fileId}`)),
        };
    });
}
export function workspacePersister(firestoreConfig, getStorageRef) {
    const CHANGE_DATE_KEY = `mx_changeDate`;
    const useServerTimestamp = serverTimestamp();
    return {
        start: async (batchUpdate, localJsonFilePersister) => {
            const metaData = localJsonFilePersister.start({
                lastChangeDatePosix: 0,
            });
            metaData.loadedFromLocalStorage.then(() => {
                const testDate = new Date(Math.max(metaData.data.lastChangeDatePosix - 30000, 0));
                onSnapshot(query(firestoreConfig.collectionRef, and(or(
                // TODO: If a docs CHANGE_DATE_KEY is changed then it is removed and re-added to this query.
                where(CHANGE_DATE_KEY, ">", testDate), where(CHANGE_DATE_KEY, "==", null)), 
                // TODO: Maybe there is some way to avoid already deleted docs.
                ...firestoreConfig.queryConstraints)), (snapshot) => {
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
                            console.warn(`The Firestore document "${firestoreConfig.collectionRef.path}/${change.doc.id}" was removed. Mufasa
                is not currently configured to handle documents being removed.`, change.doc.data());
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
                }, (error) => {
                    console.log(`Encountered error: ${error}`);
                });
            });
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
        stopUploadsAndDownloads() {
            // TODO: Implement
        },
    };
}
export function firebaseAuthIntegration(config) {
    config.firebaseAuth.onAuthStateChanged((user) => {
        config.onAuthStateChanged(user !== null ? { uid: user.uid, email: user.email } : null);
    });
    return {
        signUpWithEmail: async (email, password) => {
            try {
                await createUserWithEmailAndPassword(config.firebaseAuth, email, password);
            }
            catch (error) {
                console.error("Error during email sign-up:", error);
            }
        },
        signInWithEmail: async (email, password) => {
            try {
                signInWithEmailAndPassword(config.firebaseAuth, email, password);
            }
            catch (error) {
                console.error("Error during email sign-in:", error);
            }
        },
        async signInWithGoogle() {
            await doNow(async () => {
                try {
                    const idToken = await config.signInToGoogleFromPlatform();
                    if (!isValid(idToken))
                        return;
                    const credential = GoogleAuthProvider.credential(idToken);
                    await signInWithCredential(config.firebaseAuth, credential);
                    // console.log("Google Sign-In Success:", credential);
                }
                catch (error) {
                    console.error("Error during Google Sign-In:", error);
                }
            });
        },
        async signOut() {
            try {
                // We have to be carful how we call `firebaseAuth.signOut` because it depends on "this" and JavaScript tends to mess that up.
                await config.firebaseAuth.signOut();
                await config.signOutFromPlatform();
            }
            catch (error) {
                console.error("Error during Sign-Out:", error);
            }
        },
    };
}
// SECTION: Workspace
export function firebaseWorkspace(config) {
    return {
        onUserMetadata(handle) {
            return onSnapshot(config.userMetadataDoc, (snapshot) => {
                const metadata = snapshot.data();
                handle(metadata ?? null);
            });
        },
        async createWorkspace(params) {
            return (await httpsCallable(config.firebaseFunctions, "createWorkspace")(params)).data;
        },
        async createWorkspaceInterface(params) {
            return await setDoc(docRef(config.workspaceInvitesCollection, params.inviteCode), {
                workspaceId: params.workspaceId,
                validForDays: params.validForDays,
                createdAt: serverTimestamp(),
            });
        },
        async joinWorkspace(params) {
            return (await httpsCallable(config.firebaseFunctions, "joinWorkspace")(params)).data;
        },
        async leaveWorkspace(params) {
            return (await httpsCallable(config.firebaseFunctions, "leaveWorkspace")(params)).data;
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
function initializeUser(config) {
    const { useProp, useFormula, doNow, exists, onDispose } = config.sessionPersister;
    function createWorkspaceInterface(userId, workspaceIntegration, onDispose) {
        const isCreatingWorkspace = useProp(false);
        const isJoiningWorkspace = useProp(false);
        const isLeavingWorkspace = useProp(false);
        const PendingAsJson = null;
        const NoneAsJson = 0;
        const userMetadata = doNow(() => {
            const userMetadata = useProp(PendingAsJson);
            const savedMetadata = config.directoryPersister
                .jsonFile(`${userId}.json`)
                .start(PendingAsJson);
            savedMetadata.loadedFromLocalStorage.then(() => {
                userMetadata.value = savedMetadata.data;
            });
            const disposeOnSnapshot = workspaceIntegration.onUserMetadata((newMetadata) => {
                savedMetadata.batchUpdate((data) => {
                    const newMetadataValue = exists(newMetadata?.workspaceId) && exists(newMetadata?.role)
                        ? {
                            workspaceId: newMetadata.workspaceId,
                            role: newMetadata.role,
                        }
                        : NoneAsJson;
                    data.value = newMetadataValue;
                    userMetadata.value = newMetadataValue;
                });
            });
            onDispose(disposeOnSnapshot);
            return userMetadata;
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
                async joinWorkspace(props) {
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
            createJoinedInst(userMetadata) {
                return {
                    haveJoined: true,
                    id: userMetadata.workspaceId,
                    role: userMetadata.role,
                    async createWorkspaceInvite() {
                        if (userMetadata.role !== `owner`) {
                            console.error(`Attempted to create a workspace invite without permission.`);
                            return;
                        }
                        if (userMetadata.workspaceId === null) {
                            console.error(`Attempted to create a workspace invite without a workspace.`);
                            return;
                        }
                        const validForDays = 14;
                        const inviteCode = doc(collection(config.firestore, `${config.stage}-WorkspaceInvites`)).id;
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
        };
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
        const userInfo = useProp(undefined);
        const firebaseAuth = firebaseAuthIntegration({
            ...config.authConfig,
            onAuthStateChanged: (user) => {
                userInfo.value = user;
            },
        });
        const isSigningIn = useProp(false);
        const isSigningOut = useProp(false);
        // TODO: Force these to be single threaded.
        async function signUpWithEmail(email, password) {
            isSigningIn.value = true;
            await firebaseAuth.signUpWithEmail(email, password);
            isSigningIn.value = false;
        }
        async function signInWithEmail(email, password) {
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
            createAwaitingVerificationInst(userInfo) {
                return {
                    isAwaitingVerification: true,
                    get email() {
                        return userInfo.email ?? null;
                    },
                    signOut,
                };
            },
            // TODO: Maybe swap out the whole object when the user changes.
            createSignedInInst(userInfo, onDispose) {
                const workspace = createWorkspaceInterface(userInfo.uid, firebaseWorkspace({
                    firebaseFunctions: config.firebaseFunctions,
                    userMetadataDoc: doc(collection(config.firestore, `${config.stage}-UserMetadata`), userInfo.uid),
                    workspaceInvitesCollection: collection(config.firestore, `${config.stage}-WorkspaceInvites`),
                }), onDispose);
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
        return useFormula(() => userInfo.value === undefined
            ? UserStates.pending
            : userInfo.value === null
                ? isSigningIn.value
                    ? UserStates.signingIn
                    : UserStates.signedOut
                : isSigningOut.value
                    ? UserStates.signingOut
                    : UserStates.createSignedInInst(userInfo.value, onDispose));
    });
}
