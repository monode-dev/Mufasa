// SECTION: Schema Types
export type TableSchemaDict = {
  [key: string]: TableSchema;
};
export type TableSchema = {
  [key: string]: ColSchema;
};
/** The general idea Here is to be overly broad, and then only allow the configurations we
 * suppot via the definition functions. I know this isn't the best approach since internally
 * it looks like we support cases we don't, but it's the easiest way I can think of to start
 * this project. */
export type ColSchema<T extends number | string | boolean | undefined = any> = {
  /** Use null to represent a primitive. */
  tableName: string | null;
  isList: boolean;
  isDefining: boolean;
  default: string | number | boolean | null | [];
  explicitType: T;
  /** NOTE: We might consier adding an `isNullable` feature at some point, but right now
   * it is easier to just make everything nullabel. */
  /** NOTE: We at some point might consier adding a field like `addThisColumnToOlderVersion`
   * to handle reving between schema versions. I'm not 100% sure how this would work though.
   * we can come back to it at a future date. */
};
/** Defines a column of the specified primitive type. */
export function prim<T extends number | string | boolean>(
  defaultValue: T | null,
): ColSchema<T> {
  return {
    tableName: null,
    isList: false,
    isDefining: false,
    default: defaultValue,
    explicitType: {} as T,
  };
}
/** Defines a column that references a single row in a table. */
export function refTo(table: string): ColSchema<undefined> {
  return {
    tableName: table,
    isList: false,
    isDefining: false,
    default: null,
    explicitType: undefined,
  };
}
/** Defines a list of rows in a table that point back to this row. */
export function listOf(table: string): ColSchema<undefined> {
  return {
    tableName: table,
    isList: true,
    isDefining: true,
    default: [],
    explicitType: undefined,
  };
}

// SECTION: TS Types
type RowListTsType<T extends RowTsType> = {
  length: {
    value: number;
  };
  add(params: _CreateParamsForRow<T>): Promise<T>;
  /** TODO: Provide auto sorting via the timestamp & position method. We might have to put a
   * `-` in front of position to track whether the movement was down or up. */
};
type _CreateParamsForRow<T extends RowTsType> = Partial<T> & {
  [Key in keyof _RowSpecificProps]: never;
};
type RowTsType<T extends TableSchema = {}, D extends TableSchemaDict = {}> = {
  [K in keyof T]: T[K] | undefined;
} & _RowSpecificProps;
/** These props show up on all rows and add utility functionality to them. */
type _RowSpecificProps = {
  /** The unique id of this row. */
  readonly _id: string;
  /** When defiend this references another row that has this object in a defining list. */
  readonly mx_parentId: string | undefined;
  /** We don't delete rows, just empty their columns and add an mx_isDeleted field. */
  readonly isDeleted: boolean;
  /** Is true when this row is accesable in the local db, and has not been deleted. */
  readonly isLoaded: boolean;
  /** Deletes this row. */
  deleteSelf(): Promise<void>;
};

// SECTION: createMxDB
export type CreateSignal = <T>(params: T) => {
  value: T;
};
export type SubscribeToCurrentScopeDispose = (fn: () => void) => void;
export function createMxDB<
  DbName extends string,
  RootSchema extends TableSchema,
  D extends TableSchemaDict,
>(createParams: {
  name: DbName;
  // createSignal: CreateSignal;
  // subscribeToCurrentScopeDispose: SubscribeToCurrentScopeDispose;
  rootSchema: RootSchema; // Disallow anything other than defining lists of structs
  tableSchemas: D;
}) {
  // Load data from disk and store it in local db

  // Start sync with remote db

  return {
    getDB() {},
    get types() {
      return {} as RowTsType<RootSchema, D>;
    },
  };
}
