export declare function exists<T>(x: T): x is NonNullable<T>;
export declare function sleep(ms: number): Promise<unknown>;
export declare const _symIdsKey: unique symbol;
export type Sym<T extends string> = {
    [_symIdsKey]: {
        [Key in T]: true;
    };
};
export declare function newSym<T extends string, U extends string = T>(symId: T, ...parents: Sym<U>[]): Sym<T | U>;
export type INVALID = typeof INVALID;
export declare const INVALID: Sym<"INVALID">;
export type PENDING = typeof PENDING;
export declare const PENDING: Sym<"INVALID" | "PENDING">;
export type NONEXISTENT = typeof NONEXISTENT;
export declare const NONEXISTENT: Sym<"INVALID" | "NONEXISTENT">;
export declare function isSameSym<T extends string>(x: any, y: Sym<T>): x is Sym<T>;
export type Valid<T> = T extends null | undefined | INVALID ? never : T;
export declare function isValid<T>(x: T): x is Valid<T>;
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
