"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfsObj = exports.list = void 0;
const __1 = require("..");
const Reactivity_1 = require("../Reactivity");
function list(entryClass, propName) {
    return {
        [Reactivity_1.MFS_IS_PROP]: true,
        [Reactivity_1.MFS_IS_LIST]: true,
        entryClass,
        otherPropName: propName,
        get() {
            return [];
        },
    };
}
exports.list = list;
// export const MFS_ID = Symbol(`MFS_ID`);
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
class MfsObj {
    /*** This can be overridden to manually specify a type name. */
    static get typeName() {
        return this.name;
    }
    get typeName() {
        return this.constructor.typeName;
    }
    mfsId = (0, Reactivity_1.prop)(``);
    static getAllDocs() {
        const localCache = (0, __1.getLocalCache)();
        const typeName = this.typeName;
        localCache.syncType(typeName);
        // TODO: Get all docs from local cache.
        return localCache
            .listAllObjectsOfType(typeName)
            .map((mfsId) => this._create({ mfsId: (0, Reactivity_1.prop)(mfsId) }));
    }
    static create(createProps) {
        return this._create({
            initProps: createProps ?? {},
        });
    }
    static _create(options) {
        // Ensure this type is syncing with the DB.
        const localCache = (0, __1.getLocalCache)();
        const typeName = this.typeName;
        localCache.syncType(typeName);
        // Create a new instance.
        const childInstance = new this();
        // Substitute props.
        const defaultProps = {};
        for (const propKey of Object.keys(childInstance)) {
            if (propKey === `mfsId`)
                continue;
            if (!(childInstance[propKey]?.[Reactivity_1.MFS_IS_PROP] ?? false))
                continue;
            if (!(childInstance[propKey]?.get instanceof Function))
                continue;
            const isList = childInstance[propKey]?.[Reactivity_1.MFS_IS_LIST] ?? false;
            // Lists are don't have to have a set function
            if (!isList && !(childInstance[propKey]?.set instanceof Function)) {
                continue;
            }
            if (isList) {
                const entryClass = childInstance[propKey].entryClass;
                const otherPropName = childInstance[propKey].otherPropName;
                if (typeof otherPropName !== `string`) {
                    throw new Error(`Invalid prop name "${otherPropName.toString()}".`);
                }
                localCache.syncType(entryClass.typeName);
                localCache.indexOnProp(entryClass.typeName, otherPropName);
                childInstance[propKey] = {
                    [Reactivity_1.MFS_IS_PROP]: true,
                    [Reactivity_1.MFS_IS_LIST]: true,
                    get() {
                        return localCache.getIndexedDocs(entryClass.typeName, otherPropName, childInstance.mfsId.get());
                    },
                };
            }
            else {
                defaultProps[propKey] =
                    (options.initProps ?? {})[propKey] ??
                        childInstance[propKey].get();
                childInstance[propKey] = {
                    [Reactivity_1.MFS_IS_PROP]: true,
                    get() {
                        return localCache.getPropValue(typeName, childInstance.mfsId.get(), propKey);
                    },
                    set(newValue) {
                        localCache.setPropValue(typeName, childInstance.mfsId.get(), propKey, newValue);
                    },
                };
            }
        }
        // Set up the inst id
        childInstance.mfsId =
            options.mfsId !== undefined
                ? options.mfsId
                : (0, Reactivity_1.prop)(localCache.addDoc(typeName, defaultProps));
        return childInstance;
    }
    /** Permanently deletes this object. */
    delete() {
        (0, __1.getLocalCache)().deleteDoc(this.typeName, this.mfsId.get());
    }
}
exports.MfsObj = MfsObj;
// abstract class MfsSession extends MfsObj {}
// abstract class MfsLocal extends MfsObj {}
// abstract class MfsGlobal extends MfsObj {}
// class Client extends MfsObj {
//   name = prop(``);
//   assets = list(Asset, `client`);
// }
// const clients = Client.getAllDocs();
// const client = Client.create();
// client.name.set(`Bob`);
// class Asset extends MfsGlobal {
//   name = prop(``);
//   client = prop(Client);
//   notes = list(Note, `asset`);
//   pictures = list(Picture, `asset`);
// }
// class Note extends MfsGlobal {
//   name = prop(``);
//   asset = prop(Asset);
// }
// class Picture extends MfsGlobal {
//   name = prop(``);
//   asset = prop(Asset);
// }
