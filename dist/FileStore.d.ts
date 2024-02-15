import { DocExports } from "./Doc";
import { GlobalDocPersister, LocalJsonPersister, Persistance, SessionDocPersister } from "./DocStore";
export type GlobalFilePersister = {
    uploadFile: (fileId: string, data: string) => Promise<void>;
    downloadFile: (fileId: string) => Promise<string | undefined>;
    deleteFile: (fileId: string) => Promise<void>;
};
export type LocalFilePersister = {
    getWebPath: (fileId: string) => Promise<string | undefined>;
    readFile: (fileId: string) => Promise<string | undefined>;
    writeFile: (fileId: string, data: string) => Promise<void>;
    deleteFile: (fileId: string) => Promise<void>;
    localJsonPersister: LocalJsonPersister;
};
export declare function initializeFileStoreFactory(factoryConfig: DocExports): {
    fileStore: (config: {
        storeName: string;
        sessionDocPersister: SessionDocPersister;
        localJsonPersister: LocalJsonPersister;
        globalDocPersister?: GlobalDocPersister;
        localFilePersister: LocalFilePersister;
        globalFilePersister?: GlobalFilePersister;
    }) => {
        new (): {
            readonly webPath: import("./Utils").Flagged<string | null, typeof import("./Doc").OptionalPropFlag>;
            onDelete(): void;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore").PrimVal | (() => import("./DocStore").PrimVal)) => import("./DocStore").PrimVal;
                readonly getAllDocs: () => string[];
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            delete(): void;
        };
        readonly typeName: string;
        createFromBinaryString(byteString: string): Promise<{
            readonly webPath: import("./Utils").Flagged<string | null, typeof import("./Doc").OptionalPropFlag>;
            onDelete(): void;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore").PrimVal | (() => import("./DocStore").PrimVal)) => import("./DocStore").PrimVal;
                readonly getAllDocs: () => string[];
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            delete(): void;
        }>;
        getPersisters(): import("./DocStore").DocPersisters;
        readonly docType: string;
        readonly _docStore: {
            readonly loadedFromLocalStorage: Promise<void>;
            readonly batchUpdate: (updates: {
                readonly [x: string]: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                };
            }) => void;
            readonly createDoc: (props: {
                readonly [x: string]: {
                    readonly value: import("./DocStore").PrimVal;
                    readonly maxPersistance: Persistance;
                };
            }, manualDocId?: string | undefined) => string;
            readonly deleteDoc: (docId: string) => void;
            readonly isDocDeleted: (docId: string) => boolean;
            readonly getProp: (id: string, key: string, initValue: import("./DocStore").PrimVal | (() => import("./DocStore").PrimVal)) => import("./DocStore").PrimVal;
            readonly getAllDocs: () => string[];
        };
        newTypeFromPersisters(persisters: import("./DocStore").DocPersisters): {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly batchUpdate: (updates: {
                        readonly [x: string]: {
                            readonly [x: string]: {
                                readonly value: import("./DocStore").PrimVal;
                                readonly maxPersistance: Persistance;
                            };
                        };
                    }) => void;
                    readonly createDoc: (props: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    }, manualDocId?: string | undefined) => string;
                    readonly deleteDoc: (docId: string) => void;
                    readonly isDocDeleted: (docId: string) => boolean;
                    readonly getProp: (id: string, key: string, initValue: import("./DocStore").PrimVal | (() => import("./DocStore").PrimVal)) => import("./DocStore").PrimVal;
                    readonly getAllDocs: () => string[];
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                delete(): void;
            };
            getPersisters(): import("./DocStore").DocPersisters;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore").PrimVal | (() => import("./DocStore").PrimVal)) => import("./DocStore").PrimVal;
                readonly getAllDocs: () => string[];
            };
            newTypeFromPersisters(persisters: import("./DocStore").DocPersisters): any;
            getAllDocs<T extends typeof import("./Doc").Doc>(this: T): InstanceType<T>[];
            _fromId<T_1 extends typeof import("./Doc").Doc>(this: T_1, docId: string): InstanceType<T_1>;
            create<T_2 extends typeof import("./Doc").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag> extends never ? true : false) extends infer T_3 ? T_3 extends (import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag> extends never ? true : false) ? T_3 extends true ? (prop?: ({ [K in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K], typeof import("./Doc").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").OptionalPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K], typeof import("./Doc").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").OptionalPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
        };
        getAllDocs<T extends typeof import("./Doc").Doc>(this: T): InstanceType<T>[];
        _fromId<T_1 extends typeof import("./Doc").Doc>(this: T_1, docId: string): InstanceType<T_1>;
        create<T_2 extends typeof import("./Doc").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag> extends never ? true : false) extends infer T_4 ? T_4 extends (import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag> extends never ? true : false) ? T_4 extends true ? (prop?: ({ [K in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K], typeof import("./Doc").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").OptionalPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").RequiredPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K], typeof import("./Doc").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils").PickFlagged<InstanceType<T_2>, typeof import("./Doc").OptionalPropFlag>]: import("./Utils").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
    };
};
