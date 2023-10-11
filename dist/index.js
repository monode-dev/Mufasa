"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = exports.listOf = exports.refTo = exports.prim = void 0;
__exportStar(require("./Implement"), exports);
__exportStar(require("./FirestoreSync"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./Experimental/TreeApi"), exports);
__exportStar(require("./Reactivity"), exports);
/** Defines a prop of the specified primitive type. */
function prim(
/** TODO: We might consider using Number, String, or Boolean as the first parameter
 * instead. */
defaultValue) {
    return {
        format: `prim`,
        refTypeName: undefined,
        primType: {},
        isList: false,
        isDefining: false,
        defaultValue: defaultValue,
    };
}
exports.prim = prim;
/** Defines a prop that references a doc. */
function refTo(table, defaultValue = null) {
    return {
        format: `one`,
        refTypeName: table,
        primType: undefined,
        isList: false,
        isDefining: false,
        defaultValue: defaultValue,
    };
}
exports.refTo = refTo;
/** Defines a list of docs that point back to this doc. */
function listOf(table) {
    return {
        format: `many`,
        refTypeName: table,
        primType: undefined,
        isList: true,
        isDefining: true,
        defaultValue: undefined,
    };
}
exports.listOf = listOf;
/** Defines a prop that references a file. */
function file(defaultValue = null) {
    return {
        format: `file`,
        refTypeName: undefined,
        primType: undefined,
        isList: false,
        isDefining: false,
        defaultValue: defaultValue,
    };
}
exports.file = file;
