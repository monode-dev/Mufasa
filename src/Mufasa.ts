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
export type LOADING = null;
export const LOADING: LOADING = null;
export type DELETED = undefined;
export const DELETED: DELETED = undefined;
export type Doc<T extends {} = {}> = {
  [K in keyof T]: T[K] extends number | string | boolean
    ? T[K]
    : T[K] | LOADING | DELETED;
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
    | Promise<DocumentReference>
    | ComputedRef<DocumentReference | DELETED | LOADING>,
  typeName: string,
  objFormats: ObjFormats,
): T {
  async function getDocRef(): Promise<DocumentReference | DELETED> {
    const unpromisedDocRef = await docRef;
    if (isRef(unpromisedDocRef)) {
      while (unpromisedDocRef.value === LOADING) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return unpromisedDocRef.value;
    } else {
      return unpromisedDocRef;
    }
  }
  const data = ref<T | LOADING | DELETED>(LOADING);
  (async () => {
    const unpromisedDocRef = await docRef;
    if (isRef(unpromisedDocRef)) {
      let unsubscribe: Unsubscribe | undefined;
      watchEffect(() => {
        unsubscribe?.();
        if (unpromisedDocRef.value === LOADING) return;
        if (unpromisedDocRef.value === DELETED) {
          data.value = DELETED;
        } else {
          unsubscribe = onSnapshot(unpromisedDocRef.value, (doc) => {
            data.value = doc.data() as UnwrapRef<T> | LOADING | DELETED;
          });
        }
      });
    } else {
      if (unpromisedDocRef === LOADING) return;
      if (unpromisedDocRef === DELETED) {
        data.value = DELETED;
      } else {
        onSnapshot(unpromisedDocRef, (doc) => {
          data.value = doc.data() as UnwrapRef<T> | LOADING | DELETED;
        });
      }
    }
  })();
  return (() => {
    // Add the doc specific properties
    let proxy: { [key: string]: any } = {
      get _firestoreRef() {
        if (isRef(docRef)) {
          return docRef.value satisfies DocumentReference | null | undefined;
        } else {
          return docRef;
        }
      },
      get isLoaded() {
        return data !== LOADING && data !== DELETED;
      },
      get isDeleted() {
        return data === DELETED;
      },
      async deleteDoc() {
        const actualDocRef = await getDocRef();
        if (actualDocRef !== DELETED) {
          // Delete all sub docs
          for (const [propKey, format] of Object.entries(
            objFormats[typeName],
          )) {
            if (format.format === `many`) {
              const collectionRef = collection(firebaseDb, format.typeName!);
              const docs = await getDocs(
                query(
                  collectionRef,
                  where(`mx_parent`, "==", actualDocRef.path),
                ),
              );
              docs.forEach((doc) => deleteDoc(doc.ref));
            }
          }
          await deleteDoc(actualDocRef);
        }
      },
    };

    // Add getters and setters for each property
    for (let [propKey, format] of Object.entries(objFormats[typeName])) {
      Object.defineProperty(proxy, propKey, {
        get: function () {
          if (format.format === `one`) {
            const format = objFormats[typeName][propKey as string];
            // const childDocRef = computed(() =>
            //   data.value === DELETED || data.value === LOADING
            //     ? data.value
            //     : (data.value[propKey as keyof UnwrapRef<T>] as DocumentReference),
            // );
            return docProx(
              data.value?.[propKey as keyof UnwrapRef<T>] as DocumentReference,
              format.typeName!,
              objFormats,
            );
          } else if (format.format === `many`) {
            return newDocCollection(
              format.typeName!,
              format.create!,
              objFormats,
              `mx_parent`,
              (() => {
                if (isRef(docRef)) {
                  return docRef.value ?? undefined;
                } else if (`path` in docRef) {
                  return docRef;
                } else {
                  return undefined;
                }
              })(),
            );
          } else {
            return data.value?.[propKey as keyof UnwrapRef<T>];
          }
        },
        set:
          format.format === `many`
            ? undefined
            : function (newValue) {
                (async () => {
                  const actualDocRef = await getDocRef();
                  if (actualDocRef !== DELETED) {
                    updateDoc(actualDocRef, {
                      [propKey]:
                        format.format === `one`
                          ? newValue?._firestoreRef ?? null
                          : newValue,
                    });
                  }
                })();
              },
      });
    }

    return proxy as T;
  })();
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
// const temp = obj({
//   typeName: `Client`,
//   props: {
//     name: prim<string, RequireOnCreate>(undefined),
//     clientId: prim<number | null>(null),
//     phoneNumber: prim<string>(``),
//     address: prim<string>(``),
//     notes: prim<string>(``),
//     // fuelType: one(`FuelType`),
//   },
// });
// type Temp = TypesFromDataStructure<{ [`clients`]: Many<typeof temp> }>;
// const temp2: Temp = {} as Temp;
// temp2.clients.;
type PossiblyUndefinedKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
type MakeUndefiendPropsOptional<T> = Omit<T, PossiblyUndefinedKeys<T>> & {
  [K in PossiblyUndefinedKeys<T>]?: T[K];
};
type CreateParamsFromObj<
  T extends Obj,
  D extends TypeMap,
> = MakeUndefiendPropsOptional<{
  [K in keyof T["props"]]: T["props"][K] extends Prim<
    infer PropType,
    infer PropIsRequired
  >
    ? PropIsRequired extends true
      ? PropType
      : PropType | undefined
    : T["props"][K] extends One<string, infer OneIsRequired>
    ? OneIsRequired extends true
      ? Doc<ObjToTsType<D[T["props"][K]["type"]], D>> | null
      : Doc<ObjToTsType<D[T["props"][K]["type"]], D>> | null | undefined
    : T["props"][K] extends Many
    ?
        | Doc<ObjToTsType<D[T["props"][K][`type`][`typeName`]], D>>
        | null
        | undefined
    : never;
}>;

// Primitive
export type PrimTsType = number | boolean | string /* | binary */ | null;
export type Prim<
  T extends PrimTsType = PrimTsType,
  IsRequired extends boolean = boolean,
> = {
  type: `primitive`;
  init: PrimInitTsType<T>;
};
export type PrimInitTsType<T extends PrimTsType> =
  | T
  | (() => PrimTsType)
  | undefined;
export type RequireOnCreate = true;
export function prim<
  T extends PrimTsType,
  IsRequiredOnCreate extends RequireOnCreate | false = false,
>(init: PrimInitTsType<T>): Prim<T, IsRequiredOnCreate> {
  return {
    type: `primitive`,
    init,
  };
}

// One
export type One<T extends string, IsRequired = boolean> = {
  type: T;
  quantity: `one`;
  // backRefPropName: string | undefined,
  init: null | (() => Obj);
};
export function one<T extends string, IsRequired extends boolean = false>(
  options: T,
  init: null | (() => Obj),
  isRequired?: IsRequired,
): One<T, IsRequired> {
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
