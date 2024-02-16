import { GetDefaultPersistersFromDocType } from "./Doc.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export declare function initializeMufasa(mfsConfig: {
    getDefaultPersistersFromDocType: GetDefaultPersistersFromDocType;
}): {
    readonly fileStore: (config: {
        storeName: string;
        sessionDocPersister: import("./DocStore.js").SessionDocPersister;
        localJsonPersister: import("./DocStore.js").LocalJsonPersister;
        globalDocPersister?: import("./DocStore.js").GlobalDocPersister | undefined;
        localFilePersister: import("./FileStore.js").LocalFilePersister;
        globalFilePersister?: import("./FileStore.js").GlobalFilePersister | undefined;
    }) => {
        new (): {
            readonly webPath: import("./Utils.js").Flagged<string | null, typeof import("./Doc.js").OptionalPropFlag>;
            onDelete(): void;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: import("./DocStore.js").Persistance;
                        };
                    };
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
                    };
                }, maxPersistance?: import("./DocStore.js").Persistance | undefined, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
                readonly getMaxPersistance: (docId: string) => import("./DocStore.js").Persistance | null;
                readonly promoteDocPersistance: (docId: string, newPersistance: import("./DocStore.js").Persistance) => void;
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            readonly maxPersistance: import("./DocStore.js").Persistance | null;
            delete(): void;
        };
        readonly typeName: string;
        createFromBinaryString(byteString: string): Promise<{
            readonly webPath: import("./Utils.js").Flagged<string | null, typeof import("./Doc.js").OptionalPropFlag>;
            onDelete(): void;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: import("./DocStore.js").Persistance;
                        };
                    };
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
                    };
                }, maxPersistance?: import("./DocStore.js").Persistance | undefined, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
                readonly getMaxPersistance: (docId: string) => import("./DocStore.js").Persistance | null;
                readonly promoteDocPersistance: (docId: string, newPersistance: import("./DocStore.js").Persistance) => void;
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            readonly maxPersistance: import("./DocStore.js").Persistance | null;
            delete(): void;
        }>;
        getPersisters(): import("./DocStore.js").DocPersisters;
        readonly docType: string;
        readonly _docStore: {
            readonly loadedFromLocalStorage: Promise<void>;
            readonly batchUpdate: (updates: {
                readonly [x: string]: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
                    };
                };
            }) => void;
            readonly createDoc: (props: {
                readonly [x: string]: {
                    readonly value: import("./DocStore.js").PrimVal;
                    readonly maxPersistance: import("./DocStore.js").Persistance;
                };
            }, maxPersistance?: import("./DocStore.js").Persistance | undefined, manualDocId?: string | undefined) => string;
            readonly deleteDoc: (docId: string) => void;
            readonly isDocDeleted: (docId: string) => boolean;
            readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
            readonly getAllDocs: () => string[];
            readonly getMaxPersistance: (docId: string) => import("./DocStore.js").Persistance | null;
            readonly promoteDocPersistance: (docId: string, newPersistance: import("./DocStore.js").Persistance) => void;
        };
        newTypeFromPersisters(persisters: import("./DocStore.js").DocPersisters): {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly batchUpdate: (updates: {
                        readonly [x: string]: {
                            readonly [x: string]: {
                                readonly value: import("./DocStore.js").PrimVal;
                                readonly maxPersistance: import("./DocStore.js").Persistance;
                            };
                        };
                    }) => void;
                    readonly createDoc: (props: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: import("./DocStore.js").Persistance;
                        };
                    }, maxPersistance?: import("./DocStore.js").Persistance | undefined, manualDocId?: string | undefined) => string;
                    readonly deleteDoc: (docId: string) => void;
                    readonly isDocDeleted: (docId: string) => boolean;
                    readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                    readonly getAllDocs: () => string[];
                    readonly getMaxPersistance: (docId: string) => import("./DocStore.js").Persistance | null;
                    readonly promoteDocPersistance: (docId: string, newPersistance: import("./DocStore.js").Persistance) => void;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                readonly maxPersistance: import("./DocStore.js").Persistance | null;
                onDelete(): void;
                delete(): void;
            };
            getPersisters(): import("./DocStore.js").DocPersisters;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: import("./DocStore.js").Persistance;
                        };
                    };
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
                    };
                }, maxPersistance?: import("./DocStore.js").Persistance | undefined, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
                readonly getMaxPersistance: (docId: string) => import("./DocStore.js").Persistance | null;
                readonly promoteDocPersistance: (docId: string, newPersistance: import("./DocStore.js").Persistance) => void;
            };
            newTypeFromPersisters(persisters: import("./DocStore.js").DocPersisters): any;
            getAllDocs<T extends typeof import("./Doc.js").Doc>(this: T): InstanceType<T>[];
            _fromId<T_1 extends typeof import("./Doc.js").Doc>(this: T_1, docId: string): InstanceType<T_1>;
            create<T_2 extends typeof import("./Doc.js").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_3 ? T_3 extends (import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_3 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
        };
        getAllDocs<T extends typeof import("./Doc.js").Doc>(this: T): InstanceType<T>[];
        _fromId<T_1 extends typeof import("./Doc.js").Doc>(this: T_1, docId: string): InstanceType<T_1>;
        create<T_2 extends typeof import("./Doc.js").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_4 ? T_4 extends (import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_4 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
    };
    readonly Doc: typeof import("./Doc.js").Doc;
    readonly getDefaultPersistersFromDocType: GetDefaultPersistersFromDocType;
};
