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
  Unsubscribe,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import {
  ComputedRef,
  Ref,
  UnwrapRef,
  computed,
  isRef,
  ref,
  watchEffect,
} from "vue";
import { exists } from "./utils";

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

// Object
export type Doc<T extends {} = {}> = {
  [K in keyof T]: T[K] | null | undefined;
} & DocSpecificProps;
export type DocSpecificProps = {
  readonly _firestoreRef: DocumentReference | null | undefined;
  readonly isLoaded: boolean;
  readonly isDeleted: boolean;
  deleteDoc(): Promise<void>;
};
export function docProx<T extends Doc<{}>>(
  docRef:
    | DocumentReference
    | Promise<DocumentReference | null | undefined>
    | null
    | undefined,
  typeName: string,
  objFormats: ObjFormats,
): T {
  const data = ref<T | null | undefined>(null);
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
        ? /* Many  */ {
            get: function () {
              return newDocCollection(
                typeName,
                format.create!,
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
export type GetDocType<T extends { create: (...args: any) => Doc<{}> }> =
  ReturnType<T["create"]>;
export type Obj = {
  typeName: string;
  props: {
    [key: string]: Prim | One<string> | Many /* | One | Many */;
  };
};
export function obj<T extends Obj>(objDef: T) {
  return objDef;
}
type TypeMap = { [typeName: string]: Obj };
export type ObjToTsType<T extends Obj, D extends TypeMap> = {
  -readonly [K in keyof T["props"]]: T["props"][K] extends Prim<infer R>
    ? R
    : T["props"][K] extends One<string>
    ? Doc<ObjToTsType<D[T["props"][K]["type"]], D>>
    : T["props"][K] extends Many
    ? List<
        Doc<ObjToTsType<T["props"][K][`type`], D>>,
        CreateParamsFromObj<T["props"][K][`type`], D>
      >
    : never;
};
type CreateParamsFromObj<T extends Obj, D extends TypeMap> = {
  [K in keyof T["props"]]?: T["props"][K] extends Prim<infer PropType>
    ? PropType | undefined
    : T["props"][K] extends One
    ? Doc<ObjToTsType<D[T["props"][K]["type"]], D>> | null | undefined
    : T["props"][K] extends Many
    ?
        | Doc<ObjToTsType<D[T["props"][K][`type`][`typeName`]], D>>
        | null
        | undefined
    : never;
};

// Primitive
export type PrimTsType = number | boolean | string /* | binary */ | null;
export type Prim<T extends PrimTsType = PrimTsType> = {
  type: `primitive`;
  init: PrimInitTsType<T>;
};
export type PrimInitTsType<T extends PrimTsType> =
  | T
  | (() => PrimTsType)
  | undefined;
export type RequireOnCreate = true;
export function prim<T extends PrimTsType>(init: PrimInitTsType<T>): Prim<T> {
  return {
    type: `primitive`,
    init,
  };
}

// One
export type One<T extends string = string> = {
  type: T;
  quantity: `one`;
  // backRefPropName: string | undefined,
  init: null | (() => Obj);
};
export function one<T extends string, IsRequired extends boolean = false>(
  options: T,
  init: null | (() => Obj),
  isRequired?: IsRequired,
): One<T> {
  return {
    type: options,
    quantity: `one`,
    init: init,
  };
}

// Many
export type Many<T extends Obj = Obj> = {
  type: T; // | string,
  quantity: `many`;
  // backRefPropName: string | undefined,
  // quantitySelf: `one` | `many`,
  // init: [] | FROM_CREATE | (() => ManyParams),
};
export function many<T extends Obj>(options: T): Many<T> {
  return {
    type: options,
    quantity: `many`,
  };
}
function docCollectionFromMany<T extends Obj, D extends TypeMap>(
  many: Many<T>,
  objFormats: ObjFormats,
) {
  type TsType = ObjToTsType<T, D>;
  type CreateType = (
    createParams: CreateParamsFromObj<T, D>,
    mx_parent?: DocumentReference,
  ) => TsType;
  return newDocCollection<TsType, CreateParamsFromObj<T, D>, CreateType>(
    many.type.typeName,
    (
      createParams: CreateParamsFromObj<T, D>,
      mx_parent?: DocumentReference,
    ) => {
      function getDefaultProps() {
        const defaultProps: { [key: string]: any } = {};
        const defProps = many.type.props;
        for (const key of Object.keys(defProps)) {
          const prop = defProps[key];
          if (prop.type === `primitive`) {
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
      return {
        ...getDefaultProps(),
        ...createParams,
        ...(mx_parent === undefined ? {} : { mx_parent }),
      } as any;
    },
    objFormats,
  );
}
export type List<T extends Doc<{}>, CreateArgs extends any> = {
  [Symbol.iterator]: () => IterableIterator<T>;
  readonly length: number;
  filter(filterFn: (doc: T) => boolean): List<T, CreateArgs>;
  map<R>(mapFn: (doc: T) => R): Array<R>;
  add(params: CreateArgs): T;
};
function newDocCollection<
  T extends {},
  CreateArgs extends any,
  Create extends (params: CreateArgs, mx_parent?: DocumentReference) => T,
>(
  typeName: string,
  createDoc: Create,
  objFormats: ObjFormats,
  propName?: string,
  mx_parent?: DocumentReference,
) {
  const collectionRef = collection(firebaseDb, typeName);
  const collectionList = ref<Doc<T>[]>([]);
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
  return newListFor(collectionList, mx_parent);
  function newListFor<T extends Doc<{}>>(
    collectionList: ComputedRef<T[]> | Ref<T[]>,
    mx_parent?: DocumentReference,
  ): List<T, CreateArgs> {
    return {
      [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
      get length() {
        return collectionList.value.length;
      },
      filter(filterFn: (doc: T) => boolean) {
        return newListFor(
          computed(() => collectionList.value.filter(filterFn)),
        );
      },
      map<R>(mapFn: (doc: T) => R) {
        return collectionList.value.map(mapFn);
      },
      add(params: CreateArgs) {
        const newDoc = createDoc(params, mx_parent);
        return docProx<T>(addDoc(collectionRef, newDoc), typeName, objFormats);
      },
    };
  }
}

// Formula
// function formula<T, R = any>(compute: (inst: T) => R) {
//   return computed(compute);
// }

// Action
// function action<T>(doAction: (inst: T) => Promise<void>) {
//   return doAction;
// }

// App Data Structure
type ObjFormats = {
  [typeName: string]: {
    [propName: string]: {
      format: `prim` | `one` | `many`;
      typeName?: string;
      readonly create?: (params: any, mx_parent?: DocumentReference) => any;
    };
  };
};
export type AppDataStructure<K extends string> = {
  [Key in K]: Many;
};
type DataStructureToTypeMap<T extends Obj[`props`]> = {
  [K in keyof T as T[K] extends Many
    ? T[K][`type`][`typeName`]
    : never]: T[K] extends Many ? T[K][`type`] : never;
} & UnionToIntersection<
  {
    [K in keyof T]: T[K] extends Many
      ? DataStructureToTypeMap<T[K][`type`][`props`]>
      : never;
  }[keyof T]
>;
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type TypesFromObjProps<
  T extends Obj[`props`],
  D extends AppDataStructure<string>,
> = {
  [K in keyof T as T[K] extends Many
    ? T[K][`type`][`typeName`]
    : never]: T[K] extends Many
    ? Doc<ObjToTsType<T[K][`type`], DataStructureToTypeMap<D>>>
    : never;
} & UnionToIntersection<
  {
    [K in keyof T]: T[K] extends Many
      ? TypesFromObjProps<T[K][`type`][`props`], D>
      : never;
  }[keyof T]
>;
export function defineAppDataStructure<T extends AppDataStructure<string>>(
  modelName: string,
  modelDef: T,
) {
  function defineCreate<T extends Obj, D extends TypeMap>(many: Many<T>) {
    return (
      createParams: CreateParamsFromObj<T, D>,
      mx_parent?: DocumentReference,
    ) => {
      function getDefaultProps() {
        const defaultProps: { [key: string]: any } = {};
        const defProps = many.type.props;
        for (const key of Object.keys(defProps)) {
          const prop = defProps[key];
          if (prop.type === `primitive`) {
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
      return {
        ...getDefaultProps(),
        ...createParams,
        ...(mx_parent === undefined ? {} : { mx_parent }),
      } as any;
    };
  }
  function buildObjFormats(allProps: Obj[`props`] = modelDef) {
    let objFormats: ObjFormats = {};
    for (const key of Object.keys(allProps)) {
      const entry = allProps[key];
      if (`quantity` in entry && entry.quantity === `many`) {
        const subFormats = buildObjFormats(entry.type.props);
        objFormats = { ...objFormats, ...subFormats };
        const propFormats: ObjFormats[string] = {};
        for (const propName of Object.keys(entry.type.props)) {
          const prop = entry.type.props[propName];
          if (prop.type === `primitive`) {
            propFormats[propName] = {
              format: `prim`,
              typeName: undefined,
            };
          } else if (`quantity` in prop && prop.quantity === `one`) {
            propFormats[propName] = {
              format: `one`,
              typeName: prop.type,
            };
          } else {
            propFormats[propName] = {
              format: `many`,
              typeName: prop.type.typeName,
              create: defineCreate(prop as any),
            };
          }
        }
        objFormats[entry.type.typeName] = propFormats;
      }
    }
    return objFormats;
  }
  const objFormats = buildObjFormats();
  return {
    getAppData: defineStore(modelName, () => {
      const manyCollections: {
        [K in keyof T]: ReturnType<
          typeof docCollectionFromMany<T[K][`type`], DataStructureToTypeMap<T>>
        >;
      } = {} as any;
      for (const key of Object.keys(modelDef)) {
        const many = modelDef[key];
        if (many.type.typeName) {
          manyCollections[key as keyof typeof manyCollections] =
            docCollectionFromMany(many, objFormats) as any;
        }
      }
      return manyCollections;
    }),
    mufasaTypes: {} as TypesFromObjProps<T, T>,
    test: {} as DataStructureToTypeMap<T>,
  };
}
