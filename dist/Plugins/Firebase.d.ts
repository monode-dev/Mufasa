import { CollectionReference, QueryFilterConstraint } from "firebase/firestore";
import { GlobalDocPersister, GlobalFilePersister } from "../DocStore.js";
import { StorageReference } from "firebase/storage";
import { Auth } from "firebase/auth";
import { UserInfo } from "../Auth.js";
export declare function firestoreDocPersister(collectionRef: CollectionReference, ...queryConstraints: QueryFilterConstraint[]): GlobalDocPersister;
export declare function firebaseFilePersister(getStorageRef: (fileId: string) => StorageReference): GlobalFilePersister;
export declare function firebaseAuthIntegration(firebaseAuth: Auth, onAuthStateChanged: (user: UserInfo | null) => void): {
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle(): Promise<void>;
    signOut(): Promise<void>;
};
