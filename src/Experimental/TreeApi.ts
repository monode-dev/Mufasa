import { v4 as uuidv4 } from "uuid";
import { MFS_PROP_CONFIG, exists, getLocalCache, isValid } from "..";
import { PropGetter, formula, prop, Prop } from "../Reactivity";

export function extendsMfsObj<T>(
  ChildClass: T,
): ChildClass is T & typeof MfsObj {
  let prototype = Object.getPrototypeOf(ChildClass);
  while (prototype !== null) {
    if (prototype === MfsObj) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}

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
  readonly mfsId: PropGetter<string> = prop(``);

  static getAllDocs<T extends typeof MfsObj>(this: T): InstanceType<T>[] {
    const localCache = getLocalCache();
    const typeName = this.typeName;
    localCache.syncType(typeName);
    // TODO: Get all docs from local cache.
    return localCache
      .listAllObjectsOfType(typeName)
      .map((mfsId) => this._create({ instMfsId: prop(mfsId) }));
  }

  static create<T extends typeof MfsObj>(
    this: T,
    createProps?: MfsPropsForCreate<T>,
  ): InstanceType<T> {
    return this._create({
      initProps: createProps ?? {},
    });
  }

  static _create<T extends typeof MfsObj>(
    this: T,
    options:
      | {
          instMfsId: PropGetter<string>;
          initProps?: never;
        }
      | {
          instMfsId?: never;
          initProps: MfsPropsForCreate<T>;
        },
  ): InstanceType<T> {
    // Ensure this type is syncing with the DB.
    const localCache = getLocalCache();
    const typeName = this.typeName;
    localCache.syncType(typeName);

    // Create a new instance.
    // TODO: There is probably a neat way to type this. Like Writable<Partial<MfsObj>> or something.
    const newInstance = new (this as any)();
    newInstance.mfsId = options.instMfsId ?? prop(uuidv4());

    // Substitute props.
    const createDocProps: { [propName: string]: any } = {};
    for (const propKey of Object.keys(newInstance)) {
      if (propKey === `mfsId`) continue;
      const propConfig = newInstance[propKey]?.[MFS_PROP_CONFIG];
      if (!isValid(propConfig)) continue;

      if (propConfig.format === `objRef`) {
        const PropClass = newInstance[propKey].typeClass;
        const propValueInst = PropClass._create({
          mfsId: formula(() => {
            const propValue = localCache.getPropValue(
              typeName,
              newInstance.mfsId.get(),
              propKey,
            ) as any;
            return propValue?.value ?? ``;
          }),
        });
        propValueInst.set = (newValue: InstanceType<typeof PropClass>) => {
          localCache.setPropValue(
            typeName,
            newInstance.mfsId.get(),
            propKey,
            newValue.mfsId.get(),
          );
        };
        // Update createDocProps when applicable.
        if (isValid(options.initProps)) {
          const initId = (
            (options.initProps as any)[propKey] as MfsObj | undefined
          )?.mfsId.get();
          if (isValid(initId)) {
            createDocProps[propKey] = initId;
          }
        }
        newInstance[propKey] = propValueInst;
      } else if (propConfig.format === `list`) {
        const entryClass = newInstance[propKey].entryClass;
        const otherPropName = newInstance[propKey].otherPropName;
        if (typeof otherPropName !== `string`) {
          throw new Error(`Invalid prop name "${otherPropName.toString()}".`);
        }
        localCache.syncType(entryClass.typeName);
        localCache.indexOnProp(entryClass.typeName, otherPropName);
        newInstance[propKey] = {
          get() {
            return localCache.getIndexedDocs(
              entryClass.typeName,
              otherPropName,
              newInstance.mfsId.get(),
            );
          },
        };
      } else {
        createDocProps[propKey] =
          ((options.initProps ?? {}) as any)[propKey] ??
          newInstance[propKey].get();
        newInstance[propKey] = {
          get() {
            return localCache.getPropValue(
              typeName,
              newInstance.mfsId.get(),
              propKey,
            );
          },
          set(newValue: any) {
            localCache.setPropValue(
              typeName,
              newInstance.mfsId.get(),
              propKey,
              newValue,
            );
          },
        };
      }
    }

    // Set up the inst id
    if (isValid(options.initProps)) {
      localCache.addDoc(typeName, createDocProps, newInstance.mfsId.get());
    }

    return newInstance;
  }

  /** Permanently deletes this object. */
  delete() {
    getLocalCache().deleteDoc(this.typeName, this.mfsId.get());
  }
}

// abstract class MfsSession extends MfsObj {}
// abstract class MfsLocal extends MfsObj {}
// abstract class MfsGlobal extends MfsObj {}
// function list(...args: any) {}

// class Client extends MfsObj {
//   name = prop(``);
//   specialName = formula(() => `Special ${this.name.get()}`);
//   assets = list(Asset, `client`);
// }

// const clients = Client.getAllDocs();
// const client = Client.create();
// client.name.set(`Bob`);
// client.specialName.get();

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
