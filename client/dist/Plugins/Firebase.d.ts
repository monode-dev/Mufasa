import { CollectionReference, QueryFilterConstraint, DocumentReference, Firestore } from "firebase/firestore";
import { Cloud } from "../DocStore.js";
import { StorageReference, FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";
import { UserInfo } from "../Auth.js";
import { Functions } from "firebase/functions";
import { WorkspaceIntegration } from "../Workspace.js";
export declare function firebasePersister(firebaseConfig: {
    firestore: Firestore;
    firebaseStorage: FirebaseStorage;
    firebaseFunctions: Functions;
    authConfig: AuthParams;
}): {
    getCloudAuth({ onAuthStateChanged }: {
        onAuthStateChanged: (user: import("../Workspace.js").UserInfo | null) => void;
    }): {
        signInFuncs: {
            signUpWithEmail: (email: string, password: string) => Promise<void>;
            signInWithEmail: (email: string, password: string) => Promise<void>;
            signInWithGoogle(): Promise<void>;
        };
        signOut(): Promise<void>;
        workspaceIntegration: WorkspaceIntegration;
    };
    getWorkspacePersister: (setup: {
        stage: string | null;
        workspaceId: string;
        docType: string;
    }) => Cloud.WorkspacePersister;
};
export declare function workspacePersister(firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
}, getStorageRef: (fileId: string) => StorageReference): Cloud.WorkspacePersister;
type AuthParams = Omit<Parameters<typeof firebaseAuthIntegration>[0], `onAuthStateChanged`>;
export declare function firebaseAuthIntegration(config: {
    signInToGoogleFromPlatform: () => Promise<string | undefined | null>;
    signOutFromPlatform: () => Promise<void>;
    firebaseAuth: Auth;
    onAuthStateChanged: (user: UserInfo | null) => void;
    firebaseFunctions: Functions;
    userMetadataDoc: DocumentReference;
    workspaceInvitesCollection: CollectionReference;
}): {
    signInFuncs: {
        signUpWithEmail: (email: string, password: string) => Promise<void>;
        signInWithEmail: (email: string, password: string) => Promise<void>;
        signInWithGoogle(): Promise<void>;
    };
    signOut(): Promise<void>;
    workspaceIntegration: WorkspaceIntegration;
};
export declare function firebaseWorkspace(config: {
    firebaseFunctions: Functions;
    userMetadataDoc: DocumentReference;
    workspaceInvitesCollection: CollectionReference;
}): WorkspaceIntegration;
export {};
