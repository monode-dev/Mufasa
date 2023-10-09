import { MfsFileSystem, Signal } from "./Implement";
import { FirebaseApp } from "firebase/app";
import { PersistedFunctionManager } from "./PersistedFunctionManager";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";
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
export declare function initializeCache({ getCollectionName, firebaseApp, firestore, firebaseStorage, auth, _signal, persistedFunctionManager, fileSystem, isProduction, }: {
    getCollectionName: (typeName: string) => string;
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    firebaseStorage: FirebaseStorage;
    auth: Auth;
    _signal: <T>(initValue: T) => Signal<T>;
    persistedFunctionManager: PersistedFunctionManager;
    fileSystem: MfsFileSystem;
    isProduction: boolean;
}): {
    syncType(typeName: string): Promise<void>;
    listAllObjectsOfType(typeName: string): string[];
    checkExists(typeName: string, docId: string | null | undefined): boolean;
    getChildDocs(childType: string, parentId: string): string[];
    getPropValue(typeName: string, docId: string, propName: string): Promise<string | undefined> | {
        readonly mx_unad: "UploadingFile";
    } | PropValue;
    getFilePath(typeName: string, docId: string, propName: string): string | null;
    addDoc(typeName: string, props: {
        [propName: string]: any;
    }): string;
    setPropValue(typeName: string, docId: string, propName: string, value: string | number | boolean | {
        value: string | number | boolean | null | undefined;
        typeName: string;
    } | null | undefined): Promise<void>;
    deleteDoc(typeName: string, docId: string): void;
};
