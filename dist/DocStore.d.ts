import type { MosaApi } from "@monode/mosa";
export declare const DELETED_KEY = "mx_deleted";
export type Persistance = (typeof Persistance)[keyof typeof Persistance];
export declare const Persistance: {
    readonly session: 0;
    readonly local: 1;
    readonly global: 2;
};
export type PrimVal = boolean | number | string | null;
export type DocJson = {
    [key: string]: PrimVal;
};
export type WritableUpdateBatch = {
    [docId: string]: DocJson;
};
export type UpdateBatch = Device.ToReadonlyJson<WritableUpdateBatch>;
export type WritablePersistanceTaggedUpdateBatch = {
    [docId: string]: {
        [key: string]: {
            value: PrimVal;
            maxPersistance: Persistance;
        };
    };
};
export type PersistanceTaggedUpdateBatch = Device.ToReadonlyJson<WritablePersistanceTaggedUpdateBatch>;
export declare namespace Session {
    type Persister = MosaApi;
    type TablePersister = {
        batchUpdate(updates: UpdateBatch, newDocsAreOnlyVirtual: boolean): void;
        getProp(id: string, key: string, initValue: PrimVal | (() => PrimVal)): PrimVal;
        peekProp(id: string, key: string): PrimVal | undefined;
        getAllDocs(): string[];
        docExists(docId: string): boolean;
    };
    const mockTablePersister: Session.TablePersister;
}
export declare namespace Device {
    type Persister = (directoryPath: string) => Device.DirectoryPersister;
    /** TODO: We can make this simpler by giving it the format
     * `{ persist: <T extends JsonObj>(fileId: string, initValue: T) => Promise<T> }`
     * We can still batch updates by using `new Promise(() => save())`
     * This will delay the save until the end of the current thread. */
    type DirectoryPersister = {
        readonly jsonFile: (fileId: string) => Device.JsonPersister;
        getWebPath: (fileId: string) => Promise<string | undefined>;
        readFile: (fileId: string) => Promise<string | undefined>;
        writeFile: (fileId: string, base64String: string) => Promise<void>;
        deleteFile: (fileId: string) => Promise<void>;
    };
    type JsonPersister = {
        readonly start: <T extends Json>(initValue: T) => Device.SavedJson<T>;
    };
    const mockDirectoryPersister: Device.DirectoryPersister;
    type SavedJson<T extends Json> = {
        readonly loadedFromLocalStorage: Promise<void>;
        readonly data: Device.ToReadonlyJson<T>;
        readonly batchUpdate: (doUpdate: (json: {
            value: T;
        }, doNotSave: () => void) => Promise<unknown> | unknown) => Promise<void>;
    };
    type Json = string | number | boolean | null | Json[] | JsonObj;
    type JsonObj = {
        [key: string]: Json;
    };
    type ToReadonlyJson<T extends Json> = T extends Json[] ? ReadonlyArray<Device.ToReadonlyJson<T[number]>> : T extends JsonObj ? {
        readonly [K in keyof T]: Device.ToReadonlyJson<T[K]>;
    } : T;
}
export declare namespace Cloud {
    type Persister<T extends {}> = (config: {
        stage: string;
        setWorkspaceId: (workspaceId: string) => void;
        sessionPersister: Session.Persister;
        directoryPersister?: Device.DirectoryPersister;
    }) => {
        getWorkspacePersister: GetWorkspacePersister;
        exports: T;
    };
    type GetWorkspacePersister = (options: {
        stage: string | null;
        workspaceId: string;
        docType: string;
    }) => Cloud.WorkspacePersister;
    type WorkspacePersister = {
        start: (batchUpdate: (updates: UpdateBatch) => void, localMetaDataPersister: Device.JsonPersister) => void;
        updateDoc: (change: Cloud.DocChange) => Promise<void>;
        uploadFile: (fileId: string, base64String: string) => Promise<void>;
        downloadFile: (fileId: string) => Promise<string | undefined>;
        deleteFile: (fileId: string) => Promise<void>;
    };
    const mockWorkspacePersister: Cloud.WorkspacePersister;
    type DocChange = {
        docId: string;
        props: DocJson;
        isBeingCreatedOrDeleted: boolean;
    };
    type UploadEvents = {
        onStartUploadBatch?: () => void;
        onFinishUploadBatch?: () => void;
    };
}
export type DocStore = ReturnType<typeof createDocStore>;
export type PersisterSetup = {
    stage: string | null;
    workspaceId: string;
    docType: string;
};
export type PersistanceConfig = {
    sessionPersister: Session.Persister;
    devicePersister?: Device.Persister;
    getWorkspacePersister?: Cloud.GetWorkspacePersister;
    trackUpload: () => void;
    untrackUpload: () => void;
    onIncomingCreate?: (docId: string) => void;
    onIncomingDelete?: (docId: string) => void;
};
export type DocStoreParams = {
    sessionTablePersister: Session.TablePersister;
    deviceDirectoryPersister: Device.DirectoryPersister;
    cloudWorkspacePersister: Cloud.WorkspacePersister;
    trackUpload: () => void;
    untrackUpload: () => void;
    onIncomingCreate: (docId: string) => void;
    onIncomingDelete: (docId: string) => void;
};
export declare function initDocStoreConfig(params: {
    persistance: PersistanceConfig;
    stage: string | null;
    workspaceId: string | null;
    docType: string;
}): DocStoreParams;
export declare function createDocStore(config: DocStoreParams): {
    readonly loadedFromLocalStorage: Promise<void>;
    readonly batchUpdate: (updates: PersistanceTaggedUpdateBatch, options: {
        overwriteGlobally: boolean;
    }) => void;
    readonly createDoc: (props: PersistanceTaggedUpdateBatch[string], manualDocId?: string) => string;
    readonly deleteDoc: (docId: string) => void;
    readonly isDocDeleted: (docId: string) => boolean;
    readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
    readonly getAllDocs: () => string[];
};
