import { Firestore } from "firebase-admin/firestore";
import { Auth } from "firebase-admin/auth";
export declare function initializeMufasaFunctions({ firestore, auth, }: {
    firestore: Firestore;
    auth: Auth;
}): {
    createWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    joinWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
    leaveWorkspace: import("firebase-functions/v2/https").CallableFunction<any, Promise<{}>>;
};
