import { CollectionReference, QueryFilterConstraint, DocumentReference } from "firebase/firestore";
import { GlobalDocPersister, GlobalFilePersister } from "../DocStore.js";
import { StorageReference } from "firebase/storage";
import { Auth, UserMetadata } from "firebase/auth";
import { UserInfo } from "../Auth.js";
import { Functions } from "firebase/functions";
export declare function firestoreDocPersister(collectionRef: CollectionReference, ...queryConstraints: QueryFilterConstraint[]): GlobalDocPersister;
export declare function firebaseFilePersister(getStorageRef: (fileId: string) => StorageReference): GlobalFilePersister;
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
}): {
    onUserMetadata(handle: (metadata: UserMetadata | null) => void): import("@firebase/firestore").Unsubscribe;
    createWorkspace: import("@firebase/functions").HttpsCallable<{
        stage: string;
    }, void>;
    createWorkspaceInterface(params: {
        inviteCode: string;
        workspaceId: string;
        validForDays: number;
    }): Promise<void>;
    joinWorkspace: import("@firebase/functions").HttpsCallable<{
        inviteCode: string;
        stage: string;
    }, void>;
    leaveWorkspace: import("@firebase/functions").HttpsCallable<{
        stage: string;
    } | undefined, void>;
};
