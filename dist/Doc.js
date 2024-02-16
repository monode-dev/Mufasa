import { Persistance, createDocStore, } from "./DocStore.js";
import { listObjEntries, doNow, isValid, } from "./Utils.js";
let getDefaultPersistersFromDocType;
export function initializeDocClass(getDocClassOptions) {
    getDefaultPersistersFromDocType =
        getDocClassOptions.getDefaultPersistersFromDocType;
    return { Doc, getDefaultPersistersFromDocType };
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
                    const storeValue = this._docStore.getProp(docId, key, propConfig.getDefaultValue());
                    return propConfig.fromPrim(storeValue);
                },
                ...(isValid(propConfig.toPrim)
                    ? {
                        set: function (value) {
                            this._docStore.batchUpdate({
                                [docId]: {
                                    [key]: {
                                        value: propConfig.toPrim(value),
                                        maxPersistance: propConfig.persistance,
                                    },
                                },
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
export class Doc {
    // private constructor() {}
    /*** NOTE: This can be overridden to manually specify a type name. */
    static get docType() {
        return this.name;
    }
    get docType() {
        return this.constructor.docType;
    }
    static getPersisters() {
        return getDefaultPersistersFromDocType?.(this.docType);
    }
    static get _docStore() {
        if (!docStores.has(this.docType)) {
            docStores.set(this.docType, createDocStore(this.getPersisters()));
        }
        return docStores.get(this.docType);
    }
    get _docStore() {
        return this.constructor._docStore;
    }
    // TODO: Rename this to "customize" or something like that so we can add more options to it like overriding docType.
    static newTypeFromPersisters(persisters) {
        return class extends Doc {
            static getPersisters() {
                return persisters;
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
    get maxPersistance() {
        return this._docStore.getMaxPersistance(this.docId);
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
    delete() {
        this.onDelete();
        this._docStore.deleteDoc(this.docId);
    }
}
export const RequiredPropFlag = Symbol(`RequiredPropFlag`);
export const OptionalPropFlag = Symbol(`OptionalPropFlag`);
export function prop(firstParam, secondParam, persistance = Persistance.global) {
    const TypeClass = typeof firstParam === `function`
        ? firstParam
        : Array.isArray(firstParam)
            ? firstParam[0]
            : firstParam instanceof Doc
                ? Doc
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
            getInitValue: () => initValue instanceof Doc ? initValue.docId : initValue,
            getDefaultValue: () => null,
            fromPrim: (prim) => TypeClass._fromId(prim),
            toPrim: (inst) => inst?.docId ?? null,
            persistance,
        };
    }
    else {
        return {
            [IsCustomProp]: true,
            isFullCustom: false,
            getInitValue: () => initValue,
            getDefaultValue: () => initValue,
            fromPrim: (prim) => prim,
            toPrim: (inst) => inst,
            persistance,
        };
    }
}
export function formula(compute) {
    return {
        [IsCustomProp]: true,
        isFullCustom: false,
        getInitValue: () => undefined,
        getDefaultValue: () => compute,
        fromPrim: (prim) => prim,
        persistance: Persistance.session,
    };
}
export const IsCustomProp = Symbol(`IsCustomProp`);
function isCustomProp(arg) {
    return arg?.[IsCustomProp] === true;
}
function isDocClass(possibleDocClass) {
    return Object.prototype.isPrototypeOf.call(Doc.prototype, possibleDocClass.prototype);
}
