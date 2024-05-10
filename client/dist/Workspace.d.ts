import { Device, Session, Cloud } from "./DocStore.js";
import { ReadonlyProp } from "mosa-js";
export type UserInfo = {
    uid: string;
    email: string | null;
    emailVerified: boolean;
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
    watchEntitlements: (workspaceId: string, handle: (entitlements: string[]) => void) => void;
    refreshToken: () => Promise<void>;
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
    removeMember: (params: {
        stage: string;
        uid: string;
    }) => Promise<void>;
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
    [key: string]: (...args: any) => Promise<any>;
};
export type User<T extends Cloud.Persister<any>> = ReturnType<typeof initializeAuth<ReturnType<T[`getCloudAuth`]>[`signInFuncs`]>>[`value`];
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
        isSigningIn: boolean;
    } & T;
    signedIn: {
        uid: string;
        email: string | null;
        isSignedIn: true;
        workspace: ReturnType<typeof createWorkspaceInterface>[`value`];
        signOut: () => Promise<void>;
        isSigningOut: boolean;
    };
    signedInButNotVerified: {
        isSignedInButNotVerified: true;
        uid: string;
        email: string | null;
        signOut: () => Promise<void>;
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
    readonly isCreating: boolean;
    readonly isJoining: boolean;
} | ({
    haveJoined: boolean;
    id: string;
    readonly otherMembers: Member[];
    readonly workspaceEntitlements: string[];
    readonly isLeaving: boolean;
    refreshToken(): Promise<void>;
} & (({
    isOwner: boolean;
    role: "owner";
    createWorkspaceInvite(): Promise<{
        inviteCode: string;
        validForDays: number;
    } | undefined>;
    removeMember(params: {
        uid: string;
    }): Promise<void>;
    leaveWorkspace?: undefined;
} & {}) | ({
    role: "member";
    leaveWorkspace(): Promise<void>;
    isOwner?: undefined;
    createWorkspaceInvite?: undefined;
    removeMember?: undefined;
} & {})))>;
export {};
