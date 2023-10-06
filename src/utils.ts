export function exists<T>(x: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export type Json = JsonPrimitive | JsonArray | JsonObject;
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = {
  [key: string]: Json;
};

export function formatNumWithCommas(
  num: number,
  digits: number | `min` = 0,
): string {
  const rounded = roundToString(num, digits);
  const [whole, decimal] = rounded.split(`.`);
  const wholeWithComma = whole.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  return `${wholeWithComma}${exists(decimal) ? `.${decimal}` : ``}`;
}

export function roundToString(num: number, digits: number | `min` = 0): string {
  // Sometimes there are rouding errors. adding a 0.000..01 on the end seems to reduce these.
  const significantDecimals = num.toString().split(`.`)[1]?.length ?? 0;
  const acutalDigits = digits === `min` ? significantDecimals : digits;
  const numRoundingOffset = Math.pow(10, -significantDecimals - 1);
  const digitRoundOffset = Math.pow(10, -acutalDigits - 1);
  const roundingOffset = Math.min(numRoundingOffset, digitRoundOffset);
  return (num + roundingOffset).toFixed(acutalDigits);
}

export type Unpromise<T> = T extends Promise<infer R> ? R : T;

export type DeepReadonly<T> = T extends Function
  ? T
  : T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export function globalStore<T>(
  storeName: string,
  defineStore: () => T,
): () => T {
  const storePropName = `mx_global_${storeName}`;
  return function () {
    if (!exists((window as any)[storePropName])) {
      (window as any)[storePropName] = defineStore();
    }
    return (window as any)[storePropName];
  };
}
