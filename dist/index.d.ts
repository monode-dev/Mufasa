import { _Doc, _DocSpecificProps, _List } from "./Implement";
export type Doc<T extends {} = {}> = _Doc<T>;
export type List<T extends _Doc<{}> = _Doc<{}>> = _List<T>;
export * from "./Implement";
export * from "./FirestoreSync";
export * from "./utils";
export * from "./Experimental/TreeApi";
/** Defines a prop of the specified primitive type. */
export declare function prim<T extends number | string | boolean>(
/** TODO: We might consider using Number, String, or Boolean as the first parameter
 * instead. */
defaultValue: T | null | (() => T | null)): {
    format: "prim";
    refTypeName: undefined;
    primType: T;
    isList: false;
    isDefining: false;
    defaultValue: T | (() => T | null) | null;
};
/** Defines a prop that references a doc. */
export declare function refTo<T extends string>(table: T, defaultValue?: string | null): {
    format: "one";
    refTypeName: T;
    primType: undefined;
    isList: false;
    isDefining: false;
    defaultValue: string | null;
};
/** Defines a list of docs that point back to this doc. */
export declare function listOf<T extends string>(table: T): {
    format: "many";
    refTypeName: T;
    primType: undefined;
    isList: true;
    isDefining: true;
    defaultValue: undefined;
};
/** Defines a prop that references a file. */
export declare function file(defaultValue?: string | null): {
    format: "file";
    refTypeName: undefined;
    primType: undefined;
    isList: false;
    isDefining: false;
    defaultValue: string | null;
};
/** Unwraps a doc type without the doc specific props. */
export type Local<T extends Doc> = Omit<T, keyof _DocSpecificProps>;
