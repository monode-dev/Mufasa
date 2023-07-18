import { FirebaseApp } from "firebase/app";
import {
  type Firestore,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
  collection,
  setDoc,
} from "firebase/firestore";
import { RemoteDb } from "./MxDB";

export function getFirestoreSync(firestore: Firestore): RemoteDb {
  return {
    async createRow(table: string, data: any) {
      return (
        await addDoc(collection(firestore, table), {
          ...data,
          mx_lastUpdated: serverTimestamp(),
        })
      ).path;
    },
    async updateRow(table: string, id: string, data: any) {
      return updateDoc(doc(firestore, table, id), {
        ...data,
        mx_lastUpdated: serverTimestamp(),
      });
    },
    async deleteRow(table: string, id: string) {
      return setDoc(doc(firestore, table, id), {
        mx_isDeleted: true,
        mx_lastUpdated: serverTimestamp(),
      });
    },
    // We want to watch all the collections that have changes since like 10 seconds before a certain timestamp. We also want to record the greatest timestamp we've seen so far.
    // async watchDocsUpatedAfterTimestamp(watcer: (changes: any) => void) {},
  };
}
