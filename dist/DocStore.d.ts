export declare const DELETED_KEY = "mx_deleted";
export type Persistance = (typeof Persistance)[keyof typeof Persistance];
export declare const Persistance: {
    readonly session: "session";
    readonly local: "local";
    readonly global: "global";
};
export type PrimVal = boolean | number | string | null;
export type DocJson = {
    [key: string]: PrimVal;
};
export type WritableUpdateBatch = {
    [docId: string]: DocJson;
};
export type UpdateBatch = ToReadonlyJson<WritableUpdateBatch>;
export type WritablePersistanceTaggedUpdateBatch = {
    [docId: string]: {
        [key: string]: {
            value: PrimVal;
            maxPersistance: Persistance;
        };
    };
};
export type PersistanceTaggedUpdateBatch = ToReadonlyJson<WritablePersistanceTaggedUpdateBatch>;
export type SessionDocPersister = {
    batchUpdate(updates: UpdateBatch, newDocsAreOnlyVirtual: boolean): void;
    getProp(id: string, key: string, initValue: PrimVal | (() => PrimVal)): PrimVal;
    getAllDocs(): string[];
};
/** TODO: We can make this simpler by giving it the format
 * `{ persist: <T extends JsonObj>(fileId: string, initValue: T) => Promise<T> }`
 * We can still batch updates by using `new Promise(() => save())`
 * This will delay the save until the end of the current thread. */
export type LocalJsonPersister = {
    readonly jsonFile: (fileId: string) => LocalJsonFilePersister;
};
export type LocalJsonFilePersister = {
    readonly start: <T extends Json>(initValue: T) => SavedJson<T>;
};
export type SavedJson<T extends Json> = {
    readonly loadedFromLocalStorage: Promise<void>;
    readonly data: ToReadonlyJson<T>;
    readonly batchUpdate: (doUpdate: (json: T, doNotSave: () => void) => Promise<unknown> | unknown) => Promise<void>;
};
export type Json = string | number | boolean | null | Json[] | JsonObj;
export type JsonObj = {
    [key: string]: Json;
};
export type ToReadonlyJson<T extends Json> = T extends Json[] ? ReadonlyArray<ToReadonlyJson<T[number]>> : T extends JsonObj ? {
    readonly [K in keyof T]: ToReadonlyJson<T[K]>;
} : T;
export type GlobalDocPersister = {
    start: (batchUpdate: (updates: UpdateBatch) => void, localMetaDataPersister: LocalJsonFilePersister) => void;
    updateDoc: (change: GlobalDocChange) => Promise<void>;
};
export type GlobalDocChange = {
    docId: string;
    props: DocJson;
    isBeingCreatedOrDeleted: boolean;
};
export type DocStore = ReturnType<typeof createDocStore>;
export type DocPersisters = {
    sessionDocPersister: SessionDocPersister;
    localJsonPersister?: LocalJsonPersister;
    globalDocPersister?: GlobalDocPersister;
    onIncomingCreate?: (docId: string) => void;
    onIncomingDelete?: (docId: string) => void;
};
export declare function createDocStore(config: DocPersisters): {
    readonly loadedFromLocalStorage: Promise<void>;
    readonly batchUpdate: (updates: PersistanceTaggedUpdateBatch) => void;
    readonly createDoc: (props: PersistanceTaggedUpdateBatch[string], manualDocId?: string) => string;
    readonly deleteDoc: (docId: string) => void;
    readonly isDocDeleted: (docId: string) => boolean;
    readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
    readonly getAllDocs: () => string[];
};
