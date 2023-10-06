"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalStore = exports.roundToString = exports.formatNumWithCommas = exports.isValid = exports.isSameSym = exports.NONEXISTENT = exports.PENDING = exports.INVALID = exports.newSym = exports._symIdsKey = exports.sleep = exports.exists = void 0;
function exists(x) {
    return x !== undefined && x !== null;
}
exports.exists = exists;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
exports._symIdsKey = Symbol(`mfs_symIds`);
function newSym(symId, ...parents) {
    return {
        [exports._symIdsKey]: {
            [symId]: symId,
            ...parents.reduce((acc, parent) => ({ ...acc, ...parent[exports._symIdsKey] }), {}),
        },
    };
}
exports.newSym = newSym;
exports.INVALID = newSym(`INVALID`);
exports.PENDING = newSym(`PENDING`, exports.INVALID);
exports.NONEXISTENT = newSym(`NONEXISTENT`, exports.INVALID);
function isSameSym(x, y) {
    if (x === undefined || x === null)
        return false;
    if (x[exports._symIdsKey] === undefined)
        return false;
    return Object.keys(y[exports._symIdsKey]).every((key) => x[exports._symIdsKey][key] === true);
}
exports.isSameSym = isSameSym;
function isValid(x) {
    return x !== null && x !== undefined && !isSameSym(x, exports.INVALID);
}
exports.isValid = isValid;
function formatNumWithCommas(num, digits = 0) {
    const rounded = roundToString(num, digits);
    const [whole, decimal] = rounded.split(`.`);
    const wholeWithComma = whole.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
    return `${wholeWithComma}${exists(decimal) ? `.${decimal}` : ``}`;
}
exports.formatNumWithCommas = formatNumWithCommas;
function roundToString(num, digits = 0) {
    // Sometimes there are rouding errors. adding a 0.000..01 on the end seems to reduce these.
    const significantDecimals = num.toString().split(`.`)[1]?.length ?? 0;
    const acutalDigits = digits === `min` ? significantDecimals : digits;
    const numRoundingOffset = Math.pow(10, -significantDecimals - 1);
    const digitRoundOffset = Math.pow(10, -acutalDigits - 1);
    const roundingOffset = Math.min(numRoundingOffset, digitRoundOffset);
    return (num + roundingOffset).toFixed(acutalDigits);
}
exports.roundToString = roundToString;
function globalStore(storeName, defineStore) {
    const storePropName = `mx_global_${storeName}`;
    return function () {
        if (!exists(window[storePropName])) {
            window[storePropName] = defineStore();
        }
        return window[storePropName];
    };
}
exports.globalStore = globalStore;
