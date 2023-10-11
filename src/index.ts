import { _Doc, _DocSpecificProps, _List } from "./Implement";
import { PropSchema } from "./Parse";
export type Doc<T extends {} = {}> = _Doc<T>;
export type List<T extends _Doc<{}> = _Doc<{}>> = _List<T>;
export * from "./Implement";
export * from "./FirestoreSync";
export * from "./utils";

/** Defines a prop of the specified primitive type. */
export function prim<T extends number | string | boolean>(
  /** TODO: We might consider using Number, String, or Boolean as the first parameter
   * instead. */
  defaultValue: T | null | (() => T | null),
) {
  return {
    format: `prim`,
    refTypeName: undefined,
    primType: {} as T,
    isList: false,
    isDefining: false,
    defaultValue: defaultValue as T | null | (() => T | null),
  } satisfies PropSchema;
}
/** Defines a prop that references a doc. */
export function refTo<T extends string>(
  table: T,
  defaultValue: string | null = null,
) {
  return {
    format: `one`,
    refTypeName: table,
    primType: undefined,
    isList: false,
    isDefining: false,
    defaultValue: defaultValue,
  } satisfies PropSchema;
}
/** Defines a list of docs that point back to this doc. */
export function listOf<T extends string>(table: T) {
  return {
    format: `many`,
    refTypeName: table,
    primType: undefined,
    isList: true,
    isDefining: true,
    defaultValue: undefined,
  } satisfies PropSchema;
}
/** Defines a prop that references a file. */
export function file(defaultValue: string | null = null) {
  return {
    format: `file`,
    refTypeName: undefined,
    primType: undefined,
    isList: false,
    isDefining: false,
    defaultValue: defaultValue,
  } satisfies PropSchema;
}

/** Unwraps a doc type without the doc specific props. */
export type Local<T extends Doc> = Omit<T, keyof _DocSpecificProps>;
