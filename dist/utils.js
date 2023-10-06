"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalStore = exports.roundToString = exports.formatNumWithCommas = exports.NONEXISTENT = exports.PENDING = exports.INVALID = exports.MFS = exports.unad = exports.sleep = exports.exists = void 0;
function exists(x) {
    return x !== undefined && x !== null;
}
exports.exists = exists;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function unad(id) {
    const _unad = (...ids) => ({
        mfs_unad: new Set(ids),
        subtypeOf: (...others) => _unad(...ids, ...others.flatMap((o) => [...o.mfs_unad])),
    });
    return _unad(id);
}
exports.unad = unad;
exports.MFS = unad(`MFS`);
exports.INVALID = unad(`INVALID`).subtypeOf(exports.MFS);
exports.PENDING = unad(`PENDING`).subtypeOf(exports.INVALID);
exports.NONEXISTENT = unad(`NONEXISTENT`).subtypeOf(exports.INVALID);
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
