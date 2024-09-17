import { PersistanceConfig, Persistance, PrimVal, StoreBank } from "./DocStore.js";
import { Flagged, PickFlagged, StripFlag } from "./Utils.js";
export declare const getStoreBank: () => {
    getStore<T extends "file" | "doc">(params: {
        storeType: T;
        docType: string;
        getStoreConfig: () => PersistanceConfig;
        onStoreInit?: ((store: T extends "doc" ? {
            readonly loadedFromLocalStorage: Promise<void>;
            readonly stop: () => Promise<void>;
            readonly batchUpdate: (updates: {
                readonly [x: string]: {
                    readonly [x: string]: {
                        readonly value: PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                };
            }, options: {
                overwriteGlobally: boolean;
            }) => void;
            readonly createDoc: (props: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            }, manualDocId?: string | undefined) => string;
            readonly deleteDoc: (docId: string) => void;
            readonly isDocDeleted: (docId: string) => boolean;
            readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
            readonly getAllDocs: () => string[];
            readonly getHaveCompletedFirstSync: () => boolean;
            readonly export: (path: string, shouldInclude?: ((filePath: string) => boolean) | undefined) => Promise<void>;
        } : {
            docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
                readonly batchUpdate: (updates: {
                    readonly [x: string]: {
                        readonly [x: string]: {
                            readonly value: PrimVal;
                            readonly maxPersistance: Persistance;
                        };
                    };
                }, options: {
                    overwriteGlobally: boolean;
                }) => void;
                readonly createDoc: (props: {
                    readonly [x: string]: {
                        readonly value: PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                }, manualDocId?: string | undefined) => string;
                readonly deleteDoc: (docId: string) => void;
                readonly isDocDeleted: (docId: string) => boolean;
                readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
                readonly getAllDocs: () => string[];
                readonly getHaveCompletedFirstSync: () => boolean;
                readonly export: (path: string, shouldInclude?: ((filePath: string) => boolean) | undefined) => Promise<void>;
            };
            stop(): Promise<void>;
            pushCreate(params: {
                base64String: string;
                manualDocId?: string | undefined;
            }): Promise<string>;
            reUpload(fileId: string): Promise<void>;
            pullCreate: ((fileId: string) => void) & {
                addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => void) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => void) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => void) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => void) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => void) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => void) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => void) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => void) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => void) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => void) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => void) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & any;
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
            } & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            };
            pushDelete: ((fileId: string) => void) & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            } & {
                addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => void) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => void) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => void) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => void) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => void) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => void) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => void) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => void) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => void) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => void) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => void) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & any;
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
            pullDelete: ((fileId: string) => void) & {
                addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => void) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => void) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => void) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => void) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => void) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => void) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => void) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => void) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => void) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => void) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => void) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & any;
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
            } & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            };
            readFile(fileId: string): Promise<string | undefined>;
        }) => void) | undefined;
    }): T extends "doc" ? {
        readonly loadedFromLocalStorage: Promise<void>;
        readonly stop: () => Promise<void>;
        readonly batchUpdate: (updates: {
            readonly [x: string]: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            };
        }, options: {
            overwriteGlobally: boolean;
        }) => void;
        readonly createDoc: (props: {
            readonly [x: string]: {
                readonly value: PrimVal;
                readonly maxPersistance: Persistance;
            };
        }, manualDocId?: string | undefined) => string;
        readonly deleteDoc: (docId: string) => void;
        readonly isDocDeleted: (docId: string) => boolean;
        readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
        readonly getAllDocs: () => string[];
        readonly getHaveCompletedFirstSync: () => boolean;
        readonly export: (path: string, shouldInclude?: ((filePath: string) => boolean) | undefined) => Promise<void>;
    } : {
        docStore: {
            readonly loadedFromLocalStorage: Promise<void>;
            readonly stop: () => Promise<void>;
            readonly batchUpdate: (updates: {
                readonly [x: string]: {
                    readonly [x: string]: {
                        readonly value: PrimVal;
                        readonly maxPersistance: Persistance;
                    };
                };
            }, options: {
                overwriteGlobally: boolean;
            }) => void;
            readonly createDoc: (props: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            }, manualDocId?: string | undefined) => string;
            readonly deleteDoc: (docId: string) => void;
            readonly isDocDeleted: (docId: string) => boolean;
            readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
            readonly getAllDocs: () => string[];
            readonly getHaveCompletedFirstSync: () => boolean;
            readonly export: (path: string, shouldInclude?: ((filePath: string) => boolean) | undefined) => Promise<void>;
        };
        stop(): Promise<void>;
        pushCreate(params: {
            base64String: string;
            manualDocId?: string | undefined;
        }): Promise<string>;
        reUpload(fileId: string): Promise<void>;
        pullCreate: ((fileId: string) => void) & {
            addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => void) & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            } & {
                addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => void) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => void) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => void) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => void) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => void) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => void) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => void) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => void) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => void) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => void) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & any;
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
        } & {
            pauseAll: () => Promise<void>;
            resumeAll: () => Promise<void>;
        };
        pushDelete: ((fileId: string) => void) & {
            pauseAll: () => Promise<void>;
            resumeAll: () => Promise<void>;
        } & {
            addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => void) & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            } & {
                addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => void) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => void) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => void) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => void) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => void) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => void) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => void) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => void) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => void) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => void) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & any;
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
        pullDelete: ((fileId: string) => void) & {
            addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => void) & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            } & {
                addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => void) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => void) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => void) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => void) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => void) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => void) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => void) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => void) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => void) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => void) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & any;
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
        } & {
            pauseAll: () => Promise<void>;
            resumeAll: () => Promise<void>;
        };
        readFile(fileId: string): Promise<string | undefined>;
    };
};
export declare const trackUpload: () => void;
export declare const untrackUpload: () => void;
export type DocExports = ReturnType<typeof initializeDocClass>;
export type DocClass = ReturnType<DocExports["Doc"]>;
export type DocInst = InstanceType<DocClass>;
export declare function initializeDocClass(config: {
    storeBank: StoreBank;
    defaultPersistance: PersistanceConfig;
}): {
    Doc(docType: string, customizations?: Omit<Parameters<typeof Doc.customize>[0], `docType`>): typeof Doc;
};
export declare class Doc {
    static readonly RootClass: typeof Doc;
    /*** NOTE: This can be overridden to manually specify a type name. */
    static get docType(): string;
    get docType(): string;
    static getDocStoreConfig<This extends typeof Doc>(this: This): PersistanceConfig;
    static ensureSyncHasStarted(): void;
    static get _docStore(): {
        readonly loadedFromLocalStorage: Promise<void>;
        readonly stop: () => Promise<void>;
        readonly batchUpdate: (updates: {
            readonly [x: string]: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            };
        }, options: {
            overwriteGlobally: boolean;
        }) => void;
        readonly createDoc: (props: {
            readonly [x: string]: {
                readonly value: PrimVal;
                readonly maxPersistance: Persistance;
            };
        }, manualDocId?: string | undefined) => string;
        readonly deleteDoc: (docId: string) => void;
        readonly isDocDeleted: (docId: string) => boolean;
        readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
        readonly getAllDocs: () => string[];
        readonly getHaveCompletedFirstSync: () => boolean;
        readonly export: (path: string, shouldInclude?: ((filePath: string) => boolean) | undefined) => Promise<void>;
    };
    get _docStore(): {
        readonly loadedFromLocalStorage: Promise<void>;
        readonly stop: () => Promise<void>;
        readonly batchUpdate: (updates: {
            readonly [x: string]: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            };
        }, options: {
            overwriteGlobally: boolean;
        }) => void;
        readonly createDoc: (props: {
            readonly [x: string]: {
                readonly value: PrimVal;
                readonly maxPersistance: Persistance;
            };
        }, manualDocId?: string | undefined) => string;
        readonly deleteDoc: (docId: string) => void;
        readonly isDocDeleted: (docId: string) => boolean;
        readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
        readonly getAllDocs: () => string[];
        readonly getHaveCompletedFirstSync: () => boolean;
        readonly export: (path: string, shouldInclude?: ((filePath: string) => boolean) | undefined) => Promise<void>;
    };
    static customize<This extends typeof Doc>(this: This, customizations: {
        docType?: string;
        docStoreConfig?: Partial<PersistanceConfig>;
    }): This;
    get docId(): string;
    get isDeleted(): boolean;
    static getAllDocs<T extends typeof Doc>(this: T): InstanceType<T>[];
    static getHaveCompletedFirstSync<T extends typeof Doc>(this: T): boolean;
    static _fromId<T extends typeof Doc>(this: T, docId: string): InstanceType<T>;
    static create<T extends typeof Doc>(this: T, ...overrideProps: CreateParams<T>): InstanceType<T>;
    static export(path: string, shouldInclude?: (path: string) => boolean): Promise<void>;
    /** Override to run code just before an object is deleted. */
    onDelete(): void;
    /** Permanently deletes this object. */
    readonly deleteDoc: () => void;
}
type CreateParams<T extends typeof Doc> = CreateParamsFromInst<InstanceType<T>>;
type OptionalParameter<T, IsOptional extends boolean> = Parameters<IsOptional extends true ? (prop?: T) => void : (prop: T) => void>;
type CreateParamsFromInst<T> = OptionalParameter<{
    [K in PickFlagged<T, RequiredPropFlag>]: StripFlag<T[K], RequiredPropFlag>;
} & Partial<{
    [K in PickFlagged<T, OptionalPropFlag>]: StripFlag<T[K], OptionalPropFlag>;
}>, PickFlagged<T, RequiredPropFlag> extends never ? true : false>;
export type RequiredPropFlag = typeof RequiredPropFlag;
export declare const RequiredPropFlag: unique symbol;
export type OptionalPropFlag = typeof OptionalPropFlag;
export declare const OptionalPropFlag: unique symbol;
type PropClass = typeof Boolean | typeof Number | typeof String | typeof Doc;
type PropType<T extends PropClass = PropClass> = T | [T, null];
type PropInst = boolean | number | string | Doc | null;
type PropValue<T extends PropType | PropInst = PropType | PropInst> = T extends any[] ? PropValue<T[number]> : T extends typeof Doc ? InstanceType<T> | null : T extends typeof Boolean ? boolean : T extends typeof Number ? number : T extends typeof String ? string : T extends boolean ? boolean : T extends number ? number : T extends string ? string : null;
export declare function prop<FirstParam extends PropType | PropValue, SecondParam extends FirstParam extends PropType ? PropValue<FirstParam> | undefined : never>(firstParam: FirstParam, secondParam?: SecondParam, options?: {
    persistance?: Persistance;
    key?: string;
}): Flagged<PropValue<FirstParam>, FirstParam extends PropType ? undefined extends SecondParam ? RequiredPropFlag : OptionalPropFlag : OptionalPropFlag>;
export declare function formula<T>(compute: () => T, set?: (newVal: T) => void): T;
export type IsCustomProp = typeof IsCustomProp;
export declare const IsCustomProp: unique symbol;
export type CustomProp = {
    [IsCustomProp]: true;
    otherDocsToStartSyncing: (typeof Doc)[];
    overrideKey?: string;
} & (({
    isFullCustom: false;
    getInitValue: () => PrimVal | undefined;
    getFallbackValue: () => PrimVal | (() => any);
    fromPrim: (prim: PrimVal) => any;
    isNewList?: boolean;
    persistance: Persistance;
} & ({
    toPrim?: (inst: any) => PrimVal;
    onSet?: undefined;
} | {
    onSet?: (newVal: any) => void;
    toPrim?: undefined;
})) | {
    isFullCustom: true;
    init: (inst: Doc, key: string) => void;
});
export {};
