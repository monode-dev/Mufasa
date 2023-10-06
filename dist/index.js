"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = exports.listOf = exports.refTo = exports.prim = exports.getUser = exports.globalStore = exports.defineAppDataStructure = void 0;
const Implement_1 = require("./Implement");
const utils_1 = require("./utils");
const FirestoreSync_1 = require("./FirestoreSync");
exports.defineAppDataStructure = Implement_1._defineAppDataStructure;
exports.globalStore = utils_1.globalStore;
exports.getUser = FirestoreSync_1.getUser;
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
