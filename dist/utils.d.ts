export declare function doNow<T>(func: () => T): T;
export type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
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
export declare function listObjKeys<T extends {}>(obj: T): (keyof T)[];
export declare function listObjValues<T extends {}>(obj: T): T[keyof T][];
export declare function listObjEntries<T extends {}>(obj: T): [keyof T, T[keyof T]][];
export type PickFlagged<T, FlagSym extends symbol> = {
    [K in keyof T]: IsFlagged<T[K], FlagSym> extends true ? K : never;
}[keyof T];
export type IsFlagged<T, FlagSym extends symbol> = true extends (T extends Flagged<infer U, FlagSym> ? (U extends T ? false : true) : false) ? true : false;
export type Flagged<T, FlagSym extends symbol> = T | (T & Flag<FlagSym>);
export type StripFlag<T, FlagSym extends symbol> = T extends Flagged<infer U, FlagSym> ? U : T;
export type Flag<FlagSym extends symbol> = {
    [K in FlagSym]: FlagSym;
};
