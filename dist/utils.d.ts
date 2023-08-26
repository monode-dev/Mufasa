export declare function exists<T>(x: T): x is NonNullable<T>;
export declare function orderDocs<T, K extends string | number | null | undefined>(list: Iterable<T>, getKey: (obj: T) => K, options?: {
    nullPosition?: `first` | `last`;
    direction?: `normal` | `reverse`;
}): T[];
export declare function formatNumWithCommas(num: number, digits?: number | `min`): string;
export declare function roundToString(num: number, digits?: number | `min`): string;
export type Unpromise<T> = T extends Promise<infer R> ? R : T;
export type DeepReadonly<T> = T extends Function ? T : T extends (infer R)[] ? ReadonlyArray<DeepReadonly<R>> : T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
export type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
export type Json = number | boolean | string | null | {
    [k: string]: Json;
} | Array<Json>;
export declare function globalStore<T>(storeName: string, defineStore: () => T): () => T;
