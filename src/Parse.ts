import { _Doc, _List } from "./Implement";

// App Data Structure
export type RootSchema = {
  [propName: string]: PropSchema & {
    format: `many`;
    refTypeName: string;
    isList: true;
    isDefining: true;
  };
};
export type TypeSchemaDict = {
  [typeName: string]: TypeSchema;
};
export type TypeSchema = {
  [propName: string]: PropSchema;
};
export type PropSchema = {
  format: `prim` | `one` | `many` | `file`;
  refTypeName: string | undefined;
  primType: number | boolean | string | null | undefined; // | binary
  isList: boolean;
  isDefining: boolean;
  defaultValue: any;
};

export type UPLOADING_FILE = typeof UPLOADING_FILE;
export const UPLOADING_FILE = { mx_unad: `UploadingFile` } as const;
export function is_UPLOADING_FILE(value: any): value is UPLOADING_FILE {
  return value?.mx_unad === UPLOADING_FILE.mx_unad;
}
export type SchemaToTsType<
  TypeName extends string,
  Dict extends TypeSchemaDict,
> = _Doc<{
  -readonly [K in keyof Dict[TypeName]]: Dict[TypeName][K][`format`] extends `prim`
    ? Dict[TypeName][K][`primType`] | null
    : Dict[TypeName][K][`format`] extends `file`
    ? Promise<string | null> | null | typeof UPLOADING_FILE | string
    : Dict[TypeName][K][`format`] extends `one`
    ? Dict[TypeName][K][`refTypeName`] extends string
      ? SchemaToTsType<Dict[TypeName][K][`refTypeName`], Dict> | null
      : never
    : Dict[TypeName][K][`format`] extends `many`
    ? Dict[TypeName][K][`refTypeName`] extends string
      ? _List<SchemaToTsType<Dict[TypeName][K][`refTypeName`], Dict>>
      : never
    : never;
}>;
export type SchemaDictToTsType<T extends TypeSchemaDict> = {
  [K in keyof T & string]: SchemaToTsType<K, T>;
};
