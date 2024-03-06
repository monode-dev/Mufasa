import { Doc } from "./Doc.js";
import { DocStoreParams, Persistance } from "./DocStore.js";
export declare function initializeSyncedFileClass(): {
    SyncedFile: typeof SyncedFile;
};
export type FileStore = ReturnType<typeof _createFileStore>;
declare function _createFileStore(config: DocStoreParams): {
    docStore: {
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
    pushCreate(params: {
        base64String: string;
        manualDocId?: string;
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
declare class SyncedFile extends Doc {
    static get _fileStore(): FileStore;
    get _fileStore(): {
        docStore: {
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
    static get _docStore(): {
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
    readonly fileIsUploaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
    readonly fileIsDownloaded: import("./Utils.js").Flagged<boolean, typeof import("./Doc.js").OptionalPropFlag>;
    /** Won't resolve until it retrieves and returns the base64String. */
    getBase64String(): Promise<string>;
    static createFromBase64String(base64String: string): Promise<SyncedFile>;
    onDelete(): void;
}
export {};
