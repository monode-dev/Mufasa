import { TypeSchemaDict } from "./Parse";
import { MfsFileSystem, Signal } from "./Implement";
import { FirebaseApp } from "firebase/app";
import { PersistedFunctionManager } from "./PersistedFunctionManager";
export declare const DELETED_KEY = "mx_deleted";
export declare const MX_PARENT_KEY = "mx_parent";
export type DocData = {
    [propName: string]: number | string | boolean | null | undefined;
};
export type LocalCache = ReturnType<typeof initializeCache>;
export declare function initializeCache({ typeSchemas, getCollectionName, firebaseApp, _signal, persistedFunctionManager, fileSystem, isProduction, }: {
    typeSchemas: TypeSchemaDict;
    getCollectionName: (typeName: string) => string;
    firebaseApp: FirebaseApp;
    _signal: <T>(initValue: T) => Signal<T>;
    persistedFunctionManager: PersistedFunctionManager;
    fileSystem: MfsFileSystem;
    isProduction: boolean;
}): {
    listAllObjectsOfType(typeName: string): string[];
    checkExists(typeName: string, docId: string | null | undefined): boolean;
    getChildDocs(childType: string, parentId: string): string[];
    getPropValue(typeName: string, docId: string, propName: string): string | number | boolean | Promise<string | undefined> | {
        readonly mx_unad: "UploadingFile";
    } | null | undefined;
    getFilePath(typeName: string, docId: string, propName: string): string | null;
    addDoc(typeName: string, props: {
        [propName: string]: any;
    }): string;
    setPropValue(typeName: string, docId: string, propName: string, value: any): Promise<void>;
    deleteDoc(typeName: string, docId: string): void;
};
