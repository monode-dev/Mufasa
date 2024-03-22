import { CollectionReference, DocumentReference, Firestore } from "firebase/firestore";
import { Cloud, Device } from "../DocStore.js";
import { FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";
import { UserInfo } from "../Auth.js";
import { Functions } from "firebase/functions";
import { WorkspaceIntegration } from "../Workspace.js";
import { ReadonlyProp } from "@monode/mosa";
export declare function firebasePersister(firebaseConfig: {
    firestore: Firestore;
    firebaseStorage: FirebaseStorage;
    firebaseFunctions: Functions;
    authConfig: AuthParams;
}): (config: {
    stage: string;
    setWorkspaceId: (workspaceId: string) => void;
    sessionPersister: {
        readonly useRoot: <T>(func: () => T) => T;
        readonly useProp: <GetType, SetType = GetType>(initValue: GetType) => import("@monode/mosa").Prop<GetType, SetType>;
        readonly useFormula: <GetType_1, Setter extends ((value: any) => any) | undefined = ((value: GetType_1) => any) | undefined>(compute: () => GetType_1, set?: Setter | undefined) => ReadonlyProp<GetType_1> & (undefined extends Setter ? {} : Setter extends (...args: any[]) => any ? import("@monode/mosa").WriteonlyProp<Parameters<Setter>[0]> : {});
        readonly doNow: <T_1>(func: () => T_1) => T_1;
        readonly doWatch: (func: () => void, options?: Partial<{
            on: ReadonlyProp<any>[];
        }> | undefined) => void;
        readonly onDispose: (func: () => void) => void;
        readonly exists: <T_2>(x: T_2) => x is NonNullable<T_2>;
    };
    directoryPersister?: Device.DirectoryPersister | undefined;
}) => {
    exports: {
        value: ({
            isPending: boolean;
        } & {
            isSignedOut?: undefined;
            signUpWithEmail?: undefined;
            signInWithEmail?: undefined;
            signInWithGoogle?: undefined;
        } & {
            isSigningIn?: undefined;
        } & {
            isSigningOut?: undefined;
        } & {
            email?: undefined;
            uid?: undefined;
            isSignedIn?: undefined;
            workspace?: undefined;
            signOut?: undefined;
        }) | ({
            isSignedOut: boolean;
            signUpWithEmail: (email: string, password: string) => Promise<void>;
            signInWithEmail: (email: string, password: string) => Promise<void>;
            signInWithGoogle: () => Promise<void>;
        } & {
            isPending?: undefined;
        } & {
            isSigningIn?: undefined;
        } & {
            isSigningOut?: undefined;
        } & {
            email?: undefined;
            uid?: undefined;
            isSignedIn?: undefined;
            workspace?: undefined;
            signOut?: undefined;
        }) | ({
            isSigningIn: boolean;
        } & {
            isPending?: undefined;
        } & {
            isSignedOut?: undefined;
            signUpWithEmail?: undefined;
            signInWithEmail?: undefined;
            signInWithGoogle?: undefined;
        } & {
            isSigningOut?: undefined;
        } & {
            email?: undefined;
            uid?: undefined;
            isSignedIn?: undefined;
            workspace?: undefined;
            signOut?: undefined;
        }) | ({
            isSigningOut: boolean;
        } & {
            isPending?: undefined;
        } & {
            isSignedOut?: undefined;
            signUpWithEmail?: undefined;
            signInWithEmail?: undefined;
            signInWithGoogle?: undefined;
        } & {
            isSigningIn?: undefined;
        } & {
            email?: undefined;
            uid?: undefined;
            isSignedIn?: undefined;
            workspace?: undefined;
            signOut?: undefined;
        }) | ({
            uid: string;
            email: string | null;
            isSignedIn: boolean;
            readonly workspace: ({
                readonly isPending: true;
            } & {
                isNone?: undefined;
                createWorkspace?: undefined;
                joinWorkspace?: undefined;
            } & {
                isCreating?: undefined;
            } & {
                isJoining?: undefined;
            } & {
                isLeaving?: undefined;
            } & {
                id?: undefined;
                role?: undefined;
                haveJoined?: undefined;
                createWorkspaceInvite?: undefined;
                leaveWorkspace?: undefined;
            }) | ({
                readonly isNone: true;
                readonly createWorkspace: () => Promise<void>;
                readonly joinWorkspace: (props: {
                    inviteCode: string;
                }) => Promise<void>;
            } & {
                isPending?: undefined;
            } & {
                isCreating?: undefined;
            } & {
                isJoining?: undefined;
            } & {
                isLeaving?: undefined;
            } & {
                id?: undefined;
                role?: undefined;
                haveJoined?: undefined;
                createWorkspaceInvite?: undefined;
                leaveWorkspace?: undefined;
            }) | ({
                readonly isCreating: true;
            } & {
                isPending?: undefined;
            } & {
                isNone?: undefined;
                createWorkspace?: undefined;
                joinWorkspace?: undefined;
            } & {
                isJoining?: undefined;
            } & {
                isLeaving?: undefined;
            } & {
                id?: undefined;
                role?: undefined;
                haveJoined?: undefined;
                createWorkspaceInvite?: undefined;
                leaveWorkspace?: undefined;
            }) | ({
                readonly isJoining: true;
            } & {
                isPending?: undefined;
            } & {
                isNone?: undefined;
                createWorkspace?: undefined;
                joinWorkspace?: undefined;
            } & {
                isCreating?: undefined;
            } & {
                isLeaving?: undefined;
            } & {
                id?: undefined;
                role?: undefined;
                haveJoined?: undefined;
                createWorkspaceInvite?: undefined;
                leaveWorkspace?: undefined;
            }) | ({
                readonly isLeaving: true;
            } & {
                isPending?: undefined;
            } & {
                isNone?: undefined;
                createWorkspace?: undefined;
                joinWorkspace?: undefined;
            } & {
                isCreating?: undefined;
            } & {
                isJoining?: undefined;
            } & {
                id?: undefined;
                role?: undefined;
                haveJoined?: undefined;
                createWorkspaceInvite?: undefined;
                leaveWorkspace?: undefined;
            }) | ({
                haveJoined: boolean;
                id: string | null;
                role: "member" | "owner" | null;
                createWorkspaceInvite(): Promise<{
                    inviteCode: string;
                    validForDays: number;
                } | undefined>;
                leaveWorkspace(): Promise<void>;
            } & {
                isPending?: undefined;
            } & {
                isNone?: undefined;
                createWorkspace?: undefined;
                joinWorkspace?: undefined;
            } & {
                isCreating?: undefined;
            } & {
                isJoining?: undefined;
            } & {
                isLeaving?: undefined;
            });
            signOut: () => Promise<void>;
        } & {
            isPending?: undefined;
        } & {
            isSignedOut?: undefined;
            signUpWithEmail?: undefined;
            signInWithEmail?: undefined;
            signInWithGoogle?: undefined;
        } & {
            isSigningIn?: undefined;
        } & {
            isSigningOut?: undefined;
        });
    };
    getWorkspacePersister: (setup: {
        stage: string | null;
        workspaceId: string;
        docType: string;
    }) => Cloud.WorkspacePersister;
};
type AuthParams = Omit<Parameters<typeof firebaseAuthIntegration>[0], `onAuthStateChanged`>;
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
export {};
