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
export type Doc<T> = Partial<T> & DocSpecificProps;
export type DocSpecificProps = {
  _firestoreRef: DocumentReference;
};
export function docProx<T extends Doc<{}>>(docRef: DocumentReference): T {
  const data = ref<T | undefined>(undefined);
  onSnapshot(docRef, (doc) => {
    data.value = doc.data() as UnwrapRef<T>;
  });
  return new Proxy({} as T, {
    get: (_, prop) => {
      if (prop === "_firestoreRef") {
        return docRef;
      }
      return data.value?.[prop as keyof UnwrapRef<T>];
    },
    set: (_, prop, value) => {
      if (prop === "_firestoreRef") {
        return false;
      }
      updateDoc(docRef, {
        [prop]: value,
      });
      return true;
    },
  });
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
export const useFirestore = defineStore("firestore", () => {
  const clientCollection = collection(firebaseDb, `Client`);
  const clientsList = ref<Client[]>([]);
  onSnapshot(clientCollection, (querySnapshot) => {
    clientsList.value = querySnapshot.docs.map((doc) => docProx(doc.ref));
  });
  return {
    clients: clientsList,
    async createClient(nameOrId: string): Promise<Client> {
      const wasGivenId = !isNaN(Number(nameOrId));
      const newClient: Omit<Client, keyof DocSpecificProps> = {
        name: wasGivenId ? "" : nameOrId,
        clientId: wasGivenId ? (nameOrId as ClientId) : "",
        phoneNumber: "",
        address: "",
        notes: "",
      };

      // Create a new client in the database
      return docProx<Client>(await addDoc(clientCollection, newClient));
    },
  };
});
