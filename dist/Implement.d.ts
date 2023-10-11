import { FirebaseOptions } from "firebase/app";
import { PENDING, NONEXISTENT } from "./utils";
import { SchemaDictToTsType, SchemaToTsType, TypeSchemaDict, RootSchema } from "./Parse";
import { LocalCache } from "./LocalCache";
import { User as FirebaseUser } from "firebase/auth";
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
export declare const MFS_LOCAL_CACHE: unique symbol;
export declare function getLocalCache(): {
    syncType: (typeName: string) => Promise<void>;
    listAllObjectsOfType(typeName: string): string[];
    checkExists(typeName: string, docId: string | null | undefined): boolean;
    getChildDocs(childType: string, parentId: string): string[];
    getPropValue(typeName: string, docId: string, propName: string): string | number | boolean | Promise<string | undefined> | import("./utils").Sym<"INVALID" | "NONEXISTENT"> | {
        readonly mx_unad: "UploadingFile";
    } | {
        value: string | number | boolean | null | undefined;
        typeName: string;
    };
    getFilePath(typeName: string, docId: string, propName: string): string | null;
    addDoc(typeName: string, props: {
        [propName: string]: any;
    }): string;
    setPropValue(typeName: string, docId: string, propName: string, value: string | number | boolean | {
        value: string | number | boolean | null | undefined;
        typeName: string;
    } | null | undefined): Promise<void>;
    createProp<T>(initValue: T): import("./Reactivity").Prop<T>;
    createFormula: <T_1>(evaluate: () => T_1) => import("./Reactivity").PropReader<T_1>;
    deleteDoc(typeName: string, docId: string): void;
};
export type MfsFileSystem = {
    readFile: (path: string) => Promise<string | undefined>;
    writeFile: (path: string, data: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
    getFilePath: (path: string) => string;
};
export type User = FirebaseUser | PENDING | NONEXISTENT;
export declare function initializeMufasa<RS extends RootSchema, TSD extends TypeSchemaDict>(options: {
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
    firebaseUtils: {
        signOut(): void;
        signInWithGoogle(): Promise<void>;
        getUser(): Signal<User>;
        syncType(typeName: string): Promise<void>;
        readonly localCache: {
            syncType: (typeName: string) => Promise<void>;
            listAllObjectsOfType(typeName: string): string[];
            checkExists(typeName: string, docId: string | null | undefined): boolean;
            getChildDocs(childType: string, parentId: string): string[];
            getPropValue(typeName: string, docId: string, propName: string): string | number | boolean | Promise<string | undefined> | import("./utils").Sym<"INVALID" | "NONEXISTENT"> | {
                readonly mx_unad: "UploadingFile";
            } | {
                value: string | number | boolean | null | undefined;
                typeName: string;
            };
            getFilePath(typeName: string, docId: string, propName: string): string | null;
            addDoc(typeName: string, props: {
                [propName: string]: any;
            }): string;
            setPropValue(typeName: string, docId: string, propName: string, value: string | number | boolean | {
                value: string | number | boolean | null | undefined;
                typeName: string;
            } | null | undefined): Promise<void>;
            createProp<T>(initValue: T): import("./Reactivity").Prop<T>;
            createFormula: <T_1>(evaluate: () => T_1) => import("./Reactivity").PropReader<T_1>;
            deleteDoc(typeName: string, docId: string): void;
        };
    };
};
export {};
