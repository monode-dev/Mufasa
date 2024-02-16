import { Doc, IsCustomProp, prop, } from "./Doc.js";
import { isValid } from "./Utils.js";
const relTables = new Map();
export function list(OtherClass, tableConfig) {
    const otherProp = typeof tableConfig === `string` ? tableConfig : null;
    const getPersisters = tableConfig instanceof Function ? tableConfig : null;
    if (isValid(otherProp)) {
        const emptyOtherInst = new OtherClass();
        const otherPropIsNewList = emptyOtherInst[otherProp].isNewList ?? false;
        if (otherPropIsNewList) {
            return listProp({
                getPrimaryClass: () => OtherClass,
                getSecondaryClass: (inst) => inst.constructor,
                gePrimaryProp: () => otherProp,
                getPersisters,
            });
        }
        else {
            return {
                [IsCustomProp]: true,
                isFullCustom: true,
                init: (inst, key) => {
                    OtherClass._docStore;
                    const listInst = new List(() => OtherClass.getAllDocs().filter((other) => other[otherProp].docId === inst.docId), () => { }, () => { });
                    Object.defineProperty(inst, key, {
                        get: () => listInst,
                    });
                },
            };
        }
    }
    else {
        return {
            isNewList: true,
            ...listProp({
                getPrimaryClass: (inst) => inst.constructor,
                getSecondaryClass: () => OtherClass,
                gePrimaryProp: (thisProp) => thisProp,
                getPersisters,
            }),
        };
    }
}
function listProp(config) {
    return {
        [IsCustomProp]: true,
        isFullCustom: true,
        init: (inst, key) => {
            const PrimaryClass = config.getPrimaryClass(inst);
            const SecondaryClass = config.getSecondaryClass(inst);
            PrimaryClass._docStore;
            SecondaryClass._docStore;
            if (!relTables.has(PrimaryClass))
                relTables.set(PrimaryClass, new Map());
            const relTablesForThisType = relTables.get(PrimaryClass);
            if (!relTablesForThisType.has(key)) {
                const docType = `${PrimaryClass.docType}_${key}`;
                const DocClass = isValid(config.getPersisters)
                    ? Doc.newTypeFromPersisters(config.getPersisters(docType))
                    : Doc;
                relTablesForThisType.set(key, class extends DocClass {
                    static get docType() {
                        return docType;
                    }
                    primary = prop(PrimaryClass);
                    secondary = prop(SecondaryClass);
                });
            }
            const RelTable = relTablesForThisType.get(key);
            const listInst = new List(() => RelTable.getAllDocs().filter((rel) => rel.primary.docId === inst.docId), (value) => {
                RelTable.create({
                    primary: inst,
                    secondary: value,
                });
            }, (value) => {
                RelTable.getAllDocs()
                    .filter((rel) => rel.primary.docId === inst.docId &&
                    rel.secondary.docId === value.docId)
                    .forEach((rel) => rel.delete());
            });
            Object.defineProperty(inst, key, {
                get: () => listInst,
            });
        },
    };
}
export class List {
    getArray;
    add;
    remove;
    [Symbol.iterator]() {
        return this.getArray()[Symbol.iterator]();
    }
    forEach(callbackfn) {
        this.getArray().forEach(callbackfn);
    }
    map(callbackfn) {
        return this.getArray().map(callbackfn);
    }
    has(toFind) {
        return this.getArray().some((item) => item.docId === toFind.docId);
    }
    get count() {
        return this.getArray().length;
    }
    constructor(getArray, add, remove) {
        this.getArray = getArray;
        this.add = add;
        this.remove = remove;
    }
}
