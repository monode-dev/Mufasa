import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence,
  onSnapshot,
  updateDoc,
  doc,
  DocumentReference,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { UnwrapRef, computed, ref } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyDt4S19UxISNKFacXXAQl0I2drGfStspD0",
  authDomain: "ninety-percent.firebaseapp.com",
  projectId: "ninety-percent",
  storageBucket: "ninety-percent.appspot.com",
  messagingSenderId: "341748622809",
  appId: "1:341748622809:web:a114f74a7c325fc68de5c8",
};

const app = initializeApp(firebaseConfig);
export const firebaseDb = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
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

const countDoc = doc(firebaseDb, `count`, `count`);
const _count = ref(0);
onSnapshot(countDoc, (querySnapshot) => {
  const newCount = querySnapshot?.data()?.count;
  if (newCount !== undefined) {
    _count.value = newCount;
  }
});
export const count = computed(() => _count.value);

export function incCount() {
  const newCount = count.value + 1;
  updateDoc(countDoc, {
    count: newCount,
  });
}

// Firestore Utils
export type LOADING = null;
export const LOADING: LOADING = null;
export type DELETED = undefined;
export const DELETED: DELETED = undefined;
export function isLoaded<T>(value: T | LOADING | DELETED): value is T {
  return value !== LOADING && value !== DELETED;
}
export type Doc<T extends {} = {}> = {
  [K in keyof T]: T[K] | LOADING | DELETED;
} & DocSpecificProps;
export type DocSpecificProps = {
  _firestoreRef: DocumentReference;
  isLoaded: boolean;
  isDeleted: boolean;
  deleteDoc(): Promise<void>;
};
export function docProx<T extends Doc<{}>>(
  docRef: DocumentReference | Promise<DocumentReference>,
): T {
  const data = ref<T | LOADING | DELETED>(LOADING);
  (async () => {
    docRef = await docRef;
    onSnapshot(docRef, (doc) => {
      data.value = doc.data() as UnwrapRef<T> | LOADING | DELETED;
    });
  })();
  return new Proxy({} as T, {
    get: (_, prop) => {
      if (prop === "_firestoreRef") {
        return docRef;
      } else if (prop === "isLoaded") {
        return isLoaded(data.value);
      } else if (prop === "isDeleted") {
        return data.value === DELETED;
      } else if (prop === "deleteDoc") {
        return async () => {
          docRef = await docRef;
          deleteDoc(docRef);
        };
      }
      return data.value?.[prop as keyof UnwrapRef<T>];
    },
    set: (_, prop, value) => {
      if (prop === "_firestoreRef") {
        return false;
      }
      (async () => {
        docRef = await docRef;
        updateDoc(docRef, {
          [prop]: value,
        });
      })();
      return true;
    },
  });
}
export function newDocCollection<
  T extends Doc,
  CreateArgs extends any[],
  Create extends (...args: CreateArgs) => Omit<T, keyof DocSpecificProps>,
>(collectionName: string, caster: T, createDoc: Create) {
  const collectionRef = collection(firebaseDb, collectionName);
  const collectionList = ref<T[]>([]);
  onSnapshot(collectionRef, (querySnapshot) => {
    collectionList.value = querySnapshot.docs.map((doc) => docProx(doc.ref));
  });
  return {
    list: collectionList,
    create(...args: CreateArgs) {
      const newDoc = createDoc(...args);
      return docProx<T>(addDoc(collectionRef, newDoc));
    },
  };
}

//
export type ClientId = `${number}` | ``;
export type Client = Doc<{
  name: string;
  clientId: ClientId;
  phoneNumber: string;
  address: string;
  notes: string;
}>;
export type FuelType = Doc<{
  name: string;
  rate: number;
  isVisible: boolean;
  createdPosix: number;
}>;
export const useFirestore = defineStore("firestore", () => {
  const clientDocCollection = newDocCollection(
    `Client`,
    {} as Client,
    (nameOrId: string) => {
      const wasGivenId = !isNaN(Number(nameOrId));
      return {
        name: wasGivenId ? "" : nameOrId,
        clientId: wasGivenId ? (nameOrId as ClientId) : "",
        phoneNumber: "",
        address: "",
        notes: "",
      } satisfies Omit<Client, keyof DocSpecificProps>;
    },
  );
  const fuelTypeDocCollection = newDocCollection(
    `FuelType`,
    {} as FuelType,
    () => {
      return {
        name: ``,
        rate: 0,
        isVisible: true,
        createdPosix: Date.now(),
      } satisfies Omit<FuelType, keyof DocSpecificProps>;
    },
  );
  return {
    clients: clientDocCollection.list,
    createClient: clientDocCollection.create,
    fuelTypes: fuelTypeDocCollection.list,
    createFuelType: fuelTypeDocCollection.create,
  };
});
