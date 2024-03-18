import { Persistance, createDocStore, initDocStoreConfig, } from "./DocStore.js";
import { listObjEntries, doNow, isValid, } from "./Utils.js";
let _getWorkspaceId;
export const getWorkspaceId = () => _getWorkspaceId();
let _getStage;
export const getStage = () => _getStage();
let defaultDocStoreConfig;
export function initializeDocClass(config) {
    _getStage = config.getStage;
    _getWorkspaceId = config.getWorkspaceId;
    defaultDocStoreConfig = config.defaultDocStoreConfig;
    return {
        MfsDoc(docType, customizations) {
            return MfsDoc.customize({ docType, ...(customizations ?? {}) });
        },
        defaultDocStoreConfig: config.defaultDocStoreConfig,
        getWorkspaceId,
    };
}
const _allDocInstances = new Map();
function _initializeInst(inst, overrideProps, 
// We should try not making docId reactive, and then decide if that was the wrong idea.
getDocId) {
    // Create Instance
    const initProps = {};
    const customProps = {};
    listObjEntries(inst).forEach(([key, propConfig]) => {
        if (!isCustomProp(propConfig))
            return;
        if (typeof key !== `string`)
            return;
        customProps[key] = propConfig;
        doNow(() => {
            if (typeof key !== `string`)
                return;
            if (propConfig.isFullCustom)
                return;
            const initValue = overrideProps[key] !== undefined && isValid(propConfig.toPrim)
                ? propConfig.toPrim(overrideProps[key])
                : propConfig.getInitValue();
            if (initValue === undefined)
                return;
            initProps[key] = {
                value: initValue,
                maxPersistance: propConfig.persistance,
            };
        });
    });
    const docId = getDocId(initProps);
    // Setup docId. It won't change so it doesn't need to be reactive
    Object.defineProperty(inst, "docId", {
        get: function () {
            return docId;
        },
    });
    // Setup all custom props.
    Object.entries(customProps).forEach(([key, propConfig]) => {
        if (propConfig.isFullCustom) {
            propConfig.init(inst, key);
        }
        else {
            Object.defineProperty(inst, key, {
                get: function () {
                    const storeValue = this._docStore.getProp(docId, key, propConfig.getFallbackValue());
                    return propConfig.fromPrim(storeValue);
                },
                ...(isValid(propConfig.toPrim)
                    ? {
                        set: function (value) {
                            const asPrim = propConfig.toPrim(value);
                            // TODO: Only do update if value is different.
                            this._docStore.batchUpdate({
                                [docId]: {
                                    [key]: {
                                        value: asPrim,
                                        maxPersistance: propConfig.persistance,
                                    },
                                },
                            }, {
                                overwriteGlobally: false,
                            });
                        },
                    }
                    : {}),
            });
        }
    });
    return inst;
}
/* TODO: Maybe Require a special, non-exported symbol as the parameter of the constructor
 * so that no one outside of this file can create a new instance. */
const docStores = new Map();
export class MfsDoc {
    // private constructor() {}
    /*** NOTE: This can be overridden to manually specify a type name. */
    static get docType() {
        return this.name;
    }
    get docType() {
        return this.constructor.docType;
    }
    static getDocStoreConfig() {
        return defaultDocStoreConfig;
    }
    static get _docStore() {
        const stage = getStage();
        const workspaceId = getWorkspaceId();
        if (!docStores.has(workspaceId))
            docStores.set(workspaceId, new Map());
        const workspaceStore = docStores.get(workspaceId);
        if (!workspaceStore.has(this.docType)) {
            workspaceStore.set(this.docType, createDocStore(initDocStoreConfig({
                config: this.getDocStoreConfig(),
                stage: stage,
                workspaceId: workspaceId,
                docType: this.docType,
            })));
            /** Docs don't start syncing until they are accessed the first time. So as soon as
             * the first one is accessed we start syncing all the connected doc types too. */
            const uninitializedInst = new this();
            Object.values(uninitializedInst).forEach((prop) => {
                if (isCustomProp(prop)) {
                    prop.otherDocsToStartSyncing.forEach((docClass) => docClass._docStore);
                }
            });
        }
        return workspaceStore.get(this.docType);
    }
    get _docStore() {
        return this.constructor._docStore;
    }
    // TODO: Rename this to "customize" or something like that so we can add more options to it like overriding docType.
    static customize(customizations) {
        return class extends this {
            static get docType() {
                return customizations.docType ?? this.name;
            }
            static getDocStoreConfig() {
                return {
                    ...defaultDocStoreConfig,
                    ...customizations.docStoreConfig,
                };
            }
        };
    }
    // TODO: Let this be defined as a hash of two keys for rel-tables.
    get docId() {
        return ``;
    }
    get isDeleted() {
        return this._docStore.isDocDeleted(this.docId);
    }
    static getAllDocs() {
        return this._docStore.getAllDocs().map(this._fromId.bind(this));
    }
    static _fromId(docId) {
        if (!_allDocInstances.has(docId)) {
            _allDocInstances.set(docId, _initializeInst(new this(), {}, () => docId));
        }
        return _allDocInstances.get(docId);
    }
    static create(...overrideProps) {
        return _initializeInst(new this(), overrideProps[0] ?? {}, this._docStore.createDoc);
    }
    /** Override to run code just before an object is deleted. */
    onDelete() { }
    /** Permanently deletes this object. */
    deleteDoc = () => {
        // NOTE: If we try to declare this using the "function" format, like deleteDoc() {}, then
        // the "this" keyword will not work correctly.
        this.onDelete();
        this._docStore.deleteDoc(this.docId);
    };
}
export const RequiredPropFlag = Symbol(`RequiredPropFlag`);
export const OptionalPropFlag = Symbol(`OptionalPropFlag`);
export function prop(firstParam, secondParam, 
/* TODO: Make third param be an options obj. Both "key" and "persistance" should
 * be options. Alternately we could do prop.customize({ ...options }); */
persistance = Persistance.global) {
    const TypeClass = typeof firstParam === `function`
        ? firstParam
        : Array.isArray(firstParam)
            ? firstParam[0]
            : firstParam instanceof MfsDoc
                ? MfsDoc
                : typeof firstParam === `boolean`
                    ? Boolean
                    : typeof firstParam === `number`
                        ? Number
                        : String;
    const initValue = [
        `boolean`,
        `number`,
        `string`,
    ].includes(typeof firstParam)
        ? firstParam
        : secondParam;
    if (isDocClass(TypeClass)) {
        return {
            [IsCustomProp]: true,
            isFullCustom: false,
            getInitValue: () => initValue instanceof MfsDoc ? initValue.docId : initValue,
            getFallbackValue: () => null,
            fromPrim: (prim) => {
                if (prim === null)
                    return null;
                if (typeof prim !== `string`) {
                    console.error(`Tried to read a doc prop of type ${TypeClass.docType} but got ${prim} instead of a docId string.`);
                    return null;
                }
                return TypeClass._fromId(prim);
            },
            toPrim: (inst) => inst?.docId ?? null,
            persistance,
            otherDocsToStartSyncing: [TypeClass],
        };
    }
    else {
        return {
            [IsCustomProp]: true,
            isFullCustom: false,
            getInitValue: () => initValue,
            getFallbackValue: () => initValue,
            fromPrim: (prim) => prim,
            toPrim: (inst) => inst,
            persistance,
            otherDocsToStartSyncing: [],
        };
    }
}
export function formula(compute) {
    return {
        [IsCustomProp]: true,
        isFullCustom: false,
        getInitValue: () => undefined,
        getFallbackValue: () => compute,
        fromPrim: (prim) => prim,
        persistance: Persistance.session,
        otherDocsToStartSyncing: [],
    };
}
export const IsCustomProp = Symbol(`IsCustomProp`);
function isCustomProp(arg) {
    return arg?.[IsCustomProp] === true;
}
function isDocClass(possibleDocClass) {
    return Object.prototype.isPrototypeOf.call(MfsDoc.prototype, possibleDocClass.prototype);
}
