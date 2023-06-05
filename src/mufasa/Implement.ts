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
import { ComputedRef, Ref, UnwrapRef, computed, ref, watchEffect } from "vue";
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
    if (format.format === `one`) {
      const newDocProx = docProx(
        data.value?.[propKey as keyof typeof data.value] as
          | DocumentReference
          | null
          | undefined,
        format.typeName!,
        objFormats,
      );
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return newDocProx;
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
      });
    } else if (format.format === `many`) {
      const newListProx = listProx(
        format.typeName!,
        objFormats,
        true,
        proxy._firestoreRef ?? undefined,
      );
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return newListProx;
        },
        set: undefined,
      });
    } else {
      Object.defineProperty(proxy, propKey, {
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
      });
    }
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
function genRandomChars(length: number) {
  let result = ``;
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const PARENT_KEY = `mx_parent`;
function listProx<
  TypeName extends string,
  F extends ObjFormats,
  T extends Doc = FormatToTsType<TypeName, F>,
>(
  typeName: TypeName,
  objFormats: F,
  isChild: boolean = false,
  mx_parent?: DocumentReference,
) {
  const chars = genRandomChars(10);
  const collectionRef = collection(firebaseDb, typeName);
  const collectionList = (() => {
    const collectionList = ref<T[]>([]);
    if (isChild) {
      if (mx_parent) {
        // console.log(
        //   `typeName: ${typeName}, propName: ${propName}, mx_parent: ${mx_parent.path}`,
        // );
        onSnapshot(
          // If we used this for both children and non children, root lists would get all docs without a parent, which might be what we want.
          query(collectionRef, where(PARENT_KEY, "==", mx_parent)),
          (querySnapshot) => {
            // console.log(querySnapshot.docs.length);
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
  // watchEffect(() => {
  //   console.log(`${chars}: ${collectionList.value.length}`);
  // });
  return vueRefToList(collectionList, mx_parent);
  function vueRefToList<T extends Doc<{}>>(
    collectionList: ComputedRef<T[]> | Ref<T[]>,
    mx_parent?: DocumentReference,
  ): List<T> {
    return {
      [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
      get length() {
        // console.log(
        //   `Getting length for typeName: ${typeName}, mx_parent: ${mx_parent?.path}: ${collectionList.value.length}`,
        // );
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
