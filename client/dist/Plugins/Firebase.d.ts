import { CollectionReference, QueryFilterConstraint, Firestore } from "firebase/firestore";
import { Cloud } from "../DocStore.js";
import { StorageReference, FirebaseStorage } from "firebase/storage";
import { Auth, OAuthCredential, UserCredential } from "firebase/auth";
import { Functions } from "firebase/functions";
import { CloudAuth, WorkspaceIntegration, UserInfo } from "../Workspace.js";
export declare function firebasePersister<T extends AuthProviders>(firebaseConfig: {
    firestore: Firestore;
    firebaseStorage?: FirebaseStorage;
    firebaseFunctions: Functions;
} & AuthParams<T>): {
    getCloudAuth({ onAuthStateChanged, stage }: {
        onAuthStateChanged: (user: UserInfo | null) => void;
        stage: string;
    }): CloudAuth<{
        signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
        signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
    } & { [Key in keyof T & string as `signInWith${Capitalize<Key>}`]: (...params: Parameters<T[Key]["signIn"]>) => Promise<UserCredential>; }>;
    getWorkspacePersister: (setup: {
        stage: string | null;
        workspaceId: string;
        docType: string;
    }) => Cloud.WorkspacePersister;
};
export declare function workspacePersister(firestoreConfig: {
    collectionRef: CollectionReference;
    queryConstraints: QueryFilterConstraint[];
}, refreshCustomClaims: () => Promise<void>, getStorageRef?: (fileId: string) => StorageReference): Cloud.WorkspacePersister;
type AuthParams<T extends AuthProviders> = Omit<Parameters<typeof firebaseAuthIntegration<T>>[0], `onAuthStateChanged` | `workspaceInvitesCollection` | `stage` | `firestore` | `refreshCustomClaims`>;
type AuthProviders = {
    [key: string]: {
        signIn: (...params: any) => Promise<OAuthCredential | undefined>;
        signOut: () => Promise<void>;
    };
};
export declare function firebaseAuthIntegration<T extends AuthProviders>(config: {
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
}): CloudAuth<{
    signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
    signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
} & {
    [Key in keyof T & string as `signInWith${Capitalize<Key>}`]: (...params: Parameters<T[Key][`signIn`]>) => Promise<UserCredential>;
}>;
export declare function firebaseWorkspace(config: {
    firebaseFunctions: Functions;
    uid: string;
    userMetadataCollection: CollectionReference;
    workspaceInvitesCollection: CollectionReference;
    workspacesCollection: CollectionReference;
    refreshCustomClaims: () => Promise<void>;
}): WorkspaceIntegration;
export {};
