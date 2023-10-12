import { MfsFileSystem, Signal } from "./Implement";
import { FirebaseApp } from "firebase/app";
import { PersistedFunctionManager } from "./PersistedFunctionManager";
import { Prop, PropReader } from "./Reactivity";
export declare const DELETED_KEY = "mx_deleted";
export declare const MX_PARENT_KEY = "mx_parent";
export type DocData = {
    [propName: string]: PropValue;
};
export type PropValue = string | number | boolean | null | undefined | {
    value: string | number | boolean | null | undefined;
    typeName: string;
};
export type LocalCache = ReturnType<typeof initializeCache>;
export declare function initializeCache({ getCollectionName, firebaseApp, _signal, formula, persistedFunctionManager, fileSystem, isProduction, }: {
    getCollectionName: (typeName: string) => string;
    firebaseApp: FirebaseApp;
    _signal: <T>(initValue: T) => Signal<T>;
    formula: <T>(evaluate: () => T) => PropReader<T>;
    persistedFunctionManager: PersistedFunctionManager;
    fileSystem: MfsFileSystem;
    isProduction: boolean;
}): {
    syncType: (typeName: string) => Promise<void>;
    listAllObjectsOfType(typeName: string): string[];
    checkExists(typeName: string, docId: string | null | undefined): boolean;
    getChildDocs(childType: string, parentId: string): string[];
    getIndexedDocs(typeName: string, propName: string, propValue: string): string[];
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
    indexOnProp(typeName: string, propName: string): Promise<void>;
    createProp<T>(initValue: T): Prop<T>;
    createFormula: <T_1>(evaluate: () => T_1) => PropReader<T_1>;
    deleteDoc(typeName: string, docId: string): void;
};
