import { Json } from "./utils";
import { MfsFileSystem } from "./Implement";
type _RunStage<P extends _StageProps, R extends _StageReturn> = (props: P) => Promise<R>;
type _StageProps = Json;
type _StageReturn = _StageProps | void | QUIT_PERSISTED_FUNCTION;
export type QUIT_PERSISTED_FUNCTION = typeof QUIT_PERSISTED_FUNCTION;
export declare const QUIT_PERSISTED_FUNCTION = "QUIT_PERSISTED_FUNCTION";
export type FunctionState = {
    functionTypeName: string;
    stageIndex: number;
    props: any;
};
export type PersistedFunctionManager = ReturnType<typeof initializePersistedFunctionManager>;
export declare function initializePersistedFunctionManager(managerId: string, fileSystem: MfsFileSystem): {
    createPersistedFunction<P extends Json, R extends _StageReturn>(functionTypeName: string, runStage: _RunStage<P, R>): ((props: Exclude<P, string>) => void) & {
        addStage: <T extends _StageReturn>(runStage: (props: Exclude<R, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T>) => ((props: Exclude<P, string>) => void) & {
            addStage: <T_1 extends _StageReturn>(runStage: (props: Exclude<T, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_1>) => ((props: Exclude<P, string>) => void) & {
                addStage: <T_2 extends _StageReturn>(runStage: (props: Exclude<T_1, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_2>) => ((props: Exclude<P, string>) => void) & {
                    addStage: <T_3 extends _StageReturn>(runStage: (props: Exclude<T_2, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_3>) => ((props: Exclude<P, string>) => void) & {
                        addStage: <T_4 extends _StageReturn>(runStage: (props: Exclude<T_3, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_4>) => ((props: Exclude<P, string>) => void) & {
                            addStage: <T_5 extends _StageReturn>(runStage: (props: Exclude<T_4, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_5>) => ((props: Exclude<P, string>) => void) & {
                                addStage: <T_6 extends _StageReturn>(runStage: (props: Exclude<T_5, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_6>) => ((props: Exclude<P, string>) => void) & {
                                    addStage: <T_7 extends _StageReturn>(runStage: (props: Exclude<T_6, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_7>) => ((props: Exclude<P, string>) => void) & {
                                        addStage: <T_8 extends _StageReturn>(runStage: (props: Exclude<T_7, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_8>) => ((props: Exclude<P, string>) => void) & {
                                            addStage: <T_9 extends _StageReturn>(runStage: (props: Exclude<T_8, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_9>) => ((props: Exclude<P, string>) => void) & {
                                                addStage: <T_10 extends _StageReturn>(runStage: (props: Exclude<T_9, void | "QUIT_PERSISTED_FUNCTION">) => Promise<T_10>) => ((props: Exclude<P, string>) => void) & any;
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
    /**  */
    findFunctionData(where: (state: FunctionState) => boolean): any;
};
export {};
