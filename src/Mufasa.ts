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
} from "firebase/firestore";
import { ComputedRef, UnwrapRef, computed, isRef, ref, watchEffect } from "vue";

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
  [K in keyof T]: T[K] | LOADING | DELETED;
} & DocSpecificProps;
export type DocSpecificProps = {
  _firestoreRef: DocumentReference;
  isLoaded: boolean;
  isDeleted: boolean;
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
      onSnapshot(unpromisedDocRef, (doc) => {
        data.value = doc.data() as UnwrapRef<T> | LOADING | DELETED;
      });
    }
  })();
  return new Proxy({} as T, {
    get: (_, prop) => {
      if (prop === "_firestoreRef") {
        return docRef;
      } else if (prop === "isLoaded") {
        return data.value !== LOADING && data.value !== DELETED;
      } else if (prop === "isDeleted") {
        return data.value === DELETED;
      } else if (prop === "deleteDoc") {
        return async () => {
          const actualDocRef = await getDocRef();
          if (actualDocRef !== DELETED) {
            await deleteDoc(actualDocRef);
          }
        };
      } else if (objFormats[typeName]?.[prop as string]?.format === `one`) {
        const format = objFormats[typeName][prop as string];
        const childDocRef = computed(() =>
          data.value === DELETED || data.value === LOADING
            ? data.value
            : (data.value[prop as keyof UnwrapRef<T>] as DocumentReference),
        );
        return docProx(childDocRef, format.type!, objFormats);
      } else {
        return data.value?.[prop as keyof UnwrapRef<T>];
      }
    },
    set: (_, prop, value) => {
      if (prop === "_firestoreRef") {
        return false;
      }
      (async () => {
        const actualDocRef = await getDocRef();
        if (actualDocRef !== DELETED) {
          updateDoc(actualDocRef, {
            [prop]: value,
          });
        }
      })();
      return true;
    },
  });
}
export type GetDocType<T extends { create: (...args: any) => Doc<{}> }> =
  ReturnType<T["create"]>;
export type Obj = {
  typeName: string;
  props: {
    [key: string]: Prim | One /* | One | Many */;
  };
};
export function obj<T extends Obj>(objDef: T) {
  return objDef;
}
type TypeMap = { [typeName: string]: Obj };
export type ObjToTsType<T extends Obj, D extends TypeMap> = {
  -readonly [K in keyof T["props"]]: T["props"][K] extends Prim<infer R>
    ? R
    : T["props"][K] extends One
    ? Doc<ObjToTsType<D[T["props"][K]["type"]], D>>
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
type CreateParamsFromObj<T extends Obj> = MakeUndefiendPropsOptional<{
  [K in keyof T["props"]]: T["props"][K] extends Prim<
    infer PropType,
    infer PropIsRequired
  >
    ? PropIsRequired extends true
      ? PropType
      : PropType | undefined
    : T["props"][K] extends One
    ? T["props"][K]["type"]
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
export type One = {
  type: string;
  quantity: `one`;
  // backRefPropName: string | undefined,
  init: null | (() => Obj);
};
export function one(options: string): One {
  return {
    type: options,
    quantity: `one`,
    init: null,
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
  type CreateType = (createParams: CreateParamsFromObj<T>) => TsType;
  return newDocCollection<TsType, Parameters<CreateType>, CreateType>(
    many.type.typeName,
    (createParams: CreateParamsFromObj<T>) => {
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
      } as any;
    },
    objFormats,
  );
}
function newDocCollection<
  T extends {},
  CreateArgs extends any[],
  Create extends (...args: CreateArgs) => T,
>(typeName: string, createDoc: Create, objFormats: ObjFormats) {
  const collectionRef = collection(firebaseDb, typeName);
  const collectionList = ref<Doc<T>[]>([]);
  onSnapshot(collectionRef, (querySnapshot) => {
    collectionList.value = querySnapshot.docs.map((doc) =>
      docProx(doc.ref, typeName, objFormats),
    );
  });
  return {
    list: collectionList,
    create(...args: CreateArgs) {
      const newDoc = createDoc(...args);
      return docProx<Doc<T>>(
        addDoc(collectionRef, newDoc),
        typeName,
        objFormats,
      );
    },
  };
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
      type?: string;
    };
  };
};
export type AppDataStructure<K extends string> = {
  [Key in K]: Many;
};
type DataStructureToTypeMap<T extends AppDataStructure<string>> = {
  [K in keyof T as T[K][`type`][`typeName`]]: T[K][`type`];
};
type TypesFromDataStructure<T extends AppDataStructure<string>> = {
  [K in keyof T as T[K][`type`][`typeName`]]: Doc<
    ObjToTsType<T[K][`type`], DataStructureToTypeMap<T>>
  >;
};
export function defineAppDataStructure<T extends AppDataStructure<string>>(
  modelName: string,
  modelDef: T,
) {
  const objFormats = (() => {
    const objFormats: ObjFormats = {};
    for (const key of Object.keys(modelDef)) {
      const many = modelDef[key];
      if (many.type.typeName) {
        const propFormats: ObjFormats[string] = {};
        for (const propName of Object.keys(many.type.props)) {
          const prop = many.type.props[propName];
          if (prop.type === `primitive`) {
            propFormats[propName] = {
              format: `prim`,
              type: undefined,
            };
          } else if (`quantity` in prop && prop.quantity === `one`) {
            propFormats[propName] = {
              format: `one`,
              type: prop.type,
            };
          } else {
            propFormats[propName] = {
              format: `many`,
              type: prop.type,
            };
          }
        }
        objFormats[many.type.typeName] = propFormats;
      }
    }
    return objFormats;
  })();
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
    mufasaTypes: {} as TypesFromDataStructure<T>,
  };
}
