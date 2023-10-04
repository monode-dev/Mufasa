import { FirebaseOptions } from "firebase/app";
import { SchemaDictToTsType, SchemaToTsType, TypeSchemaDict, RootSchema } from "./Parse";
import { LocalCache } from "./LocalCache";
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
    getPropFilePath(propName: string): string | null;
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
export type MfsFileSystem = {
    readFile: (path: string) => Promise<string | undefined>;
    writeFile: (path: string, data: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
    getFilePath: (path: string) => string;
};
export declare function _defineAppDataStructure<RS extends RootSchema, TSD extends TypeSchemaDict>(modelName: string, options: {
    isProduction: boolean;
    reactivity: {
        computed: typeof _computed;
        signal: typeof _signal;
        isSignal: typeof _isSignal;
        watchEffect: typeof _watchEffect;
    };
    firebaseOptions: FirebaseOptions;
    fileSystem: MfsFileSystem;
    rootSchema: RS;
    typeSchemas: TSD;
}): {
    getAppData: () => { [K in keyof RS]: _List<SchemaToTsType<NonNullable<RS[K]["refTypeName"]>, TSD>>; };
    types: SchemaDictToTsType<TSD>;
};
export {};
