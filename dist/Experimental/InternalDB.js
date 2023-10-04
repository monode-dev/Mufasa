"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeInternalDb = void 0;
const utils_1 = require("../utils");
const mfsInternalDb = (() => {
})();
const internalDBs = {};
function initializeInternalDb(dbName, options) {
    if (!(0, utils_1.exists)(internalDBs[dbName])) {
        const collections = {};
        internalDBs[dbName] = {
            updateDoc(props) {
                if (!(0, utils_1.exists)(collections[props.collectionName])) {
                    collections[props.collectionName] = {};
                }
                if (!(0, utils_1.exists)(collections[props.collectionName][props.docId])) {
                    collections[props.collectionName][props.docId] = {};
                }
                const doc = collections[props.collectionName][props.docId];
                for (const key in props.updates) {
                    if (!(0, utils_1.exists)(doc[key])) {
                        doc[key] = options.createReactiveValue(props.updates[key]);
                    }
                    else {
                        doc[key].set(props.updates[key]);
                    }
                }
            },
            deleteDoc(props) {
                delete collections[props.collectionName][props.docId];
            },
            getPropValue(props) {
                return collections[props.collectionName][props.docId][props.propName];
            },
            getDocsWhere(props) {
                // TODO: Index by all keys
                return Object.values(collections[props.collectionName]).filter((doc) => {
                    for (const key in props.where) {
                        if (doc[key].get() !== props.where[key]) {
                            return false;
                        }
                    }
                    return true;
                });
            },
        };
    }
    return internalDBs[dbName];
}
exports.initializeInternalDb = initializeInternalDb;
