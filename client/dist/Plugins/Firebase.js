import { onSnapshot, query, where, updateDoc, doc as docRef, setDoc, serverTimestamp, and, or, collection, doc, } from "firebase/firestore";
import { uploadString, deleteObject, getBytes, ref as storageRef, } from "firebase/storage";
import { isValid } from "../Utils.js";
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
        stopUploadsAndDownloads() {
            // TODO: Implement
        },
    };
}
export function firebaseAuthIntegration(config) {
    config.firebaseAuth.onAuthStateChanged((user) => {
        config.onAuthStateChanged(user !== null ? { uid: user.uid, email: user.email } : null);
    });
    const altSignInMethods = Object.fromEntries(Object.entries(config.authProviders ?? {}).map(([providerName, value]) => [
        `signInWith${providerName[0].toUpperCase()}${providerName.slice(1)}`,
        async () => {
            const credential = await value.signIn();
            if (!isValid(credential))
                return;
            await signInWithCredential(config.firebaseAuth, credential);
        },
    ]));
    return {
        signInFuncs: {
            signUpWithEmail: async (email, password) => {
                await config.signUpWithEmail(email, password);
            },
            signInWithEmail: async (email, password) => {
                await config.signInWithEmail(email, password);
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
                    catch (error) { }
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
        watchMembers(workspaceId, onMembers) {
            return onSnapshot(query(config.userMetadataCollection, where("workspaceId", "==", workspaceId)), (snapshot) => onMembers(snapshot.docs.map((doc) => doc.data())));
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
