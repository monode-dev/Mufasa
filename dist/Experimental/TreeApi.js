"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const MFS_ID = Symbol(`MFS_ID`);
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
class MfsObj {
    /*** This can be overridden to manually specify a type name. */
    static get typeName() {
        return this.name;
    }
    get typeName() {
        return this.constructor.typeName;
    }
    [MFS_ID];
    constructor(id) {
        this[MFS_ID] = id;
    }
    static getAllDocs() {
        const localCache = (0, __1.getLocalCache)();
        const typeName = this.typeName;
        localCache.syncType(typeName);
        // TODO: Get all docs from local cache.
        return localCache
            .listAllObjectsOfType(typeName)
            .map((docId) => new this((0, Reactivity_1.prop)(docId)));
    }
    static docCollections = {};
    static create(createProps) {
        const newId = (0, uuid_1.v4)();
        const childInstance = new this((0, Reactivity_1.prop)(newId));
        // Substitute props.
        const localCache = (0, __1.getLocalCache)();
        for (const propKey of Object.keys(childInstance)) {
            if (!(childInstance?.[propKey]?.[Reactivity_1.MFS_IS_PROP] ?? false))
                continue;
            childInstance[propKey] = {
                [Reactivity_1.MFS_IS_PROP]: true,
                get() {
                    return localCache.getPropValue(this.typeName, newId, propKey);
                },
                set(newValue) {
                    localCache.setPropValue(this.typeName, newId, propKey, newValue);
                },
            };
        }
        return childInstance;
    }
}
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
