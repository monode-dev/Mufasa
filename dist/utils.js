"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalStore = exports.roundToString = exports.formatNumWithCommas = exports.orderDocs = exports.exists = void 0;
function exists(x) {
    return x !== undefined && x !== null;
}
exports.exists = exists;
function orderDocs(list, getKey, options) {
    return [...list].sort((a, b) => {
        const direction = options?.direction ?? `normal`;
        const nullPosition = options?.nullPosition ?? `first`;
        const keyA = getKey(direction === `normal` ? a : b);
        const keyB = getKey(direction === `normal` ? b : a);
        if (!exists(keyA)) {
            return nullPosition === `first` ? -1 : 1;
        }
        else if (!exists(keyB)) {
            return nullPosition === `first` ? 1 : -1;
        }
        else {
            if (typeof keyA === `number` && typeof keyB === `number`) {
                return keyA - keyB;
            }
            else {
                return keyA.toString().localeCompare(keyB.toString());
            }
        }
    });
}
exports.orderDocs = orderDocs;
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
