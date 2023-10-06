export declare function exists<T>(x: T): x is NonNullable<T>;
export declare function sleep(ms: number): Promise<unknown>;
export type Unad<T extends string> = {
    mfs_unad: Set<T>;
};
export declare function unad<T extends string>(id: T): {
    mfs_unad: Set<T>;
    subtypeOf: <U extends string>(...others: Unad<U>[]) => {
        mfs_unad: Set<T | U>;
        subtypeOf: <U_1 extends string>(...others: Unad<U_1>[]) => {
            mfs_unad: Set<T | U | U_1>;
            subtypeOf: <U_2 extends string>(...others: Unad<U_2>[]) => {
                mfs_unad: Set<T | U | U_1 | U_2>;
                subtypeOf: <U_3 extends string>(...others: Unad<U_3>[]) => {
                    mfs_unad: Set<T | U | U_1 | U_2 | U_3>;
                    subtypeOf: <U_4 extends string>(...others: Unad<U_4>[]) => {
                        mfs_unad: Set<T | U | U_1 | U_2 | U_3 | U_4>;
                        subtypeOf: <U_5 extends string>(...others: Unad<U_5>[]) => {
                            mfs_unad: Set<T | U | U_1 | U_2 | U_3 | U_4 | U_5>;
                            subtypeOf: <U_6 extends string>(...others: Unad<U_6>[]) => {
                                mfs_unad: Set<T | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6>;
                                subtypeOf: <U_7 extends string>(...others: Unad<U_7>[]) => {
                                    mfs_unad: Set<T | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7>;
                                    subtypeOf: <U_8 extends string>(...others: Unad<U_8>[]) => {
                                        mfs_unad: Set<T | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8>;
                                        subtypeOf: <U_9 extends string>(...others: Unad<U_9>[]) => {
                                            mfs_unad: Set<T | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8 | U_9>;
                                            subtypeOf: <U_10 extends string>(...others: Unad<U_10>[]) => any;
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
export declare const MFS: {
    mfs_unad: Set<"MFS">;
    subtypeOf: <U extends string>(...others: Unad<U>[]) => {
        mfs_unad: Set<"MFS" | U>;
        subtypeOf: <U_1 extends string>(...others: Unad<U_1>[]) => {
            mfs_unad: Set<"MFS" | U | U_1>;
            subtypeOf: <U_2 extends string>(...others: Unad<U_2>[]) => {
                mfs_unad: Set<"MFS" | U | U_1 | U_2>;
                subtypeOf: <U_3 extends string>(...others: Unad<U_3>[]) => {
                    mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3>;
                    subtypeOf: <U_4 extends string>(...others: Unad<U_4>[]) => {
                        mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3 | U_4>;
                        subtypeOf: <U_5 extends string>(...others: Unad<U_5>[]) => {
                            mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3 | U_4 | U_5>;
                            subtypeOf: <U_6 extends string>(...others: Unad<U_6>[]) => {
                                mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6>;
                                subtypeOf: <U_7 extends string>(...others: Unad<U_7>[]) => {
                                    mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7>;
                                    subtypeOf: <U_8 extends string>(...others: Unad<U_8>[]) => {
                                        mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8>;
                                        subtypeOf: <U_9 extends string>(...others: Unad<U_9>[]) => {
                                            mfs_unad: Set<"MFS" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8 | U_9>;
                                            subtypeOf: <U_10 extends string>(...others: Unad<U_10>[]) => any;
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
export declare const INVALID: {
    mfs_unad: Set<"MFS" | "INVALID">;
    subtypeOf: <U extends string>(...others: Unad<U>[]) => {
        mfs_unad: Set<"MFS" | "INVALID" | U>;
        subtypeOf: <U_1 extends string>(...others: Unad<U_1>[]) => {
            mfs_unad: Set<"MFS" | "INVALID" | U | U_1>;
            subtypeOf: <U_2 extends string>(...others: Unad<U_2>[]) => {
                mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2>;
                subtypeOf: <U_3 extends string>(...others: Unad<U_3>[]) => {
                    mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3>;
                    subtypeOf: <U_4 extends string>(...others: Unad<U_4>[]) => {
                        mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3 | U_4>;
                        subtypeOf: <U_5 extends string>(...others: Unad<U_5>[]) => {
                            mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3 | U_4 | U_5>;
                            subtypeOf: <U_6 extends string>(...others: Unad<U_6>[]) => {
                                mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6>;
                                subtypeOf: <U_7 extends string>(...others: Unad<U_7>[]) => {
                                    mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7>;
                                    subtypeOf: <U_8 extends string>(...others: Unad<U_8>[]) => {
                                        mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8>;
                                        subtypeOf: <U_9 extends string>(...others: Unad<U_9>[]) => {
                                            mfs_unad: Set<"MFS" | "INVALID" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8 | U_9>;
                                            subtypeOf: <U_10 extends string>(...others: Unad<U_10>[]) => any;
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
export declare const PENDING: {
    mfs_unad: Set<"MFS" | "INVALID" | "PENDING">;
    subtypeOf: <U extends string>(...others: Unad<U>[]) => {
        mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U>;
        subtypeOf: <U_1 extends string>(...others: Unad<U_1>[]) => {
            mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1>;
            subtypeOf: <U_2 extends string>(...others: Unad<U_2>[]) => {
                mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2>;
                subtypeOf: <U_3 extends string>(...others: Unad<U_3>[]) => {
                    mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3>;
                    subtypeOf: <U_4 extends string>(...others: Unad<U_4>[]) => {
                        mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3 | U_4>;
                        subtypeOf: <U_5 extends string>(...others: Unad<U_5>[]) => {
                            mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3 | U_4 | U_5>;
                            subtypeOf: <U_6 extends string>(...others: Unad<U_6>[]) => {
                                mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6>;
                                subtypeOf: <U_7 extends string>(...others: Unad<U_7>[]) => {
                                    mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7>;
                                    subtypeOf: <U_8 extends string>(...others: Unad<U_8>[]) => {
                                        mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8>;
                                        subtypeOf: <U_9 extends string>(...others: Unad<U_9>[]) => {
                                            mfs_unad: Set<"MFS" | "INVALID" | "PENDING" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8 | U_9>;
                                            subtypeOf: <U_10 extends string>(...others: Unad<U_10>[]) => any;
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
export declare const NONEXISTENT: {
    mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT">;
    subtypeOf: <U extends string>(...others: Unad<U>[]) => {
        mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U>;
        subtypeOf: <U_1 extends string>(...others: Unad<U_1>[]) => {
            mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1>;
            subtypeOf: <U_2 extends string>(...others: Unad<U_2>[]) => {
                mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2>;
                subtypeOf: <U_3 extends string>(...others: Unad<U_3>[]) => {
                    mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3>;
                    subtypeOf: <U_4 extends string>(...others: Unad<U_4>[]) => {
                        mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3 | U_4>;
                        subtypeOf: <U_5 extends string>(...others: Unad<U_5>[]) => {
                            mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3 | U_4 | U_5>;
                            subtypeOf: <U_6 extends string>(...others: Unad<U_6>[]) => {
                                mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6>;
                                subtypeOf: <U_7 extends string>(...others: Unad<U_7>[]) => {
                                    mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7>;
                                    subtypeOf: <U_8 extends string>(...others: Unad<U_8>[]) => {
                                        mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8>;
                                        subtypeOf: <U_9 extends string>(...others: Unad<U_9>[]) => {
                                            mfs_unad: Set<"MFS" | "INVALID" | "NONEXISTENT" | U | U_1 | U_2 | U_3 | U_4 | U_5 | U_6 | U_7 | U_8 | U_9>;
                                            subtypeOf: <U_10 extends string>(...others: Unad<U_10>[]) => any;
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
export type Json = JsonPrimitive | JsonArray | JsonObject;
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = {
    [key: string]: Json;
};
export declare function formatNumWithCommas(num: number, digits?: number | `min`): string;
export declare function roundToString(num: number, digits?: number | `min`): string;
export type Unpromise<T> = T extends Promise<infer R> ? R : T;
export type DeepReadonly<T> = T extends Function ? T : T extends (infer R)[] ? ReadonlyArray<DeepReadonly<R>> : T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
export type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
export declare function globalStore<T>(storeName: string, defineStore: () => T): () => T;
