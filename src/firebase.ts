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
        return data.value !== LOADING && data.value !== DELETED;
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
export type GetDocType<T extends { create: (...args: any) => Doc<{}> }> =
  ReturnType<T["create"]>;
export function newDocCollection<
  T extends {},
  CreateArgs extends any[],
  Create extends (...args: CreateArgs) => T,
>(collectionName: string, createDoc: Create) {
  const collectionRef = collection(firebaseDb, collectionName);
  const collectionList = ref<Doc<T>[]>([]);
  onSnapshot(collectionRef, (querySnapshot) => {
    collectionList.value = querySnapshot.docs.map((doc) => docProx(doc.ref));
  });
  return {
    list: collectionList,
    create(...args: CreateArgs) {
      const newDoc = createDoc(...args);
      return docProx<Doc<T>>(addDoc(collectionRef, newDoc));
    },
  };
}

//
// function prop<T>(init: T) {
//   return ref(init);
// }
// function formula<T, R = any>(compute: (inst: T) => R) {
//   return computed(compute);
// }
// function action<T>(doAction: (inst: T) => Promise<void>) {
//   return doAction;
// }
/* type DocFormat<T extends {
  [key: string]: Prop | Formula<T> | Action<T>;
}> = T;
const clientDocCollection = newDocCollection({
  name: prop(``),
  clientId: prop<number | undefined>(undefined),
  phoneNumber: prop(``),
  address: prop(``),
  notes: prop(``),
  // Should be able to be inferred
  customCreate: (create, props: { nameOrId: string }) => {
    const wasGivenId = !isNaN(Number(nameOrId));
    return create ({
        name: wasGivenId ? undefined : nameOrId,
        clientId: wasGivenId ? (nameOrId as ClientId) : undefined,
    });
  },
});*/

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

// Object
export type Obj = {
  typeName: string;
  props: {
    [key: string]: Prim /* | One | Many */;
  };
};
export function obj<T extends Obj>(objDef: T) {
  return objDef;
}
export type ObjToTsType<T extends Obj> = {
  -readonly [K in keyof T["props"]]: T["props"][K] extends Prim<infer R>
    ? R
    : never;
};
type CreateParamsFromObj<T extends Obj> = {
  [K in keyof T["props"]]: T["props"][K] extends Prim<
    infer PropType,
    infer PropIsRequired
  >
    ? PropIsRequired extends true
      ? PropType
      : PropType | undefined
    : never;
};

// Many
export type Many<T extends Obj = Obj> = {
  type: T; // | string,
  // backRefPropName: string | undefined,
  // quantitySelf: `one` | `many`,
  // init: [] | FROM_CREATE | (() => ManyParams),
};
export function many<T extends Obj>(options: T) {
  return {
    type: options,
  };
}
function docCollectionFromMany<T extends Obj>(many: Many<T>) {
  return newDocCollection(
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
      } as ObjToTsType<T>;
    },
  );
}
// type CreateParamsFromObj<T extends Many<O>, O extends Obj> = {
//   [K in keyof T["type"]["props"]]: T["type"]["props"][K] extends Prim
//     ? T["type"]["props"][K]["init"] extends FROM_CREATE
//       ? undefined
//       : T["type"]["props"][K]["init"] extends () => infer R
//       ? R
//       : T["type"]["props"][K]["init"]
//     : never;
// };
// function implementMany<T extends Many<O>, O extends Obj>(myMany: T) {
//   return newDocCollection(
//     myMany.type.typeName,
//     (createParams: CreateParamsFromObj<T, O>) => {
//       function getDefaultProps() {
//         const defaultProps: { [key: string]: any } = {};
//         const defProps = myMany.type.props;
//         for (const key of Object.keys(defProps)) {
//           const prop = defProps[key];
//           if (prop.type === `primitive`) {
//             const init = prop.init;
//             if (isFromCreate(init)) {
//               defaultProps[key] = undefined;
//             } else if (typeof init === `function`) {
//               defaultProps[key] = init();
//             } else {
//               defaultProps[key] = init;
//             }
//           }
//         }
//         return defaultProps;
//       }
//       return {
//         ...getDefaultProps(),
//         ...createParams,
//       };
//     },
//   );
// }
// export type RootObj<T extends Many<O>, O extends Obj> = {
//   [key: string]: T;
// };
// export function defineAppDataStructure<T extends RootObj<any, any>>(
//   modelName: string,
//   modelDef: T,
// ) {
//   return defineStore(modelName, () => {
//     const manyCollections: {
//       [K in keyof T]: ReturnType<typeof implementMany>;
//     } = {} as any;
//     for (const key of Object.keys(modelDef)) {
//       const many = modelDef[key];
//       if (many.type.typeName) {
//         manyCollections[key as keyof typeof manyCollections] =
//           implementMany(many);
//       }
//     }
//     return manyCollections;
//   });
// }
// const useData = defineAppDataStructure(`ninetyPercent`, {
//   clients: many({
//     type: obj({
//       typeName: `Client`,
//       props: {
//         name: prim<string>(FROM_CREATE),
//         clientId: prim<number | null>(null),
//         phoneNumber: prim<string>(``),
//         address: prim<string>(``),
//         notes: prim<string>(``),
//       } as const,
//     } as const),
//   } as const),
//   fuelTypes: many({
//     type: obj({
//       typeName: `FuelType`,
//       props: {
//         name: prim<string>(``),
//         rate: prim<number | null>(null),
//         isVisible: prim<boolean>(true),
//         createdPosix: prim<number>(() => Date.now()),
//       } as const,
//     } as const),
//   } as const),
// } as const);
// const data = useData();
// data.clients.create({});

// Client
export type ClientId = `${number}` | ``;
// export type Client = GetDocType<typeof clientDocCollection>;
// const clientDocCollection = newDocCollection(`Client`, (nameOrId: string) => {
//   const wasGivenId = !isNaN(Number(nameOrId));
//   return {
//     name: (wasGivenId ? "" : nameOrId) satisfies string,
//     clientId: (wasGivenId ? (nameOrId as ClientId) : "") satisfies ClientId,
//     phoneNumber: "" satisfies string,
//     address: "" satisfies string,
//     notes: "" satisfies string,
//   };
// });
export type Client = ObjToTsType<typeof clientModel> & DocSpecificProps;
const clientModel = obj({
  typeName: `Client`,
  props: {
    name: prim<string, RequireOnCreate>(undefined),
    clientId: prim<number | null>(null),
    phoneNumber: prim<string>(``),
    address: prim<string>(``),
    notes: prim<string>(``),
  },
});
const clientDocCollection = docCollectionFromMany(many(clientModel));

// Tank
// export type TankShape = (typeof tankShape)[keyof typeof tankShape];
// const tankShape = {
//   none: 0,
//   horizontalCylinder: 6,
//   verticalCylinder: 1,
//   oval: 2,
//   rectangle: 3,
//   ellipse: 4,
//   truckBedTank: 5,
// } as const;
// export type Tank = GetDocType<typeof tankDocCollection>;
// const tankDocCollection = newDocCollection(`Tank`, () => {
//   return {
//     fuelType: null satisfies FuelType | null,
//     shape: 0 satisfies TankShape,
//     length: 0 satisfies number,
//     depth: 0 satisfies number,
//     height: 0 satisfies number,
//     shortHeight: 0 satisfies number,
//   };
// });

// Fuel Type
// export type FuelType = GetDocType<typeof fuelTypeDocCollection>;
// const fuelTypeDocCollection = newDocCollection(`FuelType`, () => {
//   return {
//     name: `` satisfies string,
//     rate: null satisfies number | null,
//     isVisible: true satisfies boolean,
//     createdPosix: Date.now() satisfies number,
//   };
// });
export type FuelType = ObjToTsType<typeof fuelTypeModel> & DocSpecificProps;
const fuelTypeModel = obj({
  typeName: `FuelType`,
  props: {
    name: prim<string, RequireOnCreate>(undefined),
    clientId: prim<number | null>(null),
    phoneNumber: prim<string>(``),
    address: prim<string>(``),
    notes: prim<string>(``),
  },
});
const fuelTypeDocCollection = docCollectionFromMany(many(fuelTypeModel));

// Pinia Store
export const useFirestore = defineStore("firestore", () => {
  return {
    clients: clientDocCollection.list,
    createClient: clientDocCollection.create,
    fuelTypes: fuelTypeDocCollection.list,
    createFuelType: fuelTypeDocCollection.create,
  };
});
