import { Json, JsonObject } from "./utils";
import { FirebaseOptions } from "firebase/app";
import { PersistedFunctionManager } from "./PersistedFunctionManager";
import { MfsFileSystem } from "./Implement";
export declare const CHANGE_DATE_KEY = "mfs_changeDate";
export declare function initializeFirestoreSync(firebaseOptions: FirebaseOptions, isProduction: boolean, persistedFunctionManager: PersistedFunctionManager, fileSystem: MfsFileSystem): {
    uploadDocChange: ((props: {
        shouldOverwrite: boolean;
        docId: string;
        data: {
            [key: string]: Json;
        };
    }) => void) & {
        addStage: <T extends void | Json>(runStage: (props: never) => Promise<T>) => ((props: {
            shouldOverwrite: boolean;
            docId: string;
            data: {
                [key: string]: Json;
            };
        }) => void) & {
            addStage: <T_1 extends void | Json>(runStage: (props: Exclude<T, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_1>) => ((props: {
                shouldOverwrite: boolean;
                docId: string;
                data: {
                    [key: string]: Json;
                };
            }) => void) & {
                addStage: <T_2 extends void | Json>(runStage: (props: Exclude<T_1, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_2>) => ((props: {
                    shouldOverwrite: boolean;
                    docId: string;
                    data: {
                        [key: string]: Json;
                    };
                }) => void) & {
                    addStage: <T_3 extends void | Json>(runStage: (props: Exclude<T_2, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_3>) => ((props: {
                        shouldOverwrite: boolean;
                        docId: string;
                        data: {
                            [key: string]: Json;
                        };
                    }) => void) & {
                        addStage: <T_4 extends void | Json>(runStage: (props: Exclude<T_3, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_4>) => ((props: {
                            shouldOverwrite: boolean;
                            docId: string;
                            data: {
                                [key: string]: Json;
                            };
                        }) => void) & {
                            addStage: <T_5 extends void | Json>(runStage: (props: Exclude<T_4, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_5>) => ((props: {
                                shouldOverwrite: boolean;
                                docId: string;
                                data: {
                                    [key: string]: Json;
                                };
                            }) => void) & {
                                addStage: <T_6 extends void | Json>(runStage: (props: Exclude<T_5, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_6>) => ((props: {
                                    shouldOverwrite: boolean;
                                    docId: string;
                                    data: {
                                        [key: string]: Json;
                                    };
                                }) => void) & {
                                    addStage: <T_7 extends void | Json>(runStage: (props: Exclude<T_6, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_7>) => ((props: {
                                        shouldOverwrite: boolean;
                                        docId: string;
                                        data: {
                                            [key: string]: Json;
                                        };
                                    }) => void) & {
                                        addStage: <T_8 extends void | Json>(runStage: (props: Exclude<T_7, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_8>) => ((props: {
                                            shouldOverwrite: boolean;
                                            docId: string;
                                            data: {
                                                [key: string]: Json;
                                            };
                                        }) => void) & {
                                            addStage: <T_9 extends void | Json>(runStage: (props: Exclude<T_8, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_9>) => ((props: {
                                                shouldOverwrite: boolean;
                                                docId: string;
                                                data: {
                                                    [key: string]: Json;
                                                };
                                            }) => void) & {
                                                addStage: <T_10 extends void | Json>(runStage: (props: Exclude<T_9, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_10>) => ((props: {
                                                    shouldOverwrite: boolean;
                                                    docId: string;
                                                    data: {
                                                        [key: string]: Json;
                                                    };
                                                }) => void) & any;
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
    uploadFileChange(props: {
        docId: string;
        propName: string;
        newFileId: string;
        oldFileId?: string;
        notifyUploadStarted: () => void;
    }): void;
    deleteFile: ((props: {
        fileId: string;
    }) => void) & {
        addStage: <T_11 extends void | Json>(runStage: (props: never) => Promise<T_11>) => ((props: {
            fileId: string;
        }) => void) & {
            addStage: <T_12 extends void | Json>(runStage: (props: Exclude<T_11, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_12>) => ((props: {
                fileId: string;
            }) => void) & {
                addStage: <T_13 extends void | Json>(runStage: (props: Exclude<T_12, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_13>) => ((props: {
                    fileId: string;
                }) => void) & {
                    addStage: <T_14 extends void | Json>(runStage: (props: Exclude<T_13, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_14>) => ((props: {
                        fileId: string;
                    }) => void) & {
                        addStage: <T_15 extends void | Json>(runStage: (props: Exclude<T_14, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_15>) => ((props: {
                            fileId: string;
                        }) => void) & {
                            addStage: <T_16 extends void | Json>(runStage: (props: Exclude<T_15, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_16>) => ((props: {
                                fileId: string;
                            }) => void) & {
                                addStage: <T_17 extends void | Json>(runStage: (props: Exclude<T_16, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_17>) => ((props: {
                                    fileId: string;
                                }) => void) & {
                                    addStage: <T_18 extends void | Json>(runStage: (props: Exclude<T_17, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_18>) => ((props: {
                                        fileId: string;
                                    }) => void) & {
                                        addStage: <T_19 extends void | Json>(runStage: (props: Exclude<T_18, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_19>) => ((props: {
                                            fileId: string;
                                        }) => void) & {
                                            addStage: <T_20 extends void | Json>(runStage: (props: Exclude<T_19, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_20>) => ((props: {
                                                fileId: string;
                                            }) => void) & {
                                                addStage: <T_21 extends void | Json>(runStage: (props: Exclude<T_20, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_21>) => ((props: {
                                                    fileId: string;
                                                }) => void) & any;
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
    isFileUploading(props: {
        docId: string;
        propName: string;
        fileId: string;
    }): boolean;
    downloadFile(fileId: string): Promise<void>;
    watchCollection(collectionName: string, handleUpdate: (id: string, data: JsonObject) => void): Promise<void>;
};
