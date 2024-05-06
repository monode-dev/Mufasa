import { PersistanceConfig, Persistance, PrimVal, StoreBank } from "./DocStore.js";
import { Flagged, PickFlagged, StripFlag } from "./Utils.js";
export type DocExports = ReturnType<typeof initializeDocClass>;
export type DocClass = DocExports["DocClass"];
export type DocInst = InstanceType<DocClass>;
export declare function initializeDocClass(config: {
    storeBank: StoreBank;
    defaultPersistance: PersistanceConfig;
}): {
    DefineDoc(docType: string, customizations?: Omit<Parameters<typeof DefineDocType>[0], `docType`>): {
        new (): {
            readonly docType: string;
            readonly _docStore: {
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
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            /** Override to run code just before an object is deleted. */
            onDelete(): void;
            /** Permanently deletes this object. */
            readonly deleteDoc: () => void;
        };
        readonly RootDocClass: typeof _ProtoDoc;
        readonly docType: string;
        readonly storeBank: {
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
                    };
                    stop(): Promise<void>;
                    pushCreate(params: {
                        base64String: string;
                        manualDocId?: string | undefined;
                    }): Promise<string>;
                    pullCreate: ((fileId: string) => void) & {
                        addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                    pushDelete: ((fileId: string) => Promise<void>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                        addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
                };
                stop(): Promise<void>;
                pushCreate(params: {
                    base64String: string;
                    manualDocId?: string | undefined;
                }): Promise<string>;
                pullCreate: ((fileId: string) => void) & {
                    addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                pushDelete: ((fileId: string) => Promise<void>) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                    addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
        getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
        ensureSyncHasStarted(): void;
        readonly _docStore: {
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
        };
        getAllDocs<T_1 extends typeof _ProtoDoc>(this: T_1): InstanceType<T_1>[];
        getHaveCompletedFirstSync<T_2 extends typeof _ProtoDoc>(this: T_2): boolean;
        _fromId<T_3 extends typeof _ProtoDoc>(this: T_3, docId: string): InstanceType<T_3>;
        create<T_4 extends typeof _ProtoDoc>(this: T_4, ...overrideProps: Parameters<(PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) extends infer T_5 ? T_5 extends (PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) ? T_5 extends true ? (prop?: ({ [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
    };
    defaultPersistanceConfig: PersistanceConfig;
    DocClass: {
        new (): {
            readonly docType: string;
            readonly _docStore: {
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
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            /** Override to run code just before an object is deleted. */
            onDelete(): void;
            /** Permanently deletes this object. */
            readonly deleteDoc: () => void;
        };
        readonly RootDocClass: typeof _ProtoDoc;
        readonly docType: string;
        readonly storeBank: {
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
                    };
                    stop(): Promise<void>;
                    pushCreate(params: {
                        base64String: string;
                        manualDocId?: string | undefined;
                    }): Promise<string>;
                    pullCreate: ((fileId: string) => void) & {
                        addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                    pushDelete: ((fileId: string) => Promise<void>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                        addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
                };
                stop(): Promise<void>;
                pushCreate(params: {
                    base64String: string;
                    manualDocId?: string | undefined;
                }): Promise<string>;
                pullCreate: ((fileId: string) => void) & {
                    addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                pushDelete: ((fileId: string) => Promise<void>) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                    addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
        getDocStoreConfig<This extends {
            new (): {
                readonly docType: string;
                readonly _docStore: {
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
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                /** Override to run code just before an object is deleted. */
                onDelete(): void;
                /** Permanently deletes this object. */
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: typeof _ProtoDoc;
            readonly docType: string;
            readonly storeBank: {
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
                        };
                        stop(): Promise<void>;
                        pushCreate(params: {
                            base64String: string;
                            manualDocId?: string | undefined;
                        }): Promise<string>;
                        pullCreate: ((fileId: string) => void) & {
                            addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                                    pauseAll: () => Promise<void>;
                                                                    resumeAll: () => Promise<void>;
                                                                } & {
                                                                    addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                        pushDelete: ((fileId: string) => Promise<void>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                                    pauseAll: () => Promise<void>;
                                                                    resumeAll: () => Promise<void>;
                                                                } & {
                                                                    addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                            addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                                    pauseAll: () => Promise<void>;
                                                                    resumeAll: () => Promise<void>;
                                                                } & {
                                                                    addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
                    };
                    stop(): Promise<void>;
                    pushCreate(params: {
                        base64String: string;
                        manualDocId?: string | undefined;
                    }): Promise<string>;
                    pullCreate: ((fileId: string) => void) & {
                        addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                    pushDelete: ((fileId: string) => Promise<void>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                        addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                                pauseAll: () => Promise<void>;
                                                                resumeAll: () => Promise<void>;
                                                            } & {
                                                                addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
            readonly _docStore: {
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
            };
            getAllDocs<T_1 extends typeof _ProtoDoc>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends typeof _ProtoDoc>(this: T_2): boolean;
            _fromId<T_3 extends typeof _ProtoDoc>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends typeof _ProtoDoc>(this: T_4, ...overrideProps: Parameters<(PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) extends infer T_6 ? T_6 extends (PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) ? T_6 extends true ? (prop?: ({ [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        }>(this: This): PersistanceConfig;
        ensureSyncHasStarted(): void;
        readonly _docStore: {
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
        };
        getAllDocs<T_1 extends typeof _ProtoDoc>(this: T_1): InstanceType<T_1>[];
        getHaveCompletedFirstSync<T_2 extends typeof _ProtoDoc>(this: T_2): boolean;
        _fromId<T_3 extends typeof _ProtoDoc>(this: T_3, docId: string): InstanceType<T_3>;
        create<T_4 extends typeof _ProtoDoc>(this: T_4, ...overrideProps: Parameters<(PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) extends infer T_7 ? T_7 extends (PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) ? T_7 extends true ? (prop?: ({ [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
    };
};
export declare function DefineDocType(customizations: {
    BaseClass: typeof _ProtoDoc;
    docType?: string;
    RootDocClass?: typeof _ProtoDoc;
    persistance?: Partial<PersistanceConfig>;
    storeBank?: StoreBank;
}): {
    new (): {
        readonly docType: string;
        readonly _docStore: {
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
        };
        readonly docId: string;
        readonly isDeleted: boolean;
        /** Override to run code just before an object is deleted. */
        onDelete(): void;
        /** Permanently deletes this object. */
        readonly deleteDoc: () => void;
    };
    readonly RootDocClass: typeof _ProtoDoc;
    readonly docType: string;
    readonly storeBank: {
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
                };
                stop(): Promise<void>;
                pushCreate(params: {
                    base64String: string;
                    manualDocId?: string | undefined;
                }): Promise<string>;
                pullCreate: ((fileId: string) => void) & {
                    addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
                pushDelete: ((fileId: string) => Promise<void>) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                    addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                            pauseAll: () => Promise<void>;
                                                            resumeAll: () => Promise<void>;
                                                        } & {
                                                            addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
            };
            stop(): Promise<void>;
            pushCreate(params: {
                base64String: string;
                manualDocId?: string | undefined;
            }): Promise<string>;
            pullCreate: ((fileId: string) => void) & {
                addStep: <NewOut>(func: (args: string | null) => Promise<NewOut>) => ((fileId: string) => Promise<NewOut>) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_1>(func: (args: NewOut) => Promise<NewOut_1>) => ((fileId: string) => Promise<NewOut_1>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_2>(func: (args: NewOut_1) => Promise<NewOut_2>) => ((fileId: string) => Promise<NewOut_2>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_3>(func: (args: NewOut_2) => Promise<NewOut_3>) => ((fileId: string) => Promise<NewOut_3>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_4>(func: (args: NewOut_3) => Promise<NewOut_4>) => ((fileId: string) => Promise<NewOut_4>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_5>(func: (args: NewOut_4) => Promise<NewOut_5>) => ((fileId: string) => Promise<NewOut_5>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_6>(func: (args: NewOut_5) => Promise<NewOut_6>) => ((fileId: string) => Promise<NewOut_6>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_7>(func: (args: NewOut_6) => Promise<NewOut_7>) => ((fileId: string) => Promise<NewOut_7>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_8>(func: (args: NewOut_7) => Promise<NewOut_8>) => ((fileId: string) => Promise<NewOut_8>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_9>(func: (args: NewOut_8) => Promise<NewOut_9>) => ((fileId: string) => Promise<NewOut_9>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_10>(func: (args: NewOut_9) => Promise<NewOut_10>) => ((fileId: string) => Promise<NewOut_10>) & {
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
            pushDelete: ((fileId: string) => Promise<void>) & {
                pauseAll: () => Promise<void>;
                resumeAll: () => Promise<void>;
            } & {
                addStep: <NewOut_11>(func: (args: void) => Promise<NewOut_11>) => ((fileId: string) => Promise<NewOut_11>) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_12>(func: (args: NewOut_11) => Promise<NewOut_12>) => ((fileId: string) => Promise<NewOut_12>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_13>(func: (args: NewOut_12) => Promise<NewOut_13>) => ((fileId: string) => Promise<NewOut_13>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_14>(func: (args: NewOut_13) => Promise<NewOut_14>) => ((fileId: string) => Promise<NewOut_14>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_15>(func: (args: NewOut_14) => Promise<NewOut_15>) => ((fileId: string) => Promise<NewOut_15>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_16>(func: (args: NewOut_15) => Promise<NewOut_16>) => ((fileId: string) => Promise<NewOut_16>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_17>(func: (args: NewOut_16) => Promise<NewOut_17>) => ((fileId: string) => Promise<NewOut_17>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_18>(func: (args: NewOut_17) => Promise<NewOut_18>) => ((fileId: string) => Promise<NewOut_18>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_19>(func: (args: NewOut_18) => Promise<NewOut_19>) => ((fileId: string) => Promise<NewOut_19>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_20>(func: (args: NewOut_19) => Promise<NewOut_20>) => ((fileId: string) => Promise<NewOut_20>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_21>(func: (args: NewOut_20) => Promise<NewOut_21>) => ((fileId: string) => Promise<NewOut_21>) & {
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
                addStep: <NewOut_22>(func: (args: void) => Promise<NewOut_22>) => ((fileId: string) => Promise<NewOut_22>) & {
                    pauseAll: () => Promise<void>;
                    resumeAll: () => Promise<void>;
                } & {
                    addStep: <NewOut_23>(func: (args: NewOut_22) => Promise<NewOut_23>) => ((fileId: string) => Promise<NewOut_23>) & {
                        pauseAll: () => Promise<void>;
                        resumeAll: () => Promise<void>;
                    } & {
                        addStep: <NewOut_24>(func: (args: NewOut_23) => Promise<NewOut_24>) => ((fileId: string) => Promise<NewOut_24>) & {
                            pauseAll: () => Promise<void>;
                            resumeAll: () => Promise<void>;
                        } & {
                            addStep: <NewOut_25>(func: (args: NewOut_24) => Promise<NewOut_25>) => ((fileId: string) => Promise<NewOut_25>) & {
                                pauseAll: () => Promise<void>;
                                resumeAll: () => Promise<void>;
                            } & {
                                addStep: <NewOut_26>(func: (args: NewOut_25) => Promise<NewOut_26>) => ((fileId: string) => Promise<NewOut_26>) & {
                                    pauseAll: () => Promise<void>;
                                    resumeAll: () => Promise<void>;
                                } & {
                                    addStep: <NewOut_27>(func: (args: NewOut_26) => Promise<NewOut_27>) => ((fileId: string) => Promise<NewOut_27>) & {
                                        pauseAll: () => Promise<void>;
                                        resumeAll: () => Promise<void>;
                                    } & {
                                        addStep: <NewOut_28>(func: (args: NewOut_27) => Promise<NewOut_28>) => ((fileId: string) => Promise<NewOut_28>) & {
                                            pauseAll: () => Promise<void>;
                                            resumeAll: () => Promise<void>;
                                        } & {
                                            addStep: <NewOut_29>(func: (args: NewOut_28) => Promise<NewOut_29>) => ((fileId: string) => Promise<NewOut_29>) & {
                                                pauseAll: () => Promise<void>;
                                                resumeAll: () => Promise<void>;
                                            } & {
                                                addStep: <NewOut_30>(func: (args: NewOut_29) => Promise<NewOut_30>) => ((fileId: string) => Promise<NewOut_30>) & {
                                                    pauseAll: () => Promise<void>;
                                                    resumeAll: () => Promise<void>;
                                                } & {
                                                    addStep: <NewOut_31>(func: (args: NewOut_30) => Promise<NewOut_31>) => ((fileId: string) => Promise<NewOut_31>) & {
                                                        pauseAll: () => Promise<void>;
                                                        resumeAll: () => Promise<void>;
                                                    } & {
                                                        addStep: <NewOut_32>(func: (args: NewOut_31) => Promise<NewOut_32>) => ((fileId: string) => Promise<NewOut_32>) & {
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
    getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
    ensureSyncHasStarted(): void;
    readonly _docStore: {
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
    };
    getAllDocs<T_1 extends typeof _ProtoDoc>(this: T_1): InstanceType<T_1>[];
    getHaveCompletedFirstSync<T_2 extends typeof _ProtoDoc>(this: T_2): boolean;
    _fromId<T_3 extends typeof _ProtoDoc>(this: T_3, docId: string): InstanceType<T_3>;
    create<T_4 extends typeof _ProtoDoc>(this: T_4, ...overrideProps: Parameters<(PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) extends infer T_5 ? T_5 extends (PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag> extends never ? true : false) ? T_5 extends true ? (prop?: ({ [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in PickFlagged<InstanceType<T_4>, typeof RequiredPropFlag>]: StripFlag<InstanceType<T_4>[K], typeof RequiredPropFlag>; } & Partial<{ [K_1 in PickFlagged<InstanceType<T_4>, typeof OptionalPropFlag>]: StripFlag<InstanceType<T_4>[K_1], typeof OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
};
declare class _ProtoDoc {
    static get RootDocClass(): typeof _ProtoDoc;
    /*** NOTE: This can be overridden to manually specify a type name. */
    static get docType(): string;
    get docType(): string;
    static getDocStoreConfig<This extends typeof _ProtoDoc>(this: This): PersistanceConfig;
    static ensureSyncHasStarted(): void;
    static get storeBank(): StoreBank;
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
    };
    get docId(): string;
    get isDeleted(): boolean;
    static getAllDocs<T extends typeof _ProtoDoc>(this: T): InstanceType<T>[];
    static getHaveCompletedFirstSync<T extends typeof _ProtoDoc>(this: T): boolean;
    static _fromId<T extends typeof _ProtoDoc>(this: T, docId: string): InstanceType<T>;
    static create<T extends typeof _ProtoDoc>(this: T, ...overrideProps: CreateParams<T>): InstanceType<T>;
    /** Override to run code just before an object is deleted. */
    onDelete(): void;
    /** Permanently deletes this object. */
    readonly deleteDoc: () => void;
}
type CreateParams<T extends DocClass> = CreateParamsFromInst<InstanceType<T>>;
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
type PropClass = typeof Boolean | typeof Number | typeof String | DocClass;
type PropType<T extends PropClass = PropClass> = T | [T, null];
type PropInst = boolean | number | string | DocInst | null;
type PropValue<T extends PropType | PropInst = PropType | PropInst> = T extends any[] ? PropValue<T[number]> : T extends DocClass ? InstanceType<T> : T extends typeof Boolean ? boolean : T extends typeof Number ? number : T extends typeof String ? string : T extends boolean ? boolean : T extends number ? number : T extends string ? string : null;
export declare function prop<FirstParam extends PropType | PropValue, SecondParam extends FirstParam extends PropType ? PropValue<FirstParam> | undefined : never>(firstParam: FirstParam, secondParam?: SecondParam, persistance?: Persistance): Flagged<PropValue<FirstParam>, FirstParam extends PropType ? undefined extends SecondParam ? RequiredPropFlag : OptionalPropFlag : OptionalPropFlag>;
export declare function formula<T>(compute: () => T, set?: (newVal: T) => void): T;
export type IsCustomProp = typeof IsCustomProp;
export declare const IsCustomProp: unique symbol;
export type CustomProp = {
    [IsCustomProp]: true;
    otherDocsToStartSyncing: DocClass[];
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
    init: (inst: DocInst, key: string) => void;
});
export {};
