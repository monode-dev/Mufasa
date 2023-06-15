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
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { ComputedRef, Ref, UnwrapRef, computed, ref, watchEffect } from "vue";
import { exists } from "../utils";
import { DefMany, DefObj } from "./Define";
import { Device } from "@capacitor/device";
import {
  CreateParamsFromDoc,
  FormatToTs,
  FormatToTsType,
  ObjFormats,
  ObjPropsToObjFormats,
} from "./Parse";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import {
  deleteFileFromIndexedDB,
  readFileFromIndexedDB,
  writeFileToIndexedDB,
} from "./IndexedDBFileSystem";

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

const firebasApp = initializeApp(firebaseConfig);
export const firebaseDb = initializeFirestore(firebasApp, {
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

async function getUuid() {
  return `${(await Device.getId()).uuid}-${Date.now()}`;
}

async function completeFileUpload({
  docPath,
  propKey,
  fileId,
  data,
  oldFileIdToDelete,
}: {
  docPath: string;
  propKey: string;
  fileId: string;
  data: string;
  oldFileIdToDelete: string | undefined;
}) {
  // Upload data to firebase storage
  let haveUploaded = false;
  while (!haveUploaded) {
    try {
      await uploadBytes(
        storageRef(getStorage(firebasApp), `MX_Files/${fileId}.txt`),
        new TextEncoder().encode(data),
      );
      haveUploaded = true;
    } catch (err) {}
  }
  await writeFileToIndexedDB(`MX_Files`, `${fileId}.txt`, data);
  // await Filesystem.writeFile({
  //   path: `MX_Files/${fileId}.txt`,
  //   data: data,
  //   directory: Directory.Data,
  //   encoding: Encoding.UTF8,
  //   recursive: true,
  // });

  deleteFileFromIndexedDB(`MX_FilesToUpload`, `${fileId}.txt`);
  // Filesystem.deleteFile({
  //   path: `MX_FilesToUpload/${fileId}.txt`,
  //   directory: Directory.Data,
  // });

  deleteFileFromIndexedDB(`MX_FilesToUpload`, `${fileId}.json`);
  // Filesystem.deleteFile({
  //   path: `MX_FilesToUpload/${fileId}.json`,
  //   directory: Directory.Data,
  // });
  updateDoc(doc(firebaseDb, docPath), {
    [propKey]: {
      local: null,
      remote: fileId,
    },
  });
  if (exists(oldFileIdToDelete)) {
    deleteObject(
      storageRef(getStorage(firebasApp), `MX_Files/${oldFileIdToDelete}.txt`),
    );
  }
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
              query(collectionRef, where(`mx_parent`, "==", actualDocRef)),
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
      data.value = undefined;
    } else {
      onSnapshot(unpromisedDocRef, (doc) => {
        data.value = doc.data() as UnwrapRef<T> | null | undefined;
      });
    }
  })();

  // Add getters and setters for each property
  for (let [propKey, format] of Object.entries(objFormats[typeName])) {
    if (format.format === `one`) {
      Object.defineProperty(proxy, propKey, {
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
      });
    } else if (format.format === `many`) {
      const newListProx = listProx(
        format.typeName!,
        objFormats,
        true,
        docRef ?? undefined,
      );
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return newListProx;
        },
        set: undefined,
      });
    } else if (format.format === `file`) {
      Object.defineProperty(proxy, propKey, {
        get: async function () {
          const fileDetails = data.value?.[
            propKey as keyof typeof data.value
          ] as any;

          if (exists(fileDetails)) {
            if (
              exists(fileDetails) &&
              `local` in fileDetails &&
              exists(fileDetails.local)
            ) {
              try {
                const result = await readFileFromIndexedDB(
                  `MX_FilesToUpload`,
                  `${fileDetails.local}.txt`,
                );
                return result;
                // const result = await Filesystem.readFile({
                //   path: `MX_FilesToUpload/${fileDetails}.txt`,
                //   directory: Directory.Data,
                //   encoding: Encoding.UTF8,
                // });
                // return result.data;
              } catch (err) {
                try {
                  const result = await readFileFromIndexedDB(
                    `MX_Files`,
                    `${fileDetails.remote}.txt`,
                  );
                  return result;
                  // const result = await Filesystem.readFile({
                  //   path: `MX_Files/${fileDetails}.txt`,
                  //   directory: Directory.Data,
                  //   encoding: Encoding.UTF8,
                  // });
                  // return result.data;
                } catch (err) {
                  return null;
                }
              }
            } else {
              try {
                const result = await readFileFromIndexedDB(
                  `MX_Files`,
                  `${fileDetails.remote}.txt`,
                );
                return result;
                // const result = await Filesystem.readFile({
                //   path: `MX_Files/${fileDetails}.txt`,
                //   directory: Directory.Data,
                //   encoding: Encoding.UTF8,
                // });
                // return result.data;
              } catch (err) {
                return null;
              }
            }
          } else {
            return fileDetails;
          }
        },
        set: async function (newValue: Promise<string | null> | string | null) {
          const actualDocRef = proxy._firestoreRef;
          if (exists(actualDocRef)) {
            const newPropData = await newValue;
            if (exists(newPropData)) {
              const newFileId = await getUuid();

              // Write newValue to local storage
              await writeFileToIndexedDB(
                `MX_FilesToUpload`,
                `${newFileId}.txt`,
                newPropData,
              );
              // await Filesystem.writeFile({
              //   path: `MX_FilesToUpload/${newFileId}.txt`,
              //   data: newPropData,
              //   directory: Directory.Data,
              //   encoding: Encoding.UTF8,
              //   recursive: true,
              // });

              await writeFileToIndexedDB(
                `MX_FilesToUpload`,
                `${newFileId}.json`,
                JSON.stringify({
                  docRef: actualDocRef.path,
                  propKey,
                }),
              );
              // await Filesystem.writeFile({
              //   path: `MX_FilesToUpload/${newFileId}.json`,
              //   data: JSON.stringify({
              //     docRef: actualDocRef.path,
              //     propKey,
              //   }),
              //   directory: Directory.Data,
              //   encoding: Encoding.UTF8,
              //   recursive: true,
              // });
              const fileDetails =
                data.value?.[propKey as keyof typeof data.value];
              updateDoc(actualDocRef, {
                [propKey]: {
                  ...(fileDetails ?? { remote: null }),
                  local: newFileId,
                },
              });
              completeFileUpload({
                docPath: actualDocRef.path,
                propKey,
                fileId: newFileId,
                data: newPropData,
                oldFileIdToDelete: ((fileDetails as any) ?? { remote: null })
                  .remote,
              });
            } else {
              updateDoc(actualDocRef, {
                [propKey]: {
                  local: null,
                  remote: null,
                },
              });
            }
          }
        },
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
  mx_parent?: Promise<DocumentReference | null | undefined> | DocumentReference,
) {
  const chars = genRandomChars(10);
  const collectionRef = collection(firebaseDb, typeName);
  const collectionList = (() => {
    const collectionList = ref<T[]>([]);
    if (isChild) {
      if (mx_parent) {
        (async () => {
          const unpromisedParent = await mx_parent;
          onSnapshot(
            // If we used this for both children and non children, root lists would get all docs without a parent, which might be what we want.
            query(collectionRef, where(PARENT_KEY, "==", unpromisedParent)),
            (querySnapshot) => {
              collectionList.value = querySnapshot.docs.map((doc) => {
                return docProx(doc.ref, typeName, objFormats);
              });
            },
          );
        })();
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
    mx_parent?:
      | Promise<DocumentReference | null | undefined>
      | DocumentReference,
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
        return docProx<TypeName, F>(
          (async () => {
            const parent = await mx_parent;

            const defaultProps: { [key: string]: any } = getDefaultProps();
            const fileDefaults: { [key: string]: any } = {};
            for (const [key, prop] of Object.entries(objFormats[typeName])) {
              if (prop.format === `file`) {
                if (exists(createParams[key as keyof typeof createParams])) {
                  fileDefaults[key] =
                    createParams[key as keyof typeof createParams];
                } else {
                  const init = prop.init;
                  if (typeof init === `function`) {
                    fileDefaults[key] = init();
                  } else {
                    fileDefaults[key] = init;
                  }
                }
              } else if (
                prop.format === `prim` &&
                exists(createParams[key as keyof typeof createParams])
              ) {
                defaultProps[key] =
                  createParams[key as keyof typeof createParams];
              }
            }
            const newDocRef = await addDoc(collectionRef, {
              // ...getDefaultProps(),
              // ...createParams,
              ...defaultProps,
              ...(exists(parent) ? { mx_parent: parent } : {}),
            });
            for (const [key, initValue] of Object.entries(fileDefaults)) {
              if (exists(initValue)) {
                console.log(`initValue`, initValue);
                (docProx(newDocRef, typeName, objFormats) as any)[key] =
                  initValue;
              }
            }
            return newDocRef;
          })(),
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
            } else if (prop.format === `file`) {
              defaultProps[key] = {
                local: null,
                remote: null,
              };
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
          } else if (prop.type === `file`) {
            propFormats[propName] = {
              format: `file`,
              typeName: undefined,
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
