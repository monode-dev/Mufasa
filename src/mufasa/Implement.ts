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
} from "firebase/firestore";
import { ComputedRef, Ref, UnwrapRef, computed, ref } from "vue";
import { exists } from "../utils";
import { DefMany, DefObj } from "./Define";
import {
  CreateParamsFromDoc,
  FormatToTs,
  FormatToTsType,
  ObjFormats,
  ObjPropsToObjFormats,
} from "./Parse";

//
//
//
//
// SECTION: Firestore
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

//
//
//
//
// SECTION: Doc
export type Doc<T extends {} = {}> = {
  [K in keyof T]: T[K] | null | undefined;
} & DocSpecificProps;
export type DocSpecificProps = {
  readonly _firestoreRef: DocumentReference | null | undefined;
  readonly isLoaded: boolean;
  readonly isDeleted: boolean;
  deleteDoc(): Promise<void>;
};
export function docProx<
  TypeName extends string,
  F extends ObjFormats,
  T extends Doc<{}> = FormatToTsType<TypeName, F>,
>(
  docRef:
    | DocumentReference
    | Promise<DocumentReference | null | undefined>
    | null
    | undefined,
  typeName: TypeName,
  objFormats: F,
): T {
  const data = ref<T | null | undefined>(null);

  // Add standard props
  let proxy: Doc<{ [key: string]: any }> = {
    get _firestoreRef() {
      if (exists(docRef) && `path` in docRef) {
        return docRef;
      } else {
        return undefined;
      }
    },
    get isLoaded() {
      return data.value !== null && data.value !== undefined;
    },
    get isDeleted() {
      return data.value === undefined;
    },
    async deleteDoc() {
      const actualDocRef = await docRef;
      if (exists(actualDocRef)) {
        // Delete all sub docs
        for (const format of Object.values(objFormats[typeName])) {
          if (format.format === `many`) {
            const collectionRef = collection(firebaseDb, format.typeName!);
            const docs = await getDocs(
              query(collectionRef, where(`mx_parent`, "==", actualDocRef.path)),
            );
            docs.forEach((doc) => deleteDoc(doc.ref));
          }
        }
        await deleteDoc(actualDocRef);
      }
    },
  };
  (async () => {
    const unpromisedDocRef = await docRef;
    if (!exists(unpromisedDocRef)) {
      data.value = unpromisedDocRef;
    } else {
      onSnapshot(unpromisedDocRef, (doc) => {
        data.value = doc.data() as UnwrapRef<T> | null | undefined;
      });
    }
  })();

  // Add getters and setters for each property
  for (let [propKey, format] of Object.entries(objFormats[typeName])) {
    Object.defineProperty(
      proxy,
      propKey,
      format.format === `one`
        ? /* One */ {
            get: function () {
              return docProx(
                data.value?.[propKey as keyof typeof data.value] as
                  | DocumentReference
                  | null
                  | undefined,
                format.typeName!,
                objFormats,
              );
            },
            set: function (newValue: any) {
              (async () => {
                const actualDocRef = proxy._firestoreRef;
                if (exists(actualDocRef)) {
                  updateDoc(actualDocRef, {
                    [propKey]: newValue?._firestoreRef ?? null,
                  });
                }
              })();
            },
          }
        : format.format === `many`
        ? /* Many */ {
            get: function () {
              return listProx(
                typeName,
                objFormats,
                `mx_parent`,
                proxy._firestoreRef ?? undefined,
              );
            },
            set: undefined,
          }
        : /* Prim */ {
            get: function () {
              return data.value?.[propKey as keyof typeof data.value];
            },
            set: function (newValue: any) {
              const actualDocRef = proxy._firestoreRef;
              if (exists(actualDocRef)) {
                updateDoc(actualDocRef, {
                  [propKey]: newValue,
                });
              }
            },
          },
    );
  }

  return proxy as T;
}

//
//
//
//
// SECTION: List
export type List<T extends Doc> = {
  [Symbol.iterator]: () => IterableIterator<T>;
  readonly length: number;
  filter(filterFn: (doc: T) => boolean): List<T>;
  map<R>(mapFn: (doc: T) => R): Array<R>;
  add(params: CreateParamsFromDoc<T>): T;
};
function listProx<
  TypeName extends string,
  F extends ObjFormats,
  T extends Doc = FormatToTsType<TypeName, F>,
>(
  typeName: TypeName,
  objFormats: F,
  propName?: string,
  mx_parent?: DocumentReference,
) {
  const collectionRef = collection(firebaseDb, typeName);
  const collectionList = (() => {
    const collectionList = ref<T[]>([]);
    if (propName) {
      if (mx_parent) {
        onSnapshot(
          query(collectionRef, where(`mx_parent`, "==", mx_parent)),
          (querySnapshot) => {
            collectionList.value = querySnapshot.docs.map((doc) => {
              // console.log(doc.ref.path, typeName);
              return docProx(doc.ref, typeName, objFormats);
            });
          },
        );
      }
    } else {
      onSnapshot(collectionRef, (querySnapshot) => {
        collectionList.value = querySnapshot.docs.map((doc) =>
          docProx(doc.ref, typeName, objFormats),
        );
      });
    }
    return collectionList;
  })();
  return vueRefToList(collectionList, mx_parent);
  function vueRefToList<T extends Doc<{}>>(
    collectionList: ComputedRef<T[]> | Ref<T[]>,
    mx_parent?: DocumentReference,
  ): List<T> {
    return {
      [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
      get length() {
        return collectionList.value.length;
      },
      filter(filterFn) {
        return vueRefToList(
          computed(() => collectionList.value.filter(filterFn)),
        );
      },
      map(mapFn) {
        return collectionList.value.map(mapFn);
      },
      add(createParams) {
        const newDoc = {
          ...getDefaultProps(),
          ...createParams,
          ...(mx_parent === undefined ? {} : { mx_parent }),
        };
        return docProx<TypeName, F>(
          addDoc(collectionRef, newDoc),
          typeName,
          objFormats,
        ) as T;
        function getDefaultProps() {
          const defaultProps: { [key: string]: any } = {};
          const defProps = objFormats[typeName];
          for (const key of Object.keys(defProps)) {
            const prop = defProps[key];
            if (prop.format === `prim`) {
              const init = prop.init;
              if (typeof init === `function`) {
                defaultProps[key] = init();
              } else {
                defaultProps[key] = init;
              }
            }
          }
          return defaultProps;
        }
      },
    };
  }
}

//
//
//
//
// SECTION: Define
export function defineAppDataStructure<T extends { [key: string]: DefMany }>(
  modelName: string,
  modelDef: T,
) {
  function buildObjFormats<
    T extends DefObj[`props`],
    D extends DefObj[`props`],
  >(allProps: T): ObjPropsToObjFormats<T, D> {
    let objFormats: ObjFormats = {};
    for (const key of Object.keys(allProps)) {
      const entry = allProps[key];
      if (`quantity` in entry && entry.quantity === `many`) {
        const subFormats = buildObjFormats<typeof entry.type.props, D>(
          entry.type.props,
        );
        objFormats = { ...objFormats, ...subFormats };
        const propFormats: ObjFormats[string] = {};
        for (const propName of Object.keys(entry.type.props)) {
          const prop = entry.type.props[propName];
          if (prop.type === `primitive`) {
            propFormats[propName] = {
              format: `prim`,
              typeName: undefined,
              init: prop.init,
              primType: {} as any,
            };
          } else if (`quantity` in prop && prop.quantity === `one`) {
            propFormats[propName] = {
              format: `one`,
              typeName: prop.type,
              init: prop.init,
              primType: undefined,
            };
          } else {
            propFormats[propName] = {
              format: `many`,
              typeName: prop.type.typeName,
              init: undefined,
              primType: undefined,
            };
          }
        }
        objFormats[entry.type.typeName] = propFormats;
      }
    }
    return objFormats as any;
  }
  const objFormats = buildObjFormats<T, T>(modelDef);
  return {
    getAppData: defineStore(modelName, () => {
      const manyCollections: {
        [K in keyof T]: ReturnType<
          typeof listProx<T[K][`type`][`typeName`], typeof objFormats>
        >;
      } = {} as any;
      for (const key of Object.keys(modelDef)) {
        const many = modelDef[key];
        if (many.type.typeName) {
          manyCollections[key as keyof typeof manyCollections] = listProx(
            many.type.typeName,
            objFormats,
          ) as any;
        }
      }
      return manyCollections;
    }),
    mufasaTypes: {} as FormatToTs<typeof objFormats>,
  };
}
