import { MfsObj, extendsMfsObj } from ".";
import { getLocalCache } from "./Implement";

export const MFS_PROP_CONFIG = Symbol(`MFS_PROP_CONFIG`);

export type PropGetter<T> = {
  get(): T;
};
export type PropSetter<T> = {
  set(newValue: T): void;
};
export type Prop<T> = PropGetter<T> &
  PropSetter<T> & {
    [MFS_PROP_CONFIG]: {
      format: string;
    };
  };
export function prop<T>(
  initValue: T,
): T extends typeof MfsObj
  ? InstanceType<T> & PropSetter<InstanceType<T>>
  : Prop<T> {
  if (extendsMfsObj(initValue)) {
    return {
      [MFS_PROP_CONFIG]: {
        format: `objRef`,
        typeClass: initValue,
      },
    } as any;
  } else {
    const signal = getLocalCache().createSignal(initValue);
    return {
      [MFS_PROP_CONFIG]: {
        quantity: `prim`,
      },
      get() {
        return signal.get();
      },
      set(newValue: T) {
        signal.set(newValue);
      },
    } as any;
  }
}

export function list<T extends typeof MfsObj>(
  entryClass: T,
  propName: keyof InstanceType<T>,
) {
  return {
    [MFS_PROP_CONFIG]: {
      format: `objList`,
      typeClass: entryClass,
      otherPropName: propName,
    },
  } as any;
}
// export function propFromFuncs<T>(funcs: {
//   type: any;
//   quantity: `one` | `many`;
//   get: () => T;
//   set: (newValue: T) => void;
// }): Prop<T> {
//   return {
//     [MFS_PROP_CONFIG]: {
//       quantity: funcs.quantity,
//       typeClass: funcs.type,
//     },
//     get: funcs.get,
//     set: funcs.set,
//   };
// }
export function formula<T>(evaluate: () => T): PropGetter<T> {
  return getLocalCache().createComputed(evaluate);
}
