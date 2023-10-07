import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { exists, globalStore } from "./utils";
import {
  SchemaDictToTsType,
  SchemaToTsType,
  TypeSchemaDict,
  RootSchema,
} from "./Parse";
import { DELETED_KEY, LocalCache, initializeCache } from "./LocalCache";
import { initializePersistedFunctionManager } from "./PersistedFunctionManager";
import { Firestore, collection, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";

//
//
//
//
// SECTION: Reactivity & Firestore
export type Computed<T> = {
  get value(): T;
};
export type Signal<T> = {
  set value(newValue: T);
} & Computed<T>;
let _computed: <T>(compute: () => T) => Computed<T>;
let _signal: <T>(initialValue: T) => Signal<T>;
let _isSignal: (obj: any) => obj is Signal<any>;
let _watchEffect: (effect: () => void) => void;
// Firebase
// let firestoreDb: Firestore;
let isProduction = false;
function getCollectionName(typeName: string): string {
  // return `${isProduction ? `Prod` : `Dev`}_${typeName}`;
  return isProduction ? typeName : `Dev_${typeName}`;
}

//
//
//
//
// SECTION: Doc
export type _Doc<T extends {} = {}> = {
  [K in keyof T]: T[K] | undefined;
} & _DocSpecificProps;
export type _DocSpecificProps = {
  readonly _id: string | null | undefined;
  readonly isLoaded: boolean;
  readonly isDeleted: boolean;
  // readonly mx_parent: _Doc | null | undefined;
  getPropFilePath(propName: string): string | null;
  deleteDoc(): Promise<void>;
};
export function docProx<
  TypeName extends string,
  F extends TypeSchemaDict,
  T extends _Doc<{}> = SchemaToTsType<TypeName, F>,
>(
  docId: string | null | undefined,
  typeName: TypeName,
  objFormats: F,
  localCache: LocalCache,
): T {
  let proxy: _Doc<{ [key: string]: any }> = {
    get _id() {
      return docId ?? undefined;
    },
    get isLoaded() {
      return localCache.checkExists(typeName, docId);
    },
    get isDeleted() {
      return (localCache.getPropValue(typeName, proxy._id ?? ``, DELETED_KEY) ??
        false) as boolean;
    },
    getPropFilePath(propName: string) {
      if (!exists(proxy._id)) return null;
      return localCache.getFilePath(typeName, proxy._id, propName);
    },
    async deleteDoc() {
      if (exists(docId)) {
        // Delete all sub docs
        for (const format of Object.values(objFormats[typeName])) {
          if (format.format === `many`) {
            const children = [
              ...localCache.getChildDocs(format.refTypeName!, docId),
            ];
            children.forEach((childId) =>
              docProx(
                childId,
                format.refTypeName!,
                objFormats,
                localCache,
              ).deleteDoc(),
            );
          }
        }
        await localCache.deleteDoc(typeName, docId);
      }
    },
  };

  // Add getters and setters for each property
  for (let [propKey, format] of Object.entries(objFormats[typeName])) {
    if (format.format === `one`) {
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return docProx(
            localCache.getPropValue(typeName, proxy._id ?? ``, propKey) as
              | string
              | null
              | undefined,
            format.refTypeName!,
            objFormats,
            localCache,
          );
        },
        set: function (newValue: any) {
          (async () => {
            const actualDocPath = proxy._id;
            if (exists(actualDocPath) && proxy._id !== newValue?._id) {
              localCache.setPropValue(
                typeName,
                actualDocPath,
                propKey,
                newValue?._id ?? null,
              );
            }
          })();
        },
      });
    } else if (format.format === `many`) {
      /** NOTE: We use to have to instnatiate the list proxy outside Object.defineProperty.
       * I think it was beacuse of the infinite reactive refresh bug. I don't think we have
       * to do this anymore. */
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return listProx(
            format.refTypeName!,
            objFormats,
            localCache,
            true,
            docId,
          );
        },
        set: undefined,
      });
    } else if (format.format === `file`) {
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return localCache.getPropValue(typeName, proxy._id ?? ``, propKey);
        },
        set: function (newValue: any) {
          if (exists(proxy._id) && proxy[propKey] !== newValue) {
            localCache.setPropValue(typeName, proxy._id, propKey, newValue);
          }
        },
      });
    } else {
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return localCache.getPropValue(typeName, proxy._id ?? ``, propKey);
        },
        set: function (newValue: any) {
          if (exists(proxy._id) && proxy[propKey] !== newValue) {
            localCache.setPropValue(typeName, proxy._id, propKey, newValue);
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
export type _List<T extends _Doc> = {
  [Symbol.iterator]: () => IterableIterator<T>;
  readonly length: number;
  filter(filterFn: (doc: T) => boolean): _List<T>;
  map<R>(mapFn: (doc: T) => R): Array<R>;
  add(params: Partial<T>): T;
};
function listProx<TypeName extends string, F extends TypeSchemaDict>(
  typeName: TypeName,
  objFormats: F,
  localCache: LocalCache,
  isChild: boolean = false,
  mx_parent?: string | null | undefined,
) {
  if (isChild) {
    const collectionList = _computed(() => {
      if (exists(mx_parent)) {
        return localCache
          .getChildDocs(typeName, mx_parent!)
          .map((docId) => docProx(docId, typeName, objFormats, localCache));
      } else {
        return [];
      }
    });
    return vueRefToList(collectionList, mx_parent);
  } else {
    const collectionList = _computed(() =>
      localCache
        .listAllObjectsOfType(typeName)
        .map((docId) => docProx(docId, typeName, objFormats, localCache)),
    );
    return vueRefToList(collectionList, mx_parent);
  }
  function vueRefToList<T extends _Doc<{}>>(
    collectionList: Computed<T[]> | Signal<T[]>,
    mx_parent?: string | null | undefined,
  ): _List<T> {
    return {
      [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
      get length() {
        return collectionList.value.length;
      },
      filter(filterFn) {
        return vueRefToList(
          _computed(() => collectionList.value.filter(filterFn)),
        );
      },
      map(mapFn) {
        return collectionList.value.map(mapFn);
      },
      add(createParams) {
        return docProx<TypeName, F>(
          (() => {
            const parent = mx_parent;

            const defaultProps: { [key: string]: any } = getDefaultProps();
            for (const [key, prop] of Object.entries(objFormats[typeName])) {
              if (
                prop.format === `prim` &&
                exists(createParams[key as keyof typeof createParams])
              ) {
                defaultProps[key] =
                  createParams[key as keyof typeof createParams];
              } else if (
                prop.format === `one` &&
                exists(createParams[key as keyof typeof createParams])
              ) {
                defaultProps[key] = (
                  createParams[key as keyof typeof createParams] as _Doc
                )?._id;
              }
            }
            const newDocId = localCache.addDoc(typeName, {
              ...defaultProps,
              ...(exists(parent) ? { mx_parent: parent } : {}),
            });

            return newDocId;
          })(),
          typeName,
          objFormats,
          localCache,
        ) as T;
        function getDefaultProps() {
          const defaultProps: { [key: string]: any } = {};
          const defProps = objFormats[typeName];
          for (const key of Object.keys(defProps)) {
            const prop = defProps[key];
            if (prop.format === `prim`) {
              const defaultValue = prop.defaultValue;
              if (typeof defaultValue === `function`) {
                defaultProps[key] = defaultValue();
              } else {
                defaultProps[key] = defaultValue;
              }
            } else if (prop.format === `file`) {
              defaultProps[key] = null;
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
export type MfsFileSystem = {
  readFile: (path: string) => Promise<string | undefined>;
  writeFile: (path: string, data: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  getFilePath: (path: string) => string;
};
export function _defineAppDataStructure<
  RS extends RootSchema,
  TSD extends TypeSchemaDict,
>(
  modelName: string,
  options: {
    isProduction: boolean;
    reactivity: {
      computed: typeof _computed;
      signal: typeof _signal;
      isSignal: typeof _isSignal;
      watchEffect: typeof _watchEffect;
    };
    firebaseOptions: FirebaseOptions;
    fileSystem: MfsFileSystem;
    rootSchema: RS;
    typeSchemas: TSD;
  },
) {
  // Setup Reactivity
  _computed = options.reactivity.computed;
  _signal = options.reactivity.signal;
  _isSignal = options.reactivity.isSignal;
  _watchEffect = options.reactivity.watchEffect;
  // Setup Firebase
  isProduction = options.isProduction;
  const firebaseApp = initializeApp(options.firebaseOptions);
  const firestore = getFirestore(firebaseApp);
  const firebaseStorage = getStorage(firebaseApp);
  const auth = getAuth(firebaseApp);
  console.log(collection(firestore, `Dev_Client`));

  return {
    getAppData: globalStore(modelName, () => {
      const persistedFunctionManager = initializePersistedFunctionManager(
        `mfs_${modelName}_persistedFunctions`,
        options.fileSystem,
      );
      const localCache = initializeCache({
        typeSchemas: options.typeSchemas,
        getCollectionName,
        firebaseApp,
        firestore,
        firebaseStorage,
        auth,
        _signal,
        persistedFunctionManager: persistedFunctionManager,
        fileSystem: options.fileSystem,
        isProduction: options.isProduction,
      });

      const rootLists: {
        [K in keyof RS]: ReturnType<
          typeof listProx<
            NonNullable<RS[K][`refTypeName`]>,
            typeof options.typeSchemas
          >
        >;
      } = {} as any;
      for (const key of Object.keys(options.rootSchema)) {
        rootLists[key as keyof typeof rootLists] = listProx(
          options.rootSchema[key].refTypeName,
          options.typeSchemas,
          localCache,
        );
      }
      return rootLists;
    }),
    types: {} as SchemaDictToTsType<typeof options.typeSchemas>,
    firebaseAuth: auth,
  };
}
