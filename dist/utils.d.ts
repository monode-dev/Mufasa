export declare function exists<T>(x: T): x is NonNullable<T>;
export declare function sleep(ms: number): Promise<unknown>;
export declare class Unad {
    get unadId(): string;
    static create<T extends typeof Unad>(this: T): InstanceType<T>;
}
export declare class Invalid extends Unad {
}
export declare class Pending extends Invalid {
}
export declare class Nonexistent extends Invalid {
}
export type Valid<T> = T extends null | undefined | Invalid ? never : T;
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
