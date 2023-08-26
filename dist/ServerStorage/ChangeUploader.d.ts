import { Firestore } from "firebase/firestore";
import { GetClientStorage } from "../ClientStorage/ClientStorage";
import { DocData } from "../LocalCache";
import { FirebaseApp } from "firebase/app";
export declare function loadChangeUploader(firestoreDb: Firestore, firebaseApp: FirebaseApp, getClientStorage: GetClientStorage): {
    uploadDocChange(change: {
        shouldOverwrite: boolean;
        docId: string;
        data: DocData;
    }): Promise<void>;
    uploadFileChange(params: {
        docId: string;
        propName: string;
        newFileId: string;
        oldFileId?: string;
        notifyUploadStarted: () => void;
    }): Promise<void>;
    deleteFile(params: {
        fileId: string;
    }): Promise<void>;
    isFileUploading(params: {
        docId: string;
        propName: string;
        fileId: string;
    }): boolean;
};
