import { Doc, IsCustomProp, prop } from "./Doc.js";
const relTables = new Map();
export function list(OtherClass, tableConfig) {
    if (typeof tableConfig === `string`) {
        const otherProp = tableConfig;
        const emptyOtherInst = new OtherClass();
        const otherPropIsNewList = emptyOtherInst[otherProp].isNewList ?? false;
        const docStoreConfig = emptyOtherInst[otherProp].docStoreConfig;
        if (otherPropIsNewList) {
            return listProp({
                getPrimaryClass: () => OtherClass,
                getSecondaryClass: (inst) => inst.constructor,
                gePrimaryProp: () => otherProp,
                docStoreConfig: docStoreConfig,
                otherDocsToStartSyncing: [OtherClass],
            });
        }
        else {
            return {
                [IsCustomProp]: true,
                isFullCustom: true,
                init: (inst, key) => {
                    const listInst = new List(() => OtherClass.getAllDocs().filter((other) => other[otherProp]?.docId === inst.docId), () => { }, () => { });
                    Object.defineProperty(inst, key, {
                        get: () => listInst,
                    });
                },
                otherDocsToStartSyncing: [OtherClass],
            };
        }
    }
    else {
        return {
            isNewList: true,
            docStoreConfig: tableConfig ?? null,
            ...listProp({
                getPrimaryClass: (inst) => inst.constructor,
                getSecondaryClass: () => OtherClass,
                gePrimaryProp: (thisProp) => thisProp,
                docStoreConfig: tableConfig ?? null,
                otherDocsToStartSyncing: [OtherClass],
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
            if (!relTables.has(PrimaryClass))
                relTables.set(PrimaryClass, new Map());
            const relTablesForThisType = relTables.get(PrimaryClass);
            if (!relTablesForThisType.has(key)) {
                relTablesForThisType.set(key, class extends Doc.customize({
                    docType: `${PrimaryClass.docType}_${key}`,
                    docStoreConfig: config.docStoreConfig ?? undefined,
                }) {
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
                    .forEach((rel) => rel.deleteDoc());
            });
            Object.defineProperty(inst, key, {
                get: () => listInst,
            });
        },
        otherDocsToStartSyncing: config.otherDocsToStartSyncing,
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
