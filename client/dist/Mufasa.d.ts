import { Session, Device, Cloud } from "./DocStore.js";
import { SignInFuncs } from "./Workspace.js";
export { prop, formula } from "./Doc.js";
export { list } from "./List.js";
export { isValid } from "./Utils.js";
export { Cloud, Device, Session, DocJson, PersistanceConfig, DocStore, UpdateBatch, DELETED_KEY, Persistance, } from "./DocStore.js";
export { UserInfo } from "./Auth.js";
export { WorkspaceIntegration, UserMetadata } from "./Workspace.js";
/** Set up Mufasa for your app.
 * ```ts
 * import { initializeMufasa } from "mufasa";
 * import { solidPersister } from "mufasa/solid-js";
 * import { capacitorPersister } from "mufasa/capacitor";
 * import { firebasePersister } from "mufasa/firebase";
 *
 * export const mfs = initializeMufasa({
 *   sessionPersister: solidPersister(),
 *   devicePersister: capacitorPersister(),
 *   cloudPersister: firebasePersister(...),
 * });
 * ```
 */
export declare function initializeMufasa<C extends Cloud.Persister<T>, T extends SignInFuncs = {}>(mfsConfig: {
    stage?: string;
    sessionPersister: Session.Persister;
    devicePersister?: Device.Persister;
    cloudPersister: C;
}): {
    readonly isUploadingToCloud: boolean;
    readonly workspaceId: string | null;
    readonly File: (docType: string, customizations?: Omit<{
        docType?: string | undefined;
        docStoreConfig?: Partial<import("./DocStore.js").PersistanceConfig> | undefined;
    }, "docType"> | undefined) => {
        new (): {
            readonly _fileStore: {
                docStore: {
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
                pushCreate(params: {
                    base64String: string;
                    manualDocId?: string | undefined;
                }): Promise<string>;
                pullCreate: ((fileId: string) => Promise<string | null>) & {
                    addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                        addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                            addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                    addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                        addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                            addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                    addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                        addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                            addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & any;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                pushDelete: ((fileId: string) => Promise<void>) & {
                    addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                        addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                            addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                    addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                        addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                            addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                    addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                        addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                            addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & any;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                pullDelete: ((fileId: string) => Promise<void>) & {
                    addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                        addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                            addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                    addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                        addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                            addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                    addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                        addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                            addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & any;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readFile(fileId: string): Promise<string | undefined>;
            };
            readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
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
        readonly _fileStore: {
            docStore: {
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
            pushCreate(params: {
                base64String: string;
                manualDocId?: string | undefined;
            }): Promise<string>;
            pullCreate: ((fileId: string) => Promise<string | null>) & {
                addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                    addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                        addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                            addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                    addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                        addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                            addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                    addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                        addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & any;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            pushDelete: ((fileId: string) => Promise<void>) & {
                addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                    addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                        addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                            addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                    addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                        addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                            addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                    addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                        addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & any;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            pullDelete: ((fileId: string) => Promise<void>) & {
                addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                    addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                        addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                            addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                    addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                        addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                            addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                    addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                        addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & any;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readFile(fileId: string): Promise<string | undefined>;
        };
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
        createFromBase64String(base64String: string): Promise<{
            readonly _fileStore: {
                docStore: {
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
                pushCreate(params: {
                    base64String: string;
                    manualDocId?: string | undefined;
                }): Promise<string>;
                pullCreate: ((fileId: string) => Promise<string | null>) & {
                    addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                        addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                            addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                    addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                        addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                            addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                    addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                        addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                            addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & any;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                pushDelete: ((fileId: string) => Promise<void>) & {
                    addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                        addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                            addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                    addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                        addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                            addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                    addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                        addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                            addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & any;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                pullDelete: ((fileId: string) => Promise<void>) & {
                    addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                        addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                            addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                    addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                        addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                            addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                    addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                        addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                            addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & any;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readFile(fileId: string): Promise<string | undefined>;
            };
            readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
            readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
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
        readonly docType: string;
        getDocStoreConfig<This extends typeof import("./Doc.js").Doc>(this: This): import("./DocStore.js").PersistanceConfig;
        ensureSyncHasStarted(): void;
        customize<This_1 extends typeof import("./Doc.js").Doc>(this: This_1, customizations: {
            docType?: string | undefined;
            docStoreConfig?: Partial<import("./DocStore.js").PersistanceConfig> | undefined;
        }): This_1;
        getAllDocs<T extends typeof import("./Doc.js").Doc>(this: T): InstanceType<T>[];
        _fromId<T_1 extends typeof import("./Doc.js").Doc>(this: T_1, docId: string): InstanceType<T_1>;
        create<T_2 extends typeof import("./Doc.js").Doc>(this: T_2, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_3 ? T_3 extends (import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_3 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_2>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_2>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_2>;
    };
    readonly user: ({
        isSignedOut: true;
    } & T extends infer T_4 ? T_4 extends {
        isSignedOut: true;
    } & T ? T_4 extends any ? T_4 extends null | undefined ? T_4 : T_4 & (((Exclude<{
        isPending: boolean;
    }, T_4> extends infer T_5 ? T_5 extends Exclude<{
        isPending: boolean;
    }, T_4> ? T_5 extends any ? { [K_2 in Exclude<keyof T_5, keyof T_4>]?: undefined; } : never : never : never) extends infer T_6 ? T_6 extends (Exclude<{
        isPending: boolean;
    }, T_4> extends infer T_7 ? T_7 extends Exclude<{
        isPending: boolean;
    }, T_4> ? T_7 extends any ? { [K_3 in Exclude<keyof T_7, keyof T_4>]?: undefined; } : never : never : never) ? T_6 extends any ? (x: T_6) => void : never : never : never) | ((Exclude<{
        isSigningIn: boolean;
    }, T_4> extends infer T_8 ? T_8 extends Exclude<{
        isSigningIn: boolean;
    }, T_4> ? T_8 extends any ? { [K_4 in Exclude<keyof T_8, keyof T_4>]?: undefined; } : never : never : never) extends infer T_9 ? T_9 extends (Exclude<{
        isSigningIn: boolean;
    }, T_4> extends infer T_10 ? T_10 extends Exclude<{
        isSigningIn: boolean;
    }, T_4> ? T_10 extends any ? { [K_5 in Exclude<keyof T_10, keyof T_4>]?: undefined; } : never : never : never) ? T_9 extends any ? (x: T_9) => void : never : never : never) | ((Exclude<{
        isSigningOut: boolean;
    }, T_4> extends infer T_11 ? T_11 extends Exclude<{
        isSigningOut: boolean;
    }, T_4> ? T_11 extends any ? { [K_6 in Exclude<keyof T_11, keyof T_4>]?: undefined; } : never : never : never) extends infer T_12 ? T_12 extends (Exclude<{
        isSigningOut: boolean;
    }, T_4> extends infer T_13 ? T_13 extends Exclude<{
        isSigningOut: boolean;
    }, T_4> ? T_13 extends any ? { [K_7 in Exclude<keyof T_13, keyof T_4>]?: undefined; } : never : never : never) ? T_12 extends any ? (x: T_12) => void : never : never : never) | ((Exclude<{
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }, T_4> extends infer T_14 ? T_14 extends Exclude<{
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }, T_4> ? T_14 extends any ? { [K_8 in Exclude<keyof T_14, keyof T_4>]?: undefined; } : never : never : never) extends infer T_15 ? T_15 extends (Exclude<{
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }, T_4> extends infer T_16 ? T_16 extends Exclude<{
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }, T_4> ? T_16 extends any ? { [K_9 in Exclude<keyof T_16, keyof T_4>]?: undefined; } : never : never : never) ? T_15 extends any ? (x: T_15) => void : never : never : never) | ((Exclude<{
        isSignedOut: true;
    } & T extends infer T_17 ? T_17 extends {
        isSignedOut: true;
    } & T ? T_17 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_17 : never : never, T_4> extends infer T_18 ? T_18 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_19 ? T_19 extends {
        isSignedOut: true;
    } & T ? T_19 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_19 : never : never, T_4> ? T_18 extends any ? { [K_10 in Exclude<keyof T_18, keyof T_4>]?: undefined; } : never : never : never) extends infer T_20 ? T_20 extends (Exclude<{
        isSignedOut: true;
    } & T extends infer T_21 ? T_21 extends {
        isSignedOut: true;
    } & T ? T_21 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_21 : never : never, T_4> extends infer T_22 ? T_22 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_23 ? T_23 extends {
        isSignedOut: true;
    } & T ? T_23 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_23 : never : never, T_4> ? T_22 extends any ? { [K_11 in Exclude<keyof T_22, keyof T_4>]?: undefined; } : never : never : never) ? T_20 extends any ? (x: T_20) => void : never : never : never) extends (x: infer I) => void ? I : never) : never : never : never) | ({
        isPending: boolean;
    } & (((x: {
        isSigningIn?: undefined;
    }) => void) | ((x: {
        isSigningOut?: undefined;
    }) => void) | ((x: {
        email?: undefined;
        uid?: undefined;
        workspace?: undefined;
        isSignedIn?: undefined;
        signOut?: undefined;
    }) => void) | ((Exclude<{
        isSignedOut: true;
    } & T extends infer T_24 ? T_24 extends {
        isSignedOut: true;
    } & T ? T_24 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_24 : never : never, {
        isPending: boolean;
    }> extends infer T_25 ? T_25 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_26 ? T_26 extends {
        isSignedOut: true;
    } & T ? T_26 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_26 : never : never, {
        isPending: boolean;
    }> ? T_25 extends any ? { [K_12 in Exclude<keyof T_25, "isPending">]?: undefined; } : never : never : never) extends infer T_27 ? T_27 extends (Exclude<{
        isSignedOut: true;
    } & T extends infer T_28 ? T_28 extends {
        isSignedOut: true;
    } & T ? T_28 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_28 : never : never, {
        isPending: boolean;
    }> extends infer T_29 ? T_29 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_30 ? T_30 extends {
        isSignedOut: true;
    } & T ? T_30 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_30 : never : never, {
        isPending: boolean;
    }> ? T_29 extends any ? { [K_13 in Exclude<keyof T_29, "isPending">]?: undefined; } : never : never : never) ? T_27 extends any ? (x: T_27) => void : never : never : never) extends (x: infer I) => void ? I : never)) | ({
        isSigningIn: boolean;
    } & (((x: {
        isPending?: undefined;
    }) => void) | ((x: {
        isSigningOut?: undefined;
    }) => void) | ((x: {
        email?: undefined;
        uid?: undefined;
        workspace?: undefined;
        isSignedIn?: undefined;
        signOut?: undefined;
    }) => void) | ((Exclude<{
        isSignedOut: true;
    } & T extends infer T_31 ? T_31 extends {
        isSignedOut: true;
    } & T ? T_31 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_31 : never : never, {
        isSigningIn: boolean;
    }> extends infer T_32 ? T_32 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_33 ? T_33 extends {
        isSignedOut: true;
    } & T ? T_33 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_33 : never : never, {
        isSigningIn: boolean;
    }> ? T_32 extends any ? { [K_14 in Exclude<keyof T_32, "isSigningIn">]?: undefined; } : never : never : never) extends infer T_34 ? T_34 extends (Exclude<{
        isSignedOut: true;
    } & T extends infer T_35 ? T_35 extends {
        isSignedOut: true;
    } & T ? T_35 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_35 : never : never, {
        isSigningIn: boolean;
    }> extends infer T_36 ? T_36 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_37 ? T_37 extends {
        isSignedOut: true;
    } & T ? T_37 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_37 : never : never, {
        isSigningIn: boolean;
    }> ? T_36 extends any ? { [K_15 in Exclude<keyof T_36, "isSigningIn">]?: undefined; } : never : never : never) ? T_34 extends any ? (x: T_34) => void : never : never : never) extends (x: infer I) => void ? I : never)) | ({
        isSigningOut: boolean;
    } & (((x: {
        isPending?: undefined;
    }) => void) | ((x: {
        isSigningIn?: undefined;
    }) => void) | ((x: {
        email?: undefined;
        uid?: undefined;
        workspace?: undefined;
        isSignedIn?: undefined;
        signOut?: undefined;
    }) => void) | ((Exclude<{
        isSignedOut: true;
    } & T extends infer T_38 ? T_38 extends {
        isSignedOut: true;
    } & T ? T_38 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_38 : never : never, {
        isSigningOut: boolean;
    }> extends infer T_39 ? T_39 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_40 ? T_40 extends {
        isSignedOut: true;
    } & T ? T_40 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_40 : never : never, {
        isSigningOut: boolean;
    }> ? T_39 extends any ? { [K_16 in Exclude<keyof T_39, "isSigningOut">]?: undefined; } : never : never : never) extends infer T_41 ? T_41 extends (Exclude<{
        isSignedOut: true;
    } & T extends infer T_42 ? T_42 extends {
        isSignedOut: true;
    } & T ? T_42 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_42 : never : never, {
        isSigningOut: boolean;
    }> extends infer T_43 ? T_43 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_44 ? T_44 extends {
        isSignedOut: true;
    } & T ? T_44 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_44 : never : never, {
        isSigningOut: boolean;
    }> ? T_43 extends any ? { [K_17 in Exclude<keyof T_43, "isSigningOut">]?: undefined; } : never : never : never) ? T_41 extends any ? (x: T_41) => void : never : never : never) extends (x: infer I) => void ? I : never)) | ({
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    } & (((x: {
        isPending?: undefined;
    }) => void) | ((x: {
        isSigningIn?: undefined;
    }) => void) | ((x: {
        isSigningOut?: undefined;
    }) => void) | ((Exclude<{
        isSignedOut: true;
    } & T extends infer T_45 ? T_45 extends {
        isSignedOut: true;
    } & T ? T_45 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_45 : never : never, {
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }> extends infer T_46 ? T_46 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_47 ? T_47 extends {
        isSignedOut: true;
    } & T ? T_47 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_47 : never : never, {
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }> ? T_46 extends any ? { [K_18 in Exclude<keyof T_46, "email" | "uid" | "workspace" | "isSignedIn" | "signOut">]?: undefined; } : never : never : never) extends infer T_48 ? T_48 extends (Exclude<{
        isSignedOut: true;
    } & T extends infer T_49 ? T_49 extends {
        isSignedOut: true;
    } & T ? T_49 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_49 : never : never, {
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }> extends infer T_50 ? T_50 extends Exclude<{
        isSignedOut: true;
    } & T extends infer T_51 ? T_51 extends {
        isSignedOut: true;
    } & T ? T_51 extends string | number | boolean | symbol | Function | RegExp | Date | null | undefined ? never : T_51 : never : never, {
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
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
            haveJoined?: undefined;
            createWorkspaceInvite?: undefined;
            leaveWorkspace?: undefined;
        }) | ({
            haveJoined: boolean;
            id: string | null;
            role: "member" | "owner" | null;
            createWorkspaceInvite(): Promise<{
                inviteCode: string;
                validForDays: number;
            } | undefined>;
            leaveWorkspace(): Promise<void>;
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
            isLeaving?: undefined;
        });
        signOut: () => Promise<void>;
    }> ? T_50 extends any ? { [K_19 in Exclude<keyof T_50, "email" | "uid" | "workspace" | "isSignedIn" | "signOut">]?: undefined; } : never : never : never) ? T_48 extends any ? (x: T_48) => void : never : never : never) extends (x: infer I) => void ? I : never));
    readonly Doc: (docType: string, customizations?: Omit<{
        docType?: string | undefined;
        docStoreConfig?: Partial<import("./DocStore.js").PersistanceConfig> | undefined;
    }, "docType"> | undefined) => typeof import("./Doc.js").Doc;
    readonly defaultPersistanceConfig: import("./DocStore.js").PersistanceConfig;
};
