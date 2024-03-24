import { DocStore, PersistanceConfig } from "./DocStore.js";
import { FileStore } from "./FileStore.js";
export type WorkspaceIntegration = {
    onUserMetadata: (handle: (metadata: UserMetadata | null) => void) => () => void;
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
export type UserMetadata = {
    workspaceId: string | null;
    role: `member` | `owner` | null;
};
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
