import { Firestore } from "firebase/firestore";
import { TypeSchemaDict } from "./Parse";
import { Signal } from "./Implement";
import { FirebaseApp } from "firebase/app";
import { GetClientStorage } from "./ClientStorage/ClientStorage";
export declare const CHANGE_DATE_KEY = "mx_changeDate";
export declare const DELETED_KEY = "mx_deleted";
export declare const MX_PARENT_KEY = "mx_parent";
export type DocData = {
    [propName: string]: number | string | boolean | null | undefined;
};
export type LocalCache = ReturnType<typeof createCache>;
export declare function createCache({ typeSchemas, getCollectionName, firebaseApp, firestoreDb, _signal, getClientStorage, isProduction, }: {
    typeSchemas: TypeSchemaDict;
    getCollectionName: (typeName: string) => string;
    firebaseApp: FirebaseApp;
    firestoreDb: Firestore;
    _signal: (initValue: any) => Signal<any>;
    getClientStorage: GetClientStorage;
    isProduction: boolean;
}): {
    listAllObjectsOfType(typeName: string): string[];
    checkExists(typeName: string, docId: string | null | undefined): boolean;
    getChildDocs(childType: string, parentId: string): string[];
    getPropValue(typeName: string, docId: string, propName: string): string | number | boolean | {
        readonly mx_unad: "UploadingFile";
    } | Promise<string | undefined> | null | undefined;
    addDoc(typeName: string, props: {
        [propName: string]: any;
    }): string;
    setPropValue(typeName: string, docId: string, propName: string, value: any): Promise<void>;
    deleteDoc(typeName: string, docId: string): void;
};
