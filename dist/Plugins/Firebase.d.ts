import { CollectionReference, QueryFilterConstraint, DocumentReference } from "firebase/firestore";
import { GlobalDocPersister } from "../DocStore.js";
import { StorageReference } from "firebase/storage";
import { Auth } from "firebase/auth";
import { UserInfo } from "../Auth.js";
import { Functions } from "firebase/functions";
import { WorkspaceIntegration } from "../Workspace.js";
export declare function firebasePersister(firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
}, getStorageRef: (fileId: string) => StorageReference): GlobalDocPersister;
export declare function firebaseAuthIntegration(config: {
    signInToGoogleFromPlatform: () => Promise<string | undefined | null>;
    signOutFromPlatform: () => Promise<void>;
    firebaseAuth: Auth;
    onAuthStateChanged: (user: UserInfo | null) => void;
}): {
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle(): Promise<void>;
    signOut(): Promise<void>;
};
export declare function firebaseWorkspace(config: {
    firebaseFunctions: Functions;
    userMetadataDoc: DocumentReference;
    workspaceInvitesCollection: CollectionReference;
}): WorkspaceIntegration;
