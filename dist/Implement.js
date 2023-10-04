"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._defineAppDataStructure = exports.docProx = void 0;
const utils_1 = require("./utils");
const LocalCache_1 = require("./LocalCache");
const PersistedFunctionManager_1 = require("./PersistedFunctionManager");
let _computed;
let _signal;
let _isSignal;
let _watchEffect;
// Firebase
// let firestoreDb: Firestore;
let isProduction = false;
function getCollectionName(typeName) {
    // return `${isProduction ? `Prod` : `Dev`}_${typeName}`;
    return isProduction ? typeName : `Dev_${typeName}`;
}
function docProx(docId, typeName, objFormats, localCache) {
    let proxy = {
        get _id() {
            return docId ?? undefined;
        },
        get isLoaded() {
            return localCache.checkExists(typeName, docId);
        },
        get isDeleted() {
            return (localCache.getPropValue(typeName, proxy._id ?? ``, LocalCache_1.DELETED_KEY) ??
                false);
        },
        getPropFilePath(propName) {
            if (!(0, utils_1.exists)(proxy._id))
                return null;
            return localCache.getFilePath(typeName, proxy._id, propName);
        },
        async deleteDoc() {
            if ((0, utils_1.exists)(docId)) {
                // Delete all sub docs
                for (const format of Object.values(objFormats[typeName])) {
                    if (format.format === `many`) {
                        const children = [
                            ...localCache.getChildDocs(format.refTypeName, docId),
                        ];
                        children.forEach((childId) => docProx(childId, format.refTypeName, objFormats, localCache).deleteDoc());
                    }
                }
                await localCache.deleteDoc(typeName, docId);
            }
        },
    };
    // Add getters and setters for each property
    for (let [propKey, format] of Object.entries(objFormats[typeName])) {
        if (format.format === `one`) {
            Object.defineProperty(proxy, propKey, {
                get: function () {
                    return docProx(localCache.getPropValue(typeName, proxy._id ?? ``, propKey), format.refTypeName, objFormats, localCache);
                },
                set: function (newValue) {
                    (async () => {
                        const actualDocPath = proxy._id;
                        if ((0, utils_1.exists)(actualDocPath) && proxy._id !== newValue?._id) {
                            localCache.setPropValue(typeName, actualDocPath, propKey, newValue?._id ?? null);
                        }
                    })();
                },
            });
        }
        else if (format.format === `many`) {
            /** NOTE: We use to have to instnatiate the list proxy outside Object.defineProperty.
             * I think it was beacuse of the infinite reactive refresh bug. I don't think we have
             * to do this anymore. */
            Object.defineProperty(proxy, propKey, {
                get: function () {
                    return listProx(format.refTypeName, objFormats, localCache, true, docId);
                },
                set: undefined,
            });
        }
        else if (format.format === `file`) {
            Object.defineProperty(proxy, propKey, {
                get: function () {
                    return localCache.getPropValue(typeName, proxy._id ?? ``, propKey);
                },
                set: function (newValue) {
                    if ((0, utils_1.exists)(proxy._id) && proxy[propKey] !== newValue) {
                        localCache.setPropValue(typeName, proxy._id, propKey, newValue);
                    }
                },
            });
        }
        else {
            Object.defineProperty(proxy, propKey, {
                get: function () {
                    return localCache.getPropValue(typeName, proxy._id ?? ``, propKey);
                },
                set: function (newValue) {
                    if ((0, utils_1.exists)(proxy._id) && proxy[propKey] !== newValue) {
                        localCache.setPropValue(typeName, proxy._id, propKey, newValue);
                    }
                },
            });
        }
    }
    return proxy;
}
exports.docProx = docProx;
function listProx(typeName, objFormats, localCache, isChild = false, mx_parent) {
    if (isChild) {
        const collectionList = _computed(() => {
            if ((0, utils_1.exists)(mx_parent)) {
                return localCache
                    .getChildDocs(typeName, mx_parent)
                    .map((docId) => docProx(docId, typeName, objFormats, localCache));
            }
            else {
                return [];
            }
        });
        return vueRefToList(collectionList, mx_parent);
    }
    else {
        const collectionList = _computed(() => localCache
            .listAllObjectsOfType(typeName)
            .map((docId) => docProx(docId, typeName, objFormats, localCache)));
        return vueRefToList(collectionList, mx_parent);
    }
    function vueRefToList(collectionList, mx_parent) {
        return {
            [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
            get length() {
                return collectionList.value.length;
            },
            filter(filterFn) {
                return vueRefToList(_computed(() => collectionList.value.filter(filterFn)));
            },
            map(mapFn) {
                return collectionList.value.map(mapFn);
            },
            add(createParams) {
                return docProx((() => {
                    const parent = mx_parent;
                    const defaultProps = getDefaultProps();
                    for (const [key, prop] of Object.entries(objFormats[typeName])) {
                        if (prop.format === `prim` &&
                            (0, utils_1.exists)(createParams[key])) {
                            defaultProps[key] =
                                createParams[key];
                        }
                        else if (prop.format === `one` &&
                            (0, utils_1.exists)(createParams[key])) {
                            defaultProps[key] = createParams[key]?._id;
                        }
                    }
                    const newDocId = localCache.addDoc(typeName, {
                        ...defaultProps,
                        ...((0, utils_1.exists)(parent) ? { mx_parent: parent } : {}),
                    });
                    return newDocId;
                })(), typeName, objFormats, localCache);
                function getDefaultProps() {
                    const defaultProps = {};
                    const defProps = objFormats[typeName];
                    for (const key of Object.keys(defProps)) {
                        const prop = defProps[key];
                        if (prop.format === `prim`) {
                            const defaultValue = prop.defaultValue;
                            if (typeof defaultValue === `function`) {
                                defaultProps[key] = defaultValue();
                            }
                            else {
                                defaultProps[key] = defaultValue;
                            }
                        }
                        else if (prop.format === `file`) {
                            defaultProps[key] = null;
                        }
                    }
                    return defaultProps;
                }
            },
        };
    }
}
function _defineAppDataStructure(modelName, options) {
    // Setup Reactivity
    _computed = options.reactivity.computed;
    _signal = options.reactivity.signal;
    _isSignal = options.reactivity.isSignal;
    _watchEffect = options.reactivity.watchEffect;
    // Setup Firebase
    isProduction = options.isProduction;
    return {
        getAppData: (0, utils_1.globalStore)(modelName, () => {
            const persistedFunctionManager = (0, PersistedFunctionManager_1.initializePersistedFunctionManager)(`mfs_${modelName}_persistedFunctions`, options.fileSystem);
            const localCache = (0, LocalCache_1.initializeCache)({
                typeSchemas: options.typeSchemas,
                getCollectionName,
                firebaseOptions: options.firebaseOptions,
                _signal,
                persistedFunctionManager: persistedFunctionManager,
                fileSystem: options.fileSystem,
                isProduction: options.isProduction,
            });
            const rootLists = {};
            for (const key of Object.keys(options.rootSchema)) {
                rootLists[key] = listProx(options.rootSchema[key].refTypeName, options.typeSchemas, localCache);
            }
            return rootLists;
        }),
        types: {},
    };
}
exports._defineAppDataStructure = _defineAppDataStructure;
