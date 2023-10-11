import { v4 as uuidv4 } from "uuid";
import { getLocalCache } from "..";
import { PropReader, formula, MFS_IS_PROP, prop, Prop } from "../Reactivity";

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

export type MfsPropsForCreate<T extends typeof MfsObj> = Partial<{
  [propName in keyof InstanceType<T>]: InstanceType<T>[propName] extends Prop<
    infer T
  >
    ? T
    : never;
}>;

// export const MFS_ID = Symbol(`MFS_ID`);
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
export abstract class MfsObj {
  /*** This can be overridden to manually specify a type name. */
  static get typeName() {
    return this.name;
  }
  get typeName() {
    return (this.constructor as typeof MfsObj).typeName;
  }
  readonly mfsId: PropReader<string> = prop(``);

  static getAllDocs<T extends typeof MfsObj>(this: T): InstanceType<T>[] {
    const localCache = getLocalCache();
    const typeName = this.typeName;
    localCache.syncType(typeName);
    // TODO: Get all docs from local cache.
    return localCache
      .listAllObjectsOfType(typeName)
      .map((mfsId) => this._create({ mfsId: prop(mfsId) }));
  }

  static create<T extends typeof MfsObj>(
    this: T,
    createProps?: MfsPropsForCreate<T>,
  ): InstanceType<T> {
    return this._create({
      initProps: createProps ?? {},
    });
  }

  private static _create<T extends typeof MfsObj>(
    this: T,
    options:
      | {
          mfsId: PropReader<string>;
          initProps?: never;
        }
      | {
          mfsId?: never;
          initProps: MfsPropsForCreate<T>;
        },
  ): InstanceType<T> {
    // Ensure this type is syncing with the DB.
    const localCache = getLocalCache();
    const typeName = this.typeName;
    localCache.syncType(typeName);

    // Create a new instance.
    const childInstance = new (this as any)();

    // Substitute props.
    const defaultProps: { [propName: string]: any } = {};
    for (const propKey of Object.keys(childInstance)) {
      if (propKey === `mfsId`) continue;
      if (!(childInstance[propKey]?.[MFS_IS_PROP] ?? false)) continue;
      if (!(childInstance[propKey]?.get instanceof Function)) continue;
      if (!(childInstance[propKey]?.set instanceof Function)) continue;
      defaultProps[propKey] =
        ((options.initProps ?? {}) as any)[propKey] ??
        childInstance[propKey].get();
      childInstance[propKey] = {
        [MFS_IS_PROP]: true,
        get() {
          return localCache.getPropValue(
            typeName,
            childInstance.mfsId.get(),
            propKey,
          );
        },
        set(newValue: any) {
          localCache.setPropValue(
            typeName,
            childInstance.mfsId.get(),
            propKey,
            newValue,
          );
        },
      };
    }

    // Set up the inst id
    childInstance.mfsId =
      options.mfsId !== undefined
        ? options.mfsId
        : prop(localCache.addDoc(typeName, defaultProps));

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
