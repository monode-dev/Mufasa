import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence,
  onSnapshot,
  updateDoc,
  DocumentReference,
  collection,
  addDoc,
  deleteDoc,
  where,
  query,
  getDocs,
  doc,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import {
  deleteFileFromIndexedDB,
  readFileFromIndexedDB,
  writeFileToIndexedDB,
} from "./IndexedDBFileSystem";

const firebaseConfig = {
  apiKey: "AIzaSyDt4S19UxISNKFacXXAQl0I2drGfStspD0",
  authDomain: "ninety-percent.firebaseapp.com",
  projectId: "ninety-percent",
  storageBucket: "ninety-percent.appspot.com",
  messagingSenderId: "341748622809",
  appId: "1:341748622809:web:a114f74a7c325fc68de5c8",
};

const firebasApp = initializeApp(firebaseConfig);
export const firebaseDb = initializeFirestore(firebasApp, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
try {
  // TODO: Overide indexedDB persistence to use capacitor storage
  enableIndexedDbPersistence(firebaseDb)
    .then(() => {
      // Offline persistence enabled successfully
    })
    .catch((err) => {
      // Error enabling offline persistence
    });
  // initializeDb() {
  //   this.indexedDB = new NgxIndexedDB(this.DB_NAME, this.DB_VERSION);
  //   return this.indexedDB.openDatabase(this.DB_VERSION, evt => {
  //      ...
  //   });
  // }
} catch (err) {
  // console.log(err);
}

function defineLocalCache() {
  return defineStore("MufasaCache", () => {
    const cache: {
      [collection: string]: {
        [docPath: string]: {
          [propName: string]: number | string | boolean | null;
        };
      };
    } = {};
    const objectSubscriptions: {
      [collection: string]: any[]
    } = {};
    return {
      createObject(typeName: string, initParams: { [key: string]: any }) {},
      deleteObject(typeName: string, objectPath: string) {},
      listObjects(typeName: string, parent: DocumentReference | undefined) {},
      getPropValue(typeName: string, objectPath: string, propName: string) {},
      setPropValue(
        typeName: string,
        objectPath: string,
        propName: string,
        newValue: any,
      ) {},
    };
  });
}
