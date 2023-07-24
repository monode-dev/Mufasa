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
export type ColSchema = {
  /** Use undefined to represent a primitive. */
  tableName: string | undefined;
  explicitType: number | string | boolean | undefined;
  isList: boolean;
  isDefining: boolean;
  defaultValue: string | number | boolean | null | [];
  /** NOTE: We might consier adding an `isNullable` feature at some point, but right now
   * it is easier to just make everything nullabel. */
  /** NOTE: We at some point might consier adding a field like `addThisColumnToOlderVersion`
   * to handle reving between schema versions. I'm not 100% sure how this would work though.
   * we can come back to it at a future date. */
};
/** Defines a column of the specified primitive type. */
export function prim<T extends number | string | boolean>(
  /** TODO: We might consider using Number, String, or Boolean as the first parameter
   * instead. */
  defaultValue: T | null,
) {
  return {
    tableName: undefined,
    explicitType: {} as T,
    isList: false,
    isDefining: false,
    defaultValue: defaultValue as T | null,
  } satisfies ColSchema;
}
/** Defines a column that references a single row in a table. */
export function refTo<T extends string>(table: T) {
  return {
    tableName: table,
    explicitType: undefined,
    isList: false,
    isDefining: false,
    defaultValue: null,
  } satisfies ColSchema;
}
/** Defines a list of rows in a table that point back to this row. */
export function listOf<T extends string>(table: T) {
  return {
    tableName: table,
    explicitType: undefined,
    isList: true,
    isDefining: true,
    defaultValue: [],
  } satisfies ColSchema;
}

// SECTION: TS Types
type RowListTsType<T extends RowTsType> = ImmutableList<T> & {
  add(params: _CreateParamsForRow<T>): T;
  /** TODO: Provide maunual sorting via the timestamp & position method. We might have to put a
   * `-` in front of position to track whether the movement was down or up. */
};
type ImmutableList<T> = {
  readonly length: {
    get(): number;
  };
  [Symbol.iterator](): IterableIterator<T>;
  // TODO: Figure out sort
  // sort(filterFn: (element: T) => boolean): ImmutableList<T>;
  filter(fn: (element: T) => boolean): ImmutableList<T>;
  map<R>(fn: (element: T) => R): ImmutableList<R>;
};
type _CreateParamsForRow<T extends RowTsType> = Partial<T> & {
  [Key in keyof _RowSpecificProps]: never;
};
type RowTsType<
  TypeName extends string = string,
  D extends TableSchemaDict = {},
> = _RowSpecificProps & {
  [K in keyof D[TypeName]]: D[TypeName][K][`tableName`] extends string
    ? D[TypeName][K][`isList`] extends true
      ? RowListTsType<RowTsType<D[TypeName][K][`tableName`], D>>
      : RowTsType<D[TypeName][K][`tableName`], D>
    : {
        get(): D[TypeName][K][`explicitType`] | null;
        set(newValue: D[TypeName][K][`explicitType`]): void;
      };
};
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

// SECTION: Reactivity
export type CreateSignal = <T>(params: T) => {
  value: T;
};
export type SubscribeToCurrentScopeDispose = (fn: () => void) => void;

// SECTION: Remote DB API
export type RemoteDb = {
  createRow(table: string, data: any): Promise<string>;
  updateRow(table: string, id: string, data: any): Promise<void>;
  deleteRow(table: string, id: string): Promise<void>;
};

// SECTION: createMxDB
export function createMxDB<
  DbName extends string,
  // RootSchema extends TableSchema,
  D extends TableSchemaDict,
>(createParams: {
  name: DbName;
  // remoteDb: RemoteDb;
  // createSignal: CreateSignal;
  // subscribeToCurrentScopeDispose: SubscribeToCurrentScopeDispose;
  // rootSchema: RootSchema; // Disallow anything other than defining lists of structs
  tableSchemas: D;
}) {
  // TODO: Load data from disk and store it in local db

  // TODO: Start sync with remote db

  return {
    // TODO: Implement proxies for local db
    getDB() {}, //: RowTsType<RootSchema, D>

    // TODO: Extract TS types from schema
    get types() {
      return {} as {
        [K in keyof D & string]: RowTsType<K, D>;
      };
    },
  };
}
