import { GetDefaultPersistersFromDocType } from "./Doc.js";
import { UploadEvents } from "./DocStore.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export declare function initializeMufasa(mfsConfig: {
    getDefaultPersistersFromDocType: GetDefaultPersistersFromDocType;
    isUploading?: UploadEvents;
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
            readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsUploaded(): void;
            readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsDownloaded(): void;
            getBase64String(): Promise<string>;
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
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
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
        readonly typeName: string;
        createFromBase64String(base64String: string): Promise<{
            readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsUploaded(): void;
            readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            flagFileAsDownloaded(): void;
            getBase64String(): Promise<string>;
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
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
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
            }, options: {
                overwriteGlobally: boolean;
            }) => void;
            readonly createDoc: (props: {
                readonly [x: string]: {
                    readonly value: import("./DocStore.js").PrimVal;
                    readonly maxPersistance: import("./DocStore.js").Persistance;
                };
            }, manualDocId?: string | undefined) => string;
            readonly deleteDoc: (docId: string) => void;
            readonly isDocDeleted: (docId: string) => boolean;
            readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
            readonly getAllDocs: () => string[];
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
                    }, options: {
                        overwriteGlobally: boolean;
                    }) => void;
                    readonly createDoc: (props: {
                        readonly [x: string]: {
                            readonly value: import("./DocStore.js").PrimVal;
                            readonly maxPersistance: import("./DocStore.js").Persistance;
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
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: import("./DocStore.js").PrimVal;
                        readonly maxPersistance: import("./DocStore.js").Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: import("./DocStore.js").PrimVal | (() => import("./DocStore.js").PrimVal)) => import("./DocStore.js").PrimVal;
                readonly getAllDocs: () => string[];
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
