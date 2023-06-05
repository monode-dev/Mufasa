// Object
export type DefObj = {
  typeName: string;
  props: {
    [key: string]: DefPrim | DefOne<string> | DefMany /* | One | Many */;
  };
};
export function defObj<T extends DefObj>(objDef: T) {
  return objDef;
}

// Primitive
export type PrimTsType = number | boolean | string /* | binary */ | null;
export type DefPrim<T extends PrimTsType = PrimTsType> = {
  type: `primitive`;
  init: PrimInitTsType<T>;
};
export type PrimInitTsType<T extends PrimTsType> =
  | T
  | (() => PrimTsType)
  | undefined;
// TODO: We need a type has no surounding whitespace.
export function defPrim<T extends PrimTsType>(
  init: PrimInitTsType<T>,
): DefPrim<T> {
  return {
    type: `primitive`,
    init,
  };
}

// One
export type DefOne<T extends string = string> = {
  type: T;
  quantity: `one`;
  // backRefPropName: string | undefined,
  init: null | (() => DefObj);
};
export function defOne<T extends string>(
  options: T,
  init: null | (() => DefObj),
): DefOne<T> {
  return {
    type: options,
    quantity: `one`,
    init: init,
  };
}

// Many
export type DefMany<T extends DefObj = DefObj> = {
  type: T; // | string,
  quantity: `many`;
  // backRefPropName: string | undefined,
  // quantitySelf: `one` | `many`,
  // init: [] | FROM_CREATE | (() => ManyParams),
};
export function defMany<T extends DefObj>(options: T): DefMany<T> {
  return {
    type: options,
    quantity: `many`,
  };
}

// Formula
// function formula<T, R = any>(compute: (inst: T) => R) {
//   return computed(compute);
// }

// Action
// function action<T>(doAction: (inst: T) => Promise<void>) {
//   return doAction;
// }
