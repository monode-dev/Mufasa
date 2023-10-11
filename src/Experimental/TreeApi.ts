import { v4 as uuidv4 } from "uuid";
import { getLocalCache } from "..";
import { PropReader, formula, MFS_IS_PROP, prop } from "../Reactivity";

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

export const MFS_ID = Symbol(`MFS_ID`);
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
export abstract class MfsObj {
  /*** This can be overridden to manually specify a type name. */
  static get typeName() {
    return this.name;
  }
  get typeName() {
    return (this.constructor as typeof MfsObj).typeName;
  }
  readonly [MFS_ID]: PropReader<string>;
  constructor(id: PropReader<string>) {
    this[MFS_ID] = id;
  }

  static getAllDocs<T extends typeof MfsObj>(this: T): InstanceType<T>[] {
    const localCache = getLocalCache();
    const typeName = this.typeName;
    localCache.syncType(typeName);
    // TODO: Get all docs from local cache.
    return localCache
      .listAllObjectsOfType(typeName)
      .map((docId) => new (this as any)(prop(docId)));
  }

  static docCollections: {
    [collectionName: string]: {
      [docId: string]: MfsObj;
    };
  } = {};
  static create<T extends typeof MfsObj>(
    this: T,
    createProps?: Partial<InstanceType<T>>,
  ): InstanceType<T> {
    const newId = uuidv4();
    const childInstance = new (this as any)(prop(newId));

    // Substitute props.
    const localCache = getLocalCache();
    for (const propKey of Object.keys(childInstance)) {
      if (!(childInstance?.[propKey]?.[MFS_IS_PROP] ?? false)) continue;
      childInstance[propKey] = {
        [MFS_IS_PROP]: true,
        get() {
          return localCache.getPropValue(this.typeName, newId, propKey);
        },
        set(newValue: any) {
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
