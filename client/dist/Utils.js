export function doNow(func) {
    return func();
}
// SECTION: Validity
export const _symIdsKey = Symbol(`mfs_symIds`);
export function newSym(symId, ...parents) {
    return {
        [_symIdsKey]: {
            [symId]: symId,
            ...parents.reduce((acc, parent) => ({ ...acc, ...parent[_symIdsKey] }), {}),
        },
    };
}
export const INVALID = newSym(`INVALID`);
export const PENDING = newSym(`PENDING`, INVALID);
export const NONEXISTENT = newSym(`NONEXISTENT`, INVALID);
export function isSameSym(x, y) {
    if (x === undefined || x === null)
        return false;
    if (x[_symIdsKey] === undefined)
        return false;
    return Object.keys(y[_symIdsKey]).every((key) => x[_symIdsKey][key] === true);
}
export function isValid(x) {
    return x !== null && x !== undefined && !isSameSym(x, INVALID);
}
// SECTION: Typed Object Utils
export function listObjKeys(obj) {
    return Object.keys(obj);
}
export function listObjValues(obj) {
    return Object.values(obj);
}
export function listObjEntries(obj) {
    return Object.entries(obj);
}
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
