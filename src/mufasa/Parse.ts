import {
  DefFile,
  DefMany,
  DefObj,
  DefOne,
  DefPrim,
  PrimTsType,
} from "./Define";
import { Doc, List } from "./Implement";

// App Data Structure
export type ObjFormats = {
  [typeName: string]: {
    [propName: string]: {
      format: `prim` | `one` | `many` | `file`;
      typeName: string | undefined;
      primType: PrimTsType | undefined;
      init: any;
    };
  };
};
export type FormatToTsType<
  TypeName extends string,
  F extends ObjFormats,
> = Doc<{
  -readonly [K in keyof F[TypeName]]: F[TypeName][K][`format`] extends `prim`
    ? F[TypeName][K][`primType`]
    : F[TypeName][K][`format`] extends `file`
    ? Promise<string | null> | null | string
    : F[TypeName][K][`format`] extends `one`
    ? F[TypeName][K][`typeName`] extends string
      ? FormatToTsType<F[TypeName][K][`typeName`], F> | null
      : never
    : F[TypeName][K][`format`] extends `many`
    ? F[TypeName][K][`typeName`] extends string
      ? List<FormatToTsType<F[TypeName][K][`typeName`], F>>
      : never
    : never;
}>;
export type CreateParamsFromDoc<T extends Doc> = T extends Doc<infer R>
  ? {
      [K in keyof R]?: R[K]; // Null is now gone
    }
  : never;
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
export type ObjToFormat<T extends DefObj> = {
  [K in keyof T["props"]]: T["props"][K] extends DefPrim<infer R>
    ? {
        format: `prim`;
        typeName: undefined;
        primType: R;
        init: any;
      }
    : T["props"][K] extends DefOne<string>
    ? {
        format: `one`;
        typeName: T["props"][K]["type"];
        primType: undefined;
        init: any;
      }
    : T["props"][K] extends DefMany
    ? {
        format: `many`;
        typeName: T["props"][K]["type"]["typeName"];
        primType: undefined;
        init: any;
      }
    : T["props"][K] extends DefFile
    ? {
        format: `file`;
        typeName: undefined;
        primType: undefined;
        init: any;
      }
    : never;
};
export type FormatToTs<T extends ObjFormats> = {
  [K in keyof T & string]: FormatToTsType<K, T>;
};
export type ObjPropsToObjFormats<
  T extends DefObj[`props`],
  D extends DefObj[`props`],
> = {
  [K in keyof T as T[K] extends DefMany
    ? T[K][`type`][`typeName`]
    : never]: T[K] extends DefMany ? ObjToFormat<T[K][`type`]> : never;
} & UnionToIntersection<
  {
    [K in keyof T]: T[K] extends DefMany
      ? ObjPropsToObjFormats<T[K][`type`][`props`], D>
      : never;
  }[keyof T]
>;
