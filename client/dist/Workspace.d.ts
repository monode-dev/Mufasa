import { Device, DocStore, PersistanceConfig, Session } from "./DocStore.js";
import { FileStore } from "./FileStore.js";
import { ReadonlyProp } from "@monode/mosa";
export type UserInfo = {
    uid: string;
    email: string | null;
};
export type Member = {
    uid: string;
    email: string | null;
    role: `member` | `owner`;
};
export type UserMetadata = {
    workspaceId: string | null;
    role: `member` | `owner` | null;
};
export type NonNullUserMetadata = {
    [K in keyof UserMetadata]-?: NonNullable<UserMetadata[K]>;
};
export type WorkspaceIntegration = {
    onUserMetadata: (handle: (metadata: UserMetadata | null) => void) => () => void;
    watchMembers: (workspaceId: string, handle: (members: Member[]) => void) => void;
    generateInviteCode: () => Promise<string>;
    createWorkspace: (params: {
        stage: string;
    }) => Promise<void>;
    createWorkspaceInterface: (params: {
        inviteCode: string;
        workspaceId: string;
        validForDays: number;
    }) => Promise<void>;
    joinWorkspace: (params: {
        inviteCode: string;
        stage: string;
    }) => Promise<void>;
    leaveWorkspace: (params: {
        stage: string;
    } | undefined) => Promise<void>;
};
export type GetCloudAuth<T extends SignInFuncs> = (config: {
    onAuthStateChanged: (user: UserInfo | null) => void;
    stage: string;
}) => CloudAuth<T>;
export type CloudAuth<T extends SignInFuncs> = {
    signInFuncs: T;
    signOut: () => Promise<void>;
    getWorkspaceIntegration: (uid: string) => WorkspaceIntegration;
};
export type SignInFuncs = {
    [key: string]: () => Promise<void>;
};
export declare function initializeAuth<T extends SignInFuncs>(config: {
    stage: string;
    sessionPersister: Session.Persister;
    directoryPersister: Device.DirectoryPersister;
    getCloudAuth: GetCloudAuth<T>;
}): {
    get value(): UserState<T>;
};
export type UserState<T extends SignInFuncs> = _Or<_UserStates<T>>;
type _UserStates<T extends SignInFuncs> = {
    pending: {
        isPending: true;
    };
    signedOut: {
        isSignedOut: true;
    } & T;
    signingIn: {
        isSigningIn: true;
    };
    signedIn: {
        uid: string;
        email: string | null;
        isSignedIn: true;
        workspace: ReturnType<typeof createWorkspaceInterface>[`value`];
        signOut: () => Promise<void>;
    };
    signingOut: {
        isSigningOut: true;
    };
};
type _Or<T extends {
    [key: string]: {};
}> = {
    [K in keyof T]: T[K] & {
        [K2 in Exclude<_AllKeys<T>, keyof T[K]>]?: undefined;
    };
}[keyof T];
type _AllKeys<T extends {
    [key: string]: {};
}> = {
    [K in keyof T]: keyof T[K];
}[keyof T];
declare function createWorkspaceInterface(config: {
    uid: string;
    workspaceIntegration: WorkspaceIntegration;
    onDispose: (dispose: () => void) => void;
    directoryPersister: Device.DirectoryPersister;
    sessionPersister: Session.Persister;
    stage: string;
}): ReadonlyProp<{
    readonly isPending: true;
} | {
    readonly isNone: true;
    readonly createWorkspace: () => Promise<void>;
    readonly joinWorkspace: (props: {
        inviteCode: string;
    }) => Promise<void>;
} | {
    readonly isCreating: true;
} | {
    readonly isJoining: true;
} | {
    readonly isLeaving: true;
} | ({
    haveJoined: boolean;
    id: string;
    readonly otherMembers: Member[];
} & (({
    isOwner: boolean;
    role: "owner";
    createWorkspaceInvite(): Promise<{
        inviteCode: string;
        validForDays: number;
    } | undefined>;
    kickMember(): Promise<void>;
    leaveWorkspace?: undefined;
} & {}) | ({
    role: "member";
    leaveWorkspace(): Promise<void>;
    isOwner?: undefined;
    createWorkspaceInvite?: undefined;
    kickMember?: undefined;
} & {})))>;
export declare function getDocStore(params: {
    stage: string;
    workspaceId: string | null;
    docType: string;
    getStoreConfig: () => PersistanceConfig;
    onStoreInit?: (store: DocStore) => void;
}): DocStore;
export declare function getFileStore(params: {
    stage: string;
    workspaceId: string | null;
    docType: string;
    getStoreConfig: () => PersistanceConfig;
    onStoreInit?: (store: FileStore) => void;
}): FileStore;
export {};
