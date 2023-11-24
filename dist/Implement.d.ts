import { FirebaseOptions } from "firebase/app";
import { SchemaDictToTsType, SchemaToTsType, TypeSchemaDict, RootSchema } from "./Parse";
import { LocalCache } from "./LocalCache";
import { GetClientStorage } from "./ClientStorage/ClientStorage";
export type Computed<T> = {
    get value(): T;
};
export type Signal<T> = {
    set value(newValue: T);
} & Computed<T>;
declare let _computed: <T>(compute: () => T) => Computed<T>;
declare let _signal: <T>(initialValue: T) => Signal<T>;
declare let _isSignal: (obj: any) => obj is Signal<any>;
declare let _watchEffect: (effect: () => void) => void;
export type _Doc<T extends {} = {}> = {
    [K in keyof T]: T[K] | undefined;
} & _DocSpecificProps;
export type _DocSpecificProps = {
    readonly _id: string | null | undefined;
    readonly isLoaded: boolean;
    readonly isDeleted: boolean;
    deleteDoc(): Promise<void>;
};
export declare function docProx<TypeName extends string, F extends TypeSchemaDict, T extends _Doc<{}> = SchemaToTsType<TypeName, F>>(docId: string | null | undefined, typeName: TypeName, objFormats: F, localCache: LocalCache): T;
export type _List<T extends _Doc> = {
    [Symbol.iterator]: () => IterableIterator<T>;
    readonly length: number;
    filter(filterFn: (doc: T) => boolean): _List<T>;
    map<R>(mapFn: (doc: T) => R): Array<R>;
    add(params: Partial<T>): T;
};
export declare function _defineAppDataStructure<RS extends RootSchema, TSD extends TypeSchemaDict>(modelName: string, firebaseOptions: FirebaseOptions, reactivity: {
    computed: typeof _computed;
    signal: typeof _signal;
    isSignal: typeof _isSignal;
    watchEffect: typeof _watchEffect;
}, options: {
    isProduction: boolean;
    getClientStorage: GetClientStorage;
    rootSchema: RS;
    typeSchemas: TSD;
}): {
    auth: import("@firebase/auth").Auth;
    signInWithGoogle: () => Promise<void>;
    getAppData: () => { [K in keyof RS]: _List<SchemaToTsType<NonNullable<RS[K]["refTypeName"]>, TSD>>; };
    types: SchemaDictToTsType<TSD>;
};
export {};
