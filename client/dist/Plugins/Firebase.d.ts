import { CollectionReference, QueryFilterConstraint, Firestore } from "firebase/firestore";
import { Cloud } from "../DocStore.js";
import { StorageReference, FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";
import { Functions } from "firebase/functions";
import { WorkspaceIntegration, UserInfo } from "../Workspace.js";
export declare function firebasePersister(firebaseConfig: {
    firestore: Firestore;
    firebaseStorage: FirebaseStorage;
    firebaseFunctions: Functions;
} & AuthParams): {
    getCloudAuth({ onAuthStateChanged, stage }: {
        onAuthStateChanged: (user: UserInfo | null) => void;
        stage: string;
    }): {
        signInFuncs: {
            signUpWithEmail: (email: string, password: string) => Promise<void>;
            signInWithEmail: (email: string, password: string) => Promise<void>;
            signInWithGoogle(): Promise<void>;
        };
        signOut(): Promise<void>;
        getWorkspaceIntegration: (uid: string) => WorkspaceIntegration;
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
type AuthParams = Omit<Parameters<typeof firebaseAuthIntegration>[0], `onAuthStateChanged` | `workspaceInvitesCollection` | `stage` | `firestore`>;
export declare function firebaseAuthIntegration(config: {
    signInToGoogleFromPlatform: () => Promise<string | undefined | null>;
    signOutFromPlatform: () => Promise<void>;
    firebaseAuth: Auth;
    onAuthStateChanged: (user: UserInfo | null) => void;
    firebaseFunctions: Functions;
    workspaceInvitesCollection: CollectionReference;
    firestore: Firestore;
    stage: string;
}): {
    signInFuncs: {
        signUpWithEmail: (email: string, password: string) => Promise<void>;
        signInWithEmail: (email: string, password: string) => Promise<void>;
        signInWithGoogle(): Promise<void>;
    };
    signOut(): Promise<void>;
    getWorkspaceIntegration: (uid: string) => WorkspaceIntegration;
};
export declare function firebaseWorkspace(config: {
    firebaseFunctions: Functions;
    uid: string;
    userMetadataCollection: CollectionReference;
    workspaceInvitesCollection: CollectionReference;
}): WorkspaceIntegration;
export {};
