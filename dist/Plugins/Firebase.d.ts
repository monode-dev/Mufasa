import { CollectionReference, QueryFilterConstraint } from "firebase/firestore";
import { GlobalDocPersister, GlobalFilePersister } from "../DocStore.js";
import { StorageReference } from "firebase/storage";
export declare function firestoreDocPersister(collectionRef: CollectionReference, ...queryConstraints: QueryFilterConstraint[]): GlobalDocPersister;
export declare function firebaseFilePersister(getStorageRef: (fileId: string) => StorageReference): GlobalFilePersister;
