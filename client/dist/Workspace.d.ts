import { Device, DocStore, PersistanceConfig, Session, createDocStore } from "./DocStore.js";
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
export declare function initializeWorkspaceInstManager(config: {
    sessionPersister: Session.Persister;
    jsonFile: Device.JsonPersister;
}): {
    registerWorkspace(workspaceId: string): string;
    getWorkspaceInstId(workspaceId: string | null): string | null;
    getDocStore(params: {
        workspaceId: string | null;
        docType: string;
        createDocStore: () => DocStore;
    }): DocStore | null;
    ejectWorkspace(workspaceId: string): void;
};
export declare function getDocStore(params: {
    stage: string;
    workspaceId: string | null;
    docType: string;
    getStoreConfig: () => PersistanceConfig;
}): DocStore;
export declare function getFileStore(params: {
    stage: string;
    workspaceId: string | null;
    docType: string;
    getStoreConfig: () => PersistanceConfig;
}): FileStore;
