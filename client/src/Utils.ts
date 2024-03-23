export function doNow<T>(func: () => T): T {
  return func();
}

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// SECTION: Validity
export const _symIdsKey = Symbol(`mfs_symIds`);
export type Sym<T extends string> = {
  [_symIdsKey]: { [Key in T]: true };
};
export function newSym<T extends string, U extends string = T>(
  symId: T,
  ...parents: Sym<U>[]
) {
  return {
    [_symIdsKey]: {
      [symId]: symId,
      ...parents.reduce(
        (acc, parent) => ({ ...acc, ...parent[_symIdsKey] }),
        {} as { [Key in U]: true },
      ),
    },
  } as Sym<T | U>;
}
export type INVALID = typeof INVALID;
export const INVALID = newSym(`INVALID`);
export type PENDING = typeof PENDING;
export const PENDING = newSym(`PENDING`, INVALID);
export type NONEXISTENT = typeof NONEXISTENT;
export const NONEXISTENT = newSym(`NONEXISTENT`, INVALID);
export function isSameSym<T extends string>(x: any, y: Sym<T>): x is Sym<T> {
  if (x === undefined || x === null) return false;
  if (x[_symIdsKey] === undefined) return false;
  return Object.keys(y[_symIdsKey]).every((key) => x[_symIdsKey][key] === true);
}
export type Valid<T> = T extends null | undefined | INVALID ? never : T;
export function isValid<T>(x: T): x is Valid<T> {
  return x !== null && x !== undefined && !isSameSym(x, INVALID);
}

// SECTION: Typed Object Utils
export function listObjKeys<T extends {}>(obj: T): (keyof T)[] {
  return Object.keys(obj) as any;
}
export function listObjValues<T extends {}>(obj: T): T[keyof T][] {
  return Object.values(obj) as any;
}
export function listObjEntries<T extends {}>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as any;
}

// SECTION: Flagging
export type PickFlagged<T, FlagSym extends symbol> = {
  [K in keyof T]: IsFlagged<T[K], FlagSym> extends true ? K : never;
}[keyof T];
export type IsFlagged<T, FlagSym extends symbol> = true extends (
  T extends Flagged<infer U, FlagSym> ? (U extends T ? false : true) : false
)
  ? true
  : false;
export type Flagged<T, FlagSym extends symbol> = T | (T & Flag<FlagSym>);
export type StripFlag<T, FlagSym extends symbol> = T extends Flagged<
  infer U,
  FlagSym
>
  ? U
  : T;
export type Flag<FlagSym extends symbol> = {
  [K in FlagSym]: FlagSym;
};
// export function makeFlagger() {
//   const flagSym = Symbol();
//   return {
//     flag<T>(toFlag: T): Flagged<T, typeof flagSym> {
//       (toFlag as any)[flagSym] = flagSym;
//       return toFlag as any;
//     },
//     isFlagged<T>(
//       toCheck: Flagged<T, typeof flagSym>,
//     ): toCheck is Flagged<T, typeof flagSym> {
//       return (toCheck as any)[flagSym] === flagSym;
//     },
//     flagSym,
//   } as const;
// }
