import { Firestore } from "firebase-admin/firestore";
import { Storage } from "firebase-admin/storage";
import { Auth } from "firebase-admin/auth";
export declare function initializeMufasaFunctions({ firestore, auth, storage, }: {
    firestore: Firestore;
    auth: Auth;
    storage: Storage;
}): {
    createWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    joinWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    leaveWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    removeMember: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    deleteWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    deleteAccount: import("firebase-functions/v2/https").CallableFunction<any, Promise<void>>;
};
