"use strict";
// import {
//   collection,
//   doc,
//   getFirestore,
//   initializeFirestore,
// } from "firebase/firestore";
// import { FirebaseOptions, initializeApp } from "firebase/app";
// import { exists, globalStore } from "../utils";
// import { GetClientStorage } from "../ClientStorage/ClientStorage";
// import { createCache } from "../LocalCache";
Object.defineProperty(exports, "__esModule", { value: true });
// export type ReactVarReadOnly<T> = {
//   get(): T;
// };
// export type ReactVarWriteOnly<T> = {
//   set(newValue: T): void;
// };
// export type ReactVar<T> = ReactVarReadOnly<T> & ReactVarWriteOnly<T>;
// export type CreateReactiveVar = <T>(initValue: T) => ReactVar<T>;
// export type CreateFormula = <T>(evaluate: () => T) => ReactVarReadOnly<T>;
// export function initializeMufasa(props: {
//   modelName: string;
//   isProduction: boolean;
//   reactivity: {
//     createFormula: CreateFormula;
//     createReactiveVar: CreateReactiveVar;
//   };
//   firebaseOptions: FirebaseOptions;
//   getClientStorage: GetClientStorage;
// }) {
//   const firebaseApp = initializeApp(props.firebaseOptions);
//   const firestoreDb = getFirestore(firebaseApp);
//   function getCollectionName(typeName: string): string {
//     return `${props.isProduction ? `Prod` : `Dev`}_${typeName}`;
//   }
//   const getAppData = globalStore(props.modelName, () => {
//     const localCache = createCache({
//       typeSchemas: options.typeSchemas,
//       getCollectionName,
//       firebaseApp,
//       firestoreDb,
//       _signal: <T>(initValue: T) => {
//         const reactVar = props.reactivity.createReactiveVar(initValue);
//         return {
//           _isSig: true,
//           get value() {
//             return reactVar.get();
//           },
//           set value(newValue) {
//             reactVar.set(newValue);
//           },
//         };
//       },
//       getClientStorage: props.getClientStorage,
//       isProduction: props.isProduction,
//     });
//   });
// }
// export function prop<T>(initValue: T) {
//   let value = initValue;
//   return {
//     get() {
//       return value;
//     },
//     set(newValue: T) {
//       value = newValue;
//     },
//   };
// }
// function listFrom<T extends abstract new (...args: any) => any>(
//   type: T,
//   name: keyof InstanceType<T>,
// ) {
//   return ``;
// }
// const firebase = initializeApp({
//   apiKey: "",
//   authDomain: "dataplate-08-19-2023.firebaseapp.com",
//   projectId: "dataplate-08-19-2023",
//   storageBucket: "dataplate-08-19-2023.appspot.com",
//   messagingSenderId: "629602986618",
//   appId: "1:629602986618:web:dd9d9178c6e3de5f4669c3",
//   measurementId: "G-MNEDY8QFDG",
// });
// const firestore = initializeFirestore(firebase, {});
// const sessionDb = (() => {
//   const docCollections: {
//     [typeName: string]: {
//       [docId: string]: MfsObj;
//     };
//   } = {};
//   return {};
// })();
// abstract class MfsObj {
//   /*** This can be overridden to manually specify a type name. */
//   static get $mfsTypeName() {
//     return this.name;
//   }
//   get $mfsTypeName() {
//     return (this.constructor as typeof MfsObj).$mfsTypeName;
//   }
//   private _$mfsId: string = ``;
//   get $mfsId() {
//     return this._$mfsId;
//   }
//   static docCollections: {
//     [collectionName: string]: {
//       [docId: string]: MfsObj;
//     };
//   } = {};
//   static create<T extends typeof MfsObj>(this: T): InstanceType<T> {
//     // Create a new instance of the child class.
//     const childInstance = new (this as any)();
//     // Add the new instance to the docCollections.
//     const typeName = this.$mfsTypeName;
//     childInstance._id = doc(collection(firestore, typeName)).id;
//     if (!exists(MfsObj.docCollections[typeName])) {
//       MfsObj.docCollections[typeName] = {};
//     }
//     MfsObj.docCollections[typeName][childInstance._id] = childInstance;
//     // Return the new instance.
//     return childInstance;
//   }
// }
// abstract class MfsSession {}
// abstract class MfsLocal {}
// abstract class MfsGlobal {}
// class Client extends MfsObj {
//   name = prop(`Unnamed`);
//   assets = listFrom(Asset, `client`);
// }
// class Asset extends MfsObj {
//   name = prop(``);
//   client = prop(Client);
//   notes = listFrom(Note, `asset`);
//   pictures = listFrom(Picture, `asset`);
// }
// class Note extends MfsObj {
//   name = prop(``);
//   asset = prop(Asset);
// }
// class Picture extends MfsObj {
//   name = prop(``);
//   asset = prop(Asset);
// }
// const client = Client.create();
// client.name.set(`Bob`);
// console.log(client.name.get());
// console.log(Client.$mfsTypeName);
