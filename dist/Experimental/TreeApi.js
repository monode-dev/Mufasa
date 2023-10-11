"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfsObj = exports.MFS_ID = void 0;
const uuid_1 = require("uuid");
const __1 = require("..");
const Reactivity_1 = require("../Reactivity");
// function list<T extends abstract new (...args: any) => any>(
//   typeClass: T,
//   propName: keyof InstanceType<T>,
// ) {
//   const localCache = getLocalCache();
//   const entryTypeName: string = (typeClass as any).typeName;
//   localCache.syncType(entryTypeName);
//   // TODO: request an index on the given property.
//   return formula(() => {
//     // TODO: Read from local cache.
//   });
// }
exports.MFS_ID = Symbol(`MFS_ID`);
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
class MfsObj {
    /*** This can be overridden to manually specify a type name. */
    static get typeName() {
        return this.name;
    }
    get typeName() {
        return this.constructor.typeName;
    }
    [exports.MFS_ID];
    constructor(id) {
        this[exports.MFS_ID] = id;
    }
    static _spawnInst(instId) {
        const localCache = (0, __1.getLocalCache)();
        const typeName = this.typeName;
        localCache.syncType(typeName);
        const childInstance = new this(instId);
        // Substitute props.
        for (const propKey of Object.keys(childInstance)) {
            if (!(childInstance[propKey]?.[Reactivity_1.MFS_IS_PROP] ?? false))
                continue;
            childInstance[propKey] = {
                [Reactivity_1.MFS_IS_PROP]: true,
                get() {
                    return localCache.getPropValue(typeName, childInstance[exports.MFS_ID].get(), propKey);
                },
                set(newValue) {
                    localCache.setPropValue(typeName, childInstance[exports.MFS_ID].get(), propKey, newValue);
                },
            };
        }
        return childInstance;
    }
    static create(createProps) {
        const newId = (0, uuid_1.v4)();
        return this._spawnInst((0, Reactivity_1.prop)(newId));
    }
    static getAllDocs() {
        const localCache = (0, __1.getLocalCache)();
        const typeName = this.typeName;
        localCache.syncType(typeName);
        // TODO: Get all docs from local cache.
        return localCache
            .listAllObjectsOfType(typeName)
            .map((docId) => this._spawnInst((0, Reactivity_1.prop)(docId)));
    }
    static docCollections = {};
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
