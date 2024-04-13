import { CollectionReference, QueryFilterConstraint, Firestore } from "firebase/firestore";
import { Cloud } from "../DocStore.js";
import { StorageReference, FirebaseStorage } from "firebase/storage";
import { Auth, OAuthCredential } from "firebase/auth";
import { Functions } from "firebase/functions";
import { CloudAuth, WorkspaceIntegration, UserInfo } from "../Workspace.js";
export declare function firebasePersister(firebaseConfig: {
    firestore: Firestore;
    firebaseStorage?: FirebaseStorage;
    firebaseFunctions: Functions;
} & AuthParams): {
    getCloudAuth({ onAuthStateChanged, stage }: {
        onAuthStateChanged: (user: UserInfo | null) => void;
        stage: string;
    }): CloudAuth<{
        signUpWithEmail: (email: string, password: string) => Promise<void>;
        signInWithEmail: (email: string, password: string) => Promise<void>;
    } & {
        [x: `signInWith${Capitalize<string>}`]: (...params: any) => Promise<void>;
    }>;
    getWorkspacePersister: (setup: {
        stage: string | null;
        workspaceId: string;
        docType: string;
    }) => Cloud.WorkspacePersister;
};
export declare function workspacePersister(firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
}, getStorageRef?: (fileId: string) => StorageReference): Cloud.WorkspacePersister;
type AuthParams = Omit<Parameters<typeof firebaseAuthIntegration>[0], `onAuthStateChanged` | `workspaceInvitesCollection` | `stage` | `firestore`>;
export declare function firebaseAuthIntegration<T extends {
    [key: string]: {
        signIn: (...params: any) => Promise<OAuthCredential | undefined>;
        signOut: () => Promise<void>;
    };
}>(config: {
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signOutFromFirebase: () => Promise<void>;
    providers: T;
    firebaseAuth: Auth;
    onAuthStateChanged: (user: UserInfo | null) => void;
    firebaseFunctions: Functions;
    workspaceInvitesCollection: CollectionReference;
    firestore: Firestore;
    stage: string;
}): CloudAuth<{
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
} & {
    [Key in keyof T & string as `signInWith${Capitalize<Key>}`]: (...params: Parameters<T[Key][`signIn`]>) => Promise<void>;
}>;
export declare function firebaseWorkspace(config: {
    firebaseFunctions: Functions;
    uid: string;
    userMetadataCollection: CollectionReference;
    workspaceInvitesCollection: CollectionReference;
}): WorkspaceIntegration;
export {};
