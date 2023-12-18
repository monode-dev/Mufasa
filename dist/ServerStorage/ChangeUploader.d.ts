import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { GetClientStorage } from "../ClientStorage/ClientStorage";
import { DocData } from "../LocalCache";
export declare function loadChangeUploader(firestoreDb: Firestore | null, getClientStorage: GetClientStorage, serverFileStorage: FirebaseStorage | null, newDocPath: (collectionName: string) => string, updateSessionStorage: (params: {
    typeName: string;
    docId: string;
    props: {
        [propName: string]: number | string | boolean | null | undefined;
    };
}) => Promise<void>): {
    uploadDocChange(change: {
        shouldOverwrite: boolean;
        docId: string;
        data: DocData;
    }): Promise<void>;
    uploadFileChange(params: {
        typeName: string;
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
