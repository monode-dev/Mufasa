import { DocClass } from "./Doc.js";
import { PersistanceConfig, Persistance, StoreBank } from "./DocStore.js";
export declare function initializeSyncedFileClass(config: {
    Doc: DocClass;
    storeBank: StoreBank;
}): {
    DefineFile(docType: string, customizations?: Omit<{
        BaseClass: {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_5 ? T_5 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_5 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        };
        docType?: string | undefined;
        RootDocClass?: {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_6 ? T_6 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_6 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        } | undefined;
        persistance?: Partial<PersistanceConfig> | undefined;
        storeBank?: {
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            } : {
                docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
        } | undefined;
    }, "docType"> | undefined): {
        new (): {
            readonly docType: string;
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            readonly docId: string;
            readonly isDeleted: boolean;
            onDelete(): void;
            readonly deleteDoc: () => void;
        };
        readonly RootDocClass: {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_7 ? T_7 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_7 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        };
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            } : {
                docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
        getDocStoreConfig<This_1 extends any>(this: This_1): PersistanceConfig;
        ensureSyncHasStarted(): void;
        readonly _docStore: {
            readonly loadedFromLocalStorage: Promise<void>;
            readonly stop: () => Promise<void>;
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
            readonly getHaveCompletedFirstSync: () => boolean;
        };
        getAllDocs<T_1 extends {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_8 ? T_8 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_8 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        }>(this: T_1): InstanceType<T_1>[];
        getHaveCompletedFirstSync<T_2 extends {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_9 ? T_9 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_9 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        }>(this: T_2): boolean;
        _fromId<T_3 extends {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_10 ? T_10 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_10 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        }>(this: T_3, docId: string): InstanceType<T_3>;
        create<T_4 extends {
            new (): {
                readonly docType: string;
                readonly _docStore: {
                    readonly loadedFromLocalStorage: Promise<void>;
                    readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                };
                readonly docId: string;
                readonly isDeleted: boolean;
                onDelete(): void;
                readonly deleteDoc: () => void;
            };
            readonly RootDocClass: any;
            readonly docType: string;
            getDocStoreConfig<This extends any>(this: This): PersistanceConfig;
            ensureSyncHasStarted(): void;
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
                        readonly getHaveCompletedFirstSync: () => boolean;
                    } : {
                        docStore: {
                            readonly loadedFromLocalStorage: Promise<void>;
                            readonly stop: () => Promise<void>;
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
                    readonly getHaveCompletedFirstSync: () => boolean;
                } : {
                    docStore: {
                        readonly loadedFromLocalStorage: Promise<void>;
                        readonly stop: () => Promise<void>;
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
            readonly _docStore: {
                readonly loadedFromLocalStorage: Promise<void>;
                readonly stop: () => Promise<void>;
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
                readonly getHaveCompletedFirstSync: () => boolean;
            };
            getAllDocs<T_1 extends any>(this: T_1): InstanceType<T_1>[];
            getHaveCompletedFirstSync<T_2 extends any>(this: T_2): boolean;
            _fromId<T_3 extends any>(this: T_3, docId: string): InstanceType<T_3>;
            create<T_4 extends any>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_11 ? T_11 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_11 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
        }>(this: T_4, ...overrideProps: Parameters<(import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) extends infer T_12 ? T_12 extends (import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag> extends never ? true : false) ? T_12 extends true ? (prop?: ({ [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) | undefined) => void : (prop: { [K in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").RequiredPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K], typeof import("./Doc.js").RequiredPropFlag>; } & Partial<{ [K_1 in import("./Utils.js").PickFlagged<InstanceType<T_4>, typeof import("./Doc.js").OptionalPropFlag>]: import("./Utils.js").StripFlag<InstanceType<T_4>[K_1], typeof import("./Doc.js").OptionalPropFlag>; }>) => void : never : never>): InstanceType<T_4>;
    };
};
