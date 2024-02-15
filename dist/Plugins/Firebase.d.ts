import { CollectionReference, QueryFilterConstraint } from "firebase/firestore";
import { GlobalDocPersister } from "../DocStore";
import { StorageReference } from "firebase/storage";
import { GlobalFilePersister } from "../FileStore";
export declare function firestoreDocPersister(collectionRef: CollectionReference, ...queryConstraints: QueryFilterConstraint[]): GlobalDocPersister;
export declare function firebaseFilePersister(getStorageRef: (fileId: string) => StorageReference): GlobalFilePersister;
