// import { defineStore } from "pinia";
// import { initializeApp } from "firebase/app";
// import {
//   initializeFirestore,
//   CACHE_SIZE_UNLIMITED,
//   enableIndexedDbPersistence,
//   onSnapshot,
//   updateDoc,
//   doc,
//   DocumentReference,
//   collection,
//   addDoc,
//   deleteDoc,
//   Unsubscribe,
//   where,
//   query,
//   getDocs,
// } from "firebase/firestore";
// import {
//   ComputedRef,
//   Ref,
//   UnwrapRef,
//   computed,
//   isRef,
//   ref,
//   watchEffect,
// } from "vue";
// import { exists } from "./utils";

// const firebaseConfig = {
//   apiKey: "AIzaSyDt4S19UxISNKFacXXAQl0I2drGfStspD0",
//   authDomain: "ninety-percent.firebaseapp.com",
//   projectId: "ninety-percent",
//   storageBucket: "ninety-percent.appspot.com",
//   messagingSenderId: "341748622809",
//   appId: "1:341748622809:web:a114f74a7c325fc68de5c8",
// };

// const app = initializeApp(firebaseConfig);
// export const firebaseDb = initializeFirestore(app, {
//   cacheSizeBytes: CACHE_SIZE_UNLIMITED,
// });
// try {
//   // TODO: Overide indexedDB persistence to use capacitor storage
//   enableIndexedDbPersistence(firebaseDb)
//     .then(() => {
//       // Offline persistence enabled successfully
//     })
//     .catch((err) => {
//       // Error enabling offline persistence
//     });
//   // initializeDb() {
//   //   this.indexedDB = new NgxIndexedDB(this.DB_NAME, this.DB_VERSION);
//   //   return this.indexedDB.openDatabase(this.DB_VERSION, evt => {
//   //      ...
//   //   });
//   // }
// } catch (err) {
//   // console.log(err);
// }

// const countDoc = doc(firebaseDb, `count`, `count`);
// const _count = ref(0);
// onSnapshot(countDoc, (querySnapshot) => {
//   const newCount = querySnapshot?.data()?.count;
//   if (newCount !== undefined) {
//     _count.value = newCount;
//   }
// });
// export const count = computed(() => _count.value);

// export function incCount() {
//   const newCount = count.value + 1;
//   updateDoc(countDoc, {
//     count: newCount,
//   });
// }

// // Object
// export type LOADING = null;
// export const LOADING: LOADING = null;
// export type DELETED = undefined;
// export const DELETED: DELETED = undefined;
// export type Doc<T extends {} = {}> = {
//   [K in keyof T]: T[K] extends number | string | boolean
//     ? T[K]
//     : T[K] | LOADING | DELETED;
// } & DocSpecificProps;
// export type DocSpecificProps = {
//   readonly _firestoreRef: DocumentReference | null | undefined;
//   readonly isLoaded: boolean;
//   readonly isDeleted: boolean;
//   deleteDoc(): Promise<void>;
// };
// export function docProx<T extends Doc<{}>>(
//   docRef:
//     | DocumentReference
//     | Promise<DocumentReference | null | undefined>
//     | null
//     | undefined,
//   typeName: string,
//   objFormats: ObjFormats,
// ): T {
//   const data = ref<T | null | undefined>(null);
//   function getFireStoreRef() {
//     if (exists(docRef) && `path` in docRef) {
//       return docRef;
//     } else {
//       return undefined;
//     }
//   }
//   function isDeleted() {
//     return data.value === undefined;
//   }
//   function isLoaded() {
//     return data.value !== null && data.value !== undefined;
//   }
//   (async () => {
//     const unpromisedDocRef = await docRef;
//     if (!exists(unpromisedDocRef)) {
//       data.value = unpromisedDocRef;
//     } else {
//       onSnapshot(unpromisedDocRef, (doc) => {
//         data.value = doc.data() as UnwrapRef<T> | null | undefined;
//       });
//     }
//   })();
//   return (() => {
//     // Add the doc specific properties
//     let proxy: { [key: string]: any } = {
//       get _firestoreRef() {
//         return getFireStoreRef();
//       },
//       get isLoaded() {
//         return isLoaded();
//       },
//       get isDeleted() {
//         return isDeleted();
//       },
//       async deleteDoc() {
//         const actualDocRef = await docRef;
//         if (exists(actualDocRef)) {
//           // Delete all sub docs
//           for (const format of Object.values(objFormats[typeName])) {
//             if (format.format === `own`) {
//               const collectionRef = collection(firebaseDb, format.type!);
//               const docs = await getDocs(
//                 query(
//                   collectionRef,
//                   where(`mx_parent`, "==", actualDocRef.path),
//                 ),
//               );
//               docs.forEach((doc) => deleteDoc(doc.ref));
//             }
//           }
//           await deleteDoc(actualDocRef);
//         }
//       },
//     };

//     // Add getters and setters for each property
//     for (let [propKey, format] of Object.entries(objFormats[typeName])) {
//       Object.defineProperty(
//         proxy,
//         propKey,
//         format.format === `ref`
//           ? newOnePropProx(
//               propKey,
//               objFormats,
//               format.type!,
//               data,
//               getFireStoreRef,
//             )
//           : format.format === `own`
//           ? newManyPropProx(format.type!, objFormats, getFireStoreRef)
//           : newPrimPropProx(propKey, data, getFireStoreRef),
//       );
//     }

//     return proxy as T;
//   })();
// }
// export type GetDocType<T extends { create: (...args: any) => Doc<{}> }> =
//   ReturnType<T["create"]>;
// export type Obj = {
//   typeName: string;
//   props: {
//     [key: string]: Prim | One<string> | Many /* | One | Many */;
//   };
// };
// export function obj<T extends Obj>(objDef: T) {
//   return objDef;
// }
// // type TypeMap = { [typeName: string]: Obj };
// // export type ObjToTsType<T extends Obj, D extends TypeMap> = {
// //   -readonly [K in keyof T["props"]]: T["props"][K] extends Prim<infer R>
// //     ? R
// //     : T["props"][K] extends One<string>
// //     ? Doc<ObjToTsType<D[T["props"][K]["type"]], D>>
// //     : T["props"][K] extends Many
// //     ? List<
// //         Doc<ObjToTsType<T["props"][K][`type`], D>>,
// //         CreateParamsFromObj<T["props"][K][`type`], D>
// //       >
// //     : never;
// // };
// // type PossiblyUndefinedKeys<T> = {
// //   [K in keyof T]: undefined extends T[K] ? K : never;
// // }[keyof T];
// // type MakeUndefiendPropsOptional<T> = Omit<T, PossiblyUndefinedKeys<T>> & {
// //   [K in PossiblyUndefinedKeys<T>]?: T[K];
// // };
// // type CreateParamsFromObj<
// //   T extends Obj,
// //   D extends TypeMap,
// // > = MakeUndefiendPropsOptional<{
// //   [K in keyof T["props"]]: T["props"][K] extends Prim<infer PropType>
// //     ? PropType | undefined
// //     : T["props"][K] extends One<string>
// //     ? Doc<ObjToTsType<D[T["props"][K]["type"]], D>> | null | undefined
// //     : T["props"][K] extends Many
// //     ?
// //         | Doc<ObjToTsType<D[T["props"][K][`type`][`typeName`]], D>>
// //         | null
// //         | undefined
// //     : never;
// // }>;

// // Primitive
// export type PrimTsType = number | boolean | string /* | binary */ | null;
// export type Prim<T extends PrimTsType = PrimTsType> = {
//   type: `primitive`;
//   init: PrimInitTsType<T>;
// };
// export type PrimInitTsType<T extends PrimTsType> =
//   | T
//   | (() => PrimTsType)
//   | undefined;
// export type RequireOnCreate = true;
// export function prim<T extends PrimTsType>(init: PrimInitTsType<T>): Prim<T> {
//   return {
//     type: `primitive`,
//     init,
//   };
// }
// function newPrimPropProx(
//   propKey: string,
//   data: Ref<any>,
//   getFireStoreRef: () => DocumentReference | undefined,
// ) {
//   return {
//     get: function () {
//       return data.value?.[propKey];
//     },
//     set: function (newValue: any) {
//       const actualDocRef = getFireStoreRef();
//       if (exists(actualDocRef)) {
//         updateDoc(actualDocRef, {
//           [propKey]: newValue,
//         });
//       }
//     },
//   };
// }

// // One
// export type One<T extends string> = {
//   type: T;
//   quantity: `one`;
//   // backRefPropName: string | undefined,
//   init: null | (() => Obj);
// };
// export function one<T extends string>(
//   options: T,
//   init: null | (() => Obj),
// ): One<T> {
//   return {
//     type: options,
//     quantity: `one`,
//     init: init,
//   };
// }
// function newOnePropProx(
//   propKey: string,
//   objFormats: ObjFormats,
//   typeName: string,
//   data: Ref<any>,
//   getFireStoreRef: () => DocumentReference | undefined,
// ) {
//   return {
//     get: function () {
//       const format = objFormats[typeName][propKey];
//       return docProx(
//         data.value?.[propKey] as DocumentReference | null | undefined,
//         format.type!,
//         objFormats,
//       );
//     },
//     set: function (newValue: any) {
//       (async () => {
//         const actualDocRef = getFireStoreRef();
//         if (exists(actualDocRef)) {
//           updateDoc(actualDocRef, {
//             [propKey]: newValue?._firestoreRef ?? null,
//           });
//         }
//       })();
//     },
//   };
// }

// // Many
// export type Many<T extends Obj = Obj> = {
//   type: T; // | string,
//   quantity: `many`;
//   // backRefPropName: string | undefined,
//   // quantitySelf: `one` | `many`,
//   // init: [] | FROM_CREATE | (() => ManyParams),
// };
// export function many<T extends Obj>(options: T): Many<T> {
//   return {
//     type: options,
//     quantity: `many`,
//   };
// }
// // function docCollectionFromMany<T extends Obj, D extends TypeMap>(
// //   many: Many<T>,
// //   objFormats: ObjFormats,
// // ) {
// //   type TsType = ObjToTsType<T, D>;
// //   type CreateType = (
// //     createParams: CreateParamsFromObj<T, D>,
// //     mx_parent?: DocumentReference,
// //   ) => TsType;
// //   return newDocCollection<TsType, CreateParamsFromObj<T, D>, CreateType>(
// //     many.type.typeName,
// //     (
// //       createParams: CreateParamsFromObj<T, D>,
// //       mx_parent?: DocumentReference,
// //     ) => {
// //       function getDefaultProps() {
// //         const defaultProps: { [key: string]: any } = {};
// //         const defProps = many.type.props;
// //         for (const key of Object.keys(defProps)) {
// //           const prop = defProps[key];
// //           if (prop.type === `primitive`) {
// //             const init = prop.init;
// //             if (typeof init === `function`) {
// //               defaultProps[key] = init();
// //             } else {
// //               defaultProps[key] = init;
// //             }
// //           }
// //         }
// //         return defaultProps;
// //       }
// //       return {
// //         ...getDefaultProps(),
// //         ...createParams,
// //         ...(mx_parent === undefined ? {} : { mx_parent }),
// //       } as any;
// //     },
// //     objFormats,
// //   );
// // }
// export type List<T extends Doc<{}>> = {
//   [Symbol.iterator]: () => IterableIterator<T>;
//   readonly length: number;
//   filter(filterFn: (doc: T) => boolean): List<T>;
//   map<R>(mapFn: (doc: T) => R): Array<R>;
//   add(params: CreateParamsFromFormat<T>): T;
// };
// // export type List<T extends Doc<{}>, CreateArgs extends any> = {
// //   [Symbol.iterator]: () => IterableIterator<T>;
// //   readonly length: number;
// //   filter(filterFn: (doc: T) => boolean): List<T, CreateArgs>;
// //   map<R>(mapFn: (doc: T) => R): Array<R>;
// //   add(params: CreateArgs): T;
// // };
// function newDocCollection<T extends {}>(
//   typeName: string,
//   objFormats: ObjFormats,
//   propName?: string,
//   mx_parent?: DocumentReference,
// ) {
//   const collectionRef = collection(firebaseDb, typeName);
//   const collectionList = ref<Doc<T>[]>([]);
//   if (propName) {
//     if (mx_parent) {
//       onSnapshot(
//         query(collectionRef, where(`mx_parent`, "==", mx_parent)),
//         (querySnapshot) => {
//           collectionList.value = querySnapshot.docs.map((doc) => {
//             // console.log(doc.ref.path, typeName);
//             return docProx(doc.ref, typeName, objFormats);
//           });
//         },
//       );
//     }
//   } else {
//     onSnapshot(collectionRef, (querySnapshot) => {
//       collectionList.value = querySnapshot.docs.map((doc) =>
//         docProx(doc.ref, typeName, objFormats),
//       );
//     });
//   }
//   return newListFor(collectionList, mx_parent);
//   function newListFor<T extends Doc<{}>>(
//     collectionList: ComputedRef<T[]> | Ref<T[]>,
//     mx_parent?: DocumentReference,
//   ): List<T> {
//     return {
//       [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
//       get length() {
//         return collectionList.value.length;
//       },
//       filter(filterFn: (doc: T) => boolean) {
//         return newListFor(
//           computed(() => collectionList.value.filter(filterFn)),
//         );
//       },
//       map<R>(mapFn: (doc: T) => R) {
//         return collectionList.value.map(mapFn);
//       },
//       add(createParams) {
//         const newDoc = {
//           ...(() => {
//             const defaultProps: { [key: string]: any } = {};
//             for (const [key, propFormat] of Object.entries(
//               objFormats[typeName],
//             )) {
//               if (propFormat.format === `prim`) {
//                 const init = propFormat.init;
//                 if (typeof init === `function`) {
//                   defaultProps[key] = init();
//                 } else {
//                   defaultProps[key] = init;
//                 }
//               }
//             }
//             return defaultProps;
//           })(),
//           ...createParams,
//           ...(mx_parent === undefined ? {} : { mx_parent }),
//         };
//         return docProx<T>(addDoc(collectionRef, newDoc), typeName, objFormats);
//       },
//     };
//   }
// }
// type CreateParamsFromFormat<T extends Doc> = {
//   [K in keyof T]?: K extends keyof DocSpecificProps ? never : T[K];
// };
// // type CreateParamsFromFormat<
// //   T extends string,
// //   F extends ObjFormats,
// // > = {
// //   [K in keyof F[T]]?: F[T][K] extends Prim<infer PropType>
// //     ? PropType
// //     : F[T][K] extends One<string>
// //     ? Doc<FormatToTs<F[T][K]["type"], F>>
// //     : F[T][K] extends Many
// //     ? Doc<FormatToTs<F[T][K][`type`][`typeName`], F>> | null | undefined
// //     : never;
// // };
// export type FormatToTs<T extends string, F extends ObjFormats> = {
//   -readonly [K in keyof F[T]]: F[T][K] extends Prim<infer R>
//     ? R
//     : F[T][K] extends One<string>
//     ? Doc<FormatToTs<F[T][K]["type"], F>>
//     : F[T][K] extends Many
//     ? List<Doc<FormatToTs<F[T][K]["type"], F>>>
//     : never;
// };
// function newManyPropProx(
//   typeName: string,
//   objFormats: ObjFormats,
//   getFireStoreRef: () => DocumentReference | undefined,
// ) {
//   return {
//     get: function () {
//       return newDocCollection(
//         typeName,
//         objFormats,
//         `mx_parent`,
//         getFireStoreRef(),
//       );
//     },
//     set: undefined,
//   };
// }

// // Formula
// // function formula<T, R = any>(compute: (inst: T) => R) {
// //   return computed(compute);
// // }

// // Action
// // function action<T>(doAction: (inst: T) => Promise<void>) {
// //   return doAction;
// // }

// // App Data Structure
// type ObjFormats = {
//   [typeName: string]: {
//     [propName: string]: Prop;
//   };
// };
// type ProtoProp<
//   T extends {
//     format: `prim` | `ref` | `own`;
//     type?: string;
//     quantity: `one` | `many`;
//     init?: any;
//   },
// > = T;
// type Prop =
//   | {
//       format: `prim`;
//       type?: undefined;
//       quantity: `one`;
//       init: any;
//     }
//   | {
//       format: `ref`;
//       type: string;
//       quantity: `one`;
//       init: null | (() => any);
//     }
//   | {
//       format: `own`;
//       type: string;
//       quantity: `many`;
//       init: undefined;
//     };
// // export type AppDataStructure<K extends string> = {
// //   [Key in K]: Many;
// // };
// type DataStructureToTypeMap<T extends Obj[`props`]> = {
//   [K in keyof T as T[K] extends Many
//     ? T[K][`type`][`typeName`]
//     : never]: T[K] extends Many ? T[K][`type`] : never;
// } & UnionToIntersection<
//   {
//     [K in keyof T]: T[K] extends Many
//       ? DataStructureToTypeMap<T[K][`type`][`props`]>
//       : never;
//   }[keyof T]
// >;
// export type UnionToIntersection<U> = (
//   U extends any ? (k: U) => void : never
// ) extends (k: infer I) => void
//   ? I
//   : never;

// // type TypesFromObjProps<
// //   T extends Obj[`props`],
// //   D extends AppDataStructure<string>,
// // > = {
// //   [K in keyof T as T[K] extends Many
// //     ? T[K][`type`][`typeName`]
// //     : never]: T[K] extends Many
// //     ? Doc<ObjToTsType<T[K][`type`], DataStructureToTypeMap<D>>>
// //     : never;
// // } & UnionToIntersection<
// //   {
// //     [K in keyof T]: T[K] extends Many
// //       ? TypesFromObjProps<T[K][`type`][`props`], D>
// //       : never;
// //   }[keyof T]
// // >;
// type ObjPropsToFormats<T extends Obj[`props`]> = {
//   [K in keyof T as T[K] extends Many
//     ? T[K][`type`][`typeName`]
//     : never]: T[K] extends Many ? T[K][`type`][`typeName`] : never;
// } & UnionToIntersection<
//   {
//     [K in keyof T]: T[K] extends Many
//       ? TypesFromObjProps<T[K][`type`][`props`], D>
//       : never;
//   }[keyof T]
// >;
// export function defineAppDataStructure<T extends { [key: string]: Many }>(
//   modelName: string,
//   modelDef: T,
// ) {
//   const objFormats = (() => {
//     return buildObjFormats();
//     function buildObjFormats(allProps: Obj[`props`] = modelDef) {
//       let objFormats: ObjFormats = {};
//       for (const key of Object.keys(allProps)) {
//         const entry = allProps[key];
//         if (`quantity` in entry && entry.quantity === `many`) {
//           const subFormats = buildObjFormats(entry.type.props);
//           objFormats = { ...objFormats, ...subFormats };
//           const propFormats: ObjFormats[string] = {};
//           for (const propName of Object.keys(entry.type.props)) {
//             const prop = entry.type.props[propName];
//             if (prop.type === `primitive`) {
//               propFormats[propName] = {
//                 format: `prim`,
//                 type: undefined,
//                 quantity: `one`,
//                 init: prop.init,
//               };
//             } else if (`quantity` in prop && prop.quantity === `one`) {
//               propFormats[propName] = {
//                 format: `ref`,
//                 type: prop.type,
//                 quantity: `one`,
//                 init: prop.init,
//               };
//             } else {
//               propFormats[propName] = {
//                 format: `own`,
//                 type: prop.type.typeName,
//                 quantity: `many`,
//                 init: undefined,
//               };
//             }
//           }
//           objFormats[entry.type.typeName] = propFormats;
//         }
//       }
//       return objFormats;
//     }
//   })();
//   return {
//     getAppData: defineStore(modelName, () => {
//       const manyCollections: {
//         [K in keyof T]: ReturnType<
//           typeof newDocCollection<
//             Doc<FormatToTs<K & string, typeof objFormats>>
//           >
//         >;
//       } = {} as any;
//       for (const key of Object.keys(modelDef)) {
//         const many = modelDef[key];
//         if (many.type.typeName) {
//           manyCollections[key as keyof typeof manyCollections] =
//             newDocCollection(many.type.typeName, objFormats);
//         }
//       }
//       return manyCollections;
//     }),
//     // mufasaTypes: {} as TypesFromObjProps<T, T>,
//     test: {} as DataStructureToTypeMap<T>,
//   };
// }
