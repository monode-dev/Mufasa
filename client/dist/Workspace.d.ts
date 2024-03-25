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
}): ReadonlyProp<({
    isSignedOut: true;
} & T) | {
    isPending: boolean;
} | {
    isSigningIn: boolean;
} | {
    isSigningOut: boolean;
} | {
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
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
    } & {
        id?: undefined;
        role?: undefined;
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
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
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
    } & {
        id?: undefined;
        role?: undefined;
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
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
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
    } & {
        id?: undefined;
        role?: undefined;
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
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
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
    } & {
        id?: undefined;
        role?: undefined;
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
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
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
    } & {
        id?: undefined;
        role?: undefined;
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
        leaveWorkspace?: undefined;
        haveJoined?: undefined;
        otherMembers?: undefined;
    }) | ({
        haveJoined: boolean;
        id: string;
        readonly otherMembers: Member[];
    } & {
        isOwner: boolean;
        role: "owner";
        createWorkspaceInvite(): Promise<{
            inviteCode: string;
            validForDays: number;
        } | undefined>;
        kickMember(): Promise<void>;
        leaveWorkspace?: undefined;
    } & {} & {
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
    } & {}) | ({
        haveJoined: boolean;
        id: string;
        readonly otherMembers: Member[];
    } & {
        role: "member";
        leaveWorkspace(): Promise<void>;
        isOwner?: undefined;
        createWorkspaceInvite?: undefined;
        kickMember?: undefined;
    } & {} & {
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
    } & {});
    signOut: () => Promise<void>;
}>;
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
