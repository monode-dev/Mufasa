import { DocExports } from "./Doc.js";
import { DocStoreConfig, GetPersister, LocalFilePersister, LocalJsonPersister, Persistance } from "./DocStore.js";
export declare function initializeFileStoreFactory<T extends DocExports<DocStoreConfig>>(factoryConfig: T): {
    fileStore: (config: {
        storeName: string;
    } & Partial<DocStoreConfig> & (undefined extends T[`defaultDocStoreConfig`][`getLocalJsonPersister`] ? {
        getLocalJsonPersister: GetPersister<LocalJsonPersister>;
    } : {}) & (undefined extends T[`defaultDocStoreConfig`][`getLocalFilePersister`] ? {
        getLocalFilePersister: GetPersister<LocalFilePersister>;
    } : {})) => {
        new (): {
            readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsUploaded(): void;
            readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsDownloaded(): void;
            /** Won't resolve until it retrieves and returns the base64String. */
            getBase64String(): Promise<string>;
            onDelete(): void;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            readonly deleteDoc: () => void;
        };
        createFromBase64String(base64String: string): Promise<{
            readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsUploaded(): void;
            readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsDownloaded(): void;
            /** Won't resolve until it retrieves and returns the base64String. */
            getBase64String(): Promise<string>;
            onDelete(): void;
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            readonly deleteDoc: () => void;
        }>;
        readonly docType: string;
        getDocStoreConfig<This extends typeof import("./Doc.js").Doc>(this: This): DocStoreConfig;
        readonly _docStore: {
            readonly loadedFromLocalStorage: Promise<void>;
            readonly batchUpdate: (updates: {
                readonly [x: string]: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                };
            }, options: {
                overwriteGlobally: boolean;
            }) => void;
            readonly createDoc: (props: {
                readonly [x: string]: {
                    readonly value: import("./DocStore.js").PrimVal;
                    readonly maxPersistance: Persistance;
                };
            }, manualDocId?: string | undefined) => string;
            readonly deleteDoc: (docId: string) => void;
            readonly isDocDeleted: (docId: string) => boolean;
            readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
            readonly getAllDocs: () => string[];
        };
        customize(customizations: {
            docType?: string | undefined;
            docStoreConfig?: DocStoreConfig | undefined;
        }): {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly batchUpdate: (updates: {
                        readonly [x: string]: {
                            readonly [x: string]: {
                                readonly value: import("./DocStore.js").PrimVal;
                                readonly maxPersistance: Persistance;
                            };
                        };
                    }, options: {
                        overwriteGlobally: boolean;
                    }) => void;
                    readonly createDoc: (props: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    }, manualDocId?: string | undefined) => string;
                    readonly deleteDoc: (docId: string) => void;
                    readonly isDocDeleted: (docId: string) => boolean;
                    readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                    readonly getAllDocs: () => string[];
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly docType: string;
            getDocStoreConfig<This extends typeof import("./Doc.js").Doc>(this: This): DocStoreConfig;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
            };
            customize(customizations: {
                docType?: string | undefined;
                docStoreConfig?: DocStoreConfig | undefined;
            }): any;
            getAllDocs<T extends typeof import("./Doc.js").Doc>(this: T): InstanceType<T>[];
            _fromId<T_1 extends typeof import("./Doc.js").Doc>(this: T_1, docId: string): InstanceType<T_1>;
            create<T_2 extends typeof import("./Doc.js").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_3 ? T_3 extends (import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_3 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
        };
        getAllDocs<T extends typeof import("./Doc.js").Doc>(this: T): InstanceType<T>[];
        _fromId<T_1 extends typeof import("./Doc.js").Doc>(this: T_1, docId: string): InstanceType<T_1>;
        create<T_2 extends typeof import("./Doc.js").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_4 ? T_4 extends (import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_4 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
    };
};
