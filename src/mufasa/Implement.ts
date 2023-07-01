import { defineStore } from "pinia";
import { initializeApp, FirebaseOptions } from "firebase/app";
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
  QuerySnapshot,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {
  ComputedRef,
  Ref,
  ShallowReactive,
  UnwrapRef,
  computed,
  isRef,
  ref,
  shallowReactive,
  watchEffect,
} from "vue";
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

let firebaseDb: Firestore;

async function getUuid() {
  return `${(await Device.getId()).uuid}-${Date.now()}`;
}

// async function completeFileUpload({
//   docPath,
//   propKey,
//   fileId,
//   data,
//   oldFileIdToDelete,
// }: {
//   docPath: string;
//   propKey: string;
//   fileId: string;
//   data: string;
//   oldFileIdToDelete: string | undefined;
// }) {
//   // Upload data to firebase storage
//   let haveUploaded = false;
//   while (!haveUploaded) {
//     try {
//       await uploadBytes(
//         storageRef(getStorage(firebasApp), `MX_Files/${fileId}.txt`),
//         new TextEncoder().encode(data),
//       );
//       haveUploaded = true;
//     } catch (err) {}
//   }
//   await writeFileToIndexedDB(`MX_Files`, `${fileId}.txt`, data);
//   // await Filesystem.writeFile({
//   //   path: `MX_Files/${fileId}.txt`,
//   //   data: data,
//   //   directory: Directory.Data,
//   //   encoding: Encoding.UTF8,
//   //   recursive: true,
//   // });

//   deleteFileFromIndexedDB(`MX_FilesToUpload`, `${fileId}.txt`);
//   // Filesystem.deleteFile({
//   //   path: `MX_FilesToUpload/${fileId}.txt`,
//   //   directory: Directory.Data,
//   // });

//   deleteFileFromIndexedDB(`MX_FilesToUpload`, `${fileId}.json`);
//   // Filesystem.deleteFile({
//   //   path: `MX_FilesToUpload/${fileId}.json`,
//   //   directory: Directory.Data,
//   // });
//   updateDoc(doc(firebaseDb, docPath), {
//     [propKey]: {
//       local: null,
//       remote: fileId,
//     },
//   });
//   if (exists(oldFileIdToDelete)) {
//     deleteObject(
//       storageRef(getStorage(firebasApp), `MX_Files/${oldFileIdToDelete}.txt`),
//     );
//   }
// }

//
//
//
//
// SECTION: Doc
export type Doc<T extends {} = {}> = {
  [K in keyof T]: T[K] | undefined;
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
    | Ref<DocumentReference | null | undefined>
    | null
    | undefined,
  typeName: TypeName,
  objFormats: F,
  localCache: ReturnType<typeof createCache>,
): T {
  // if (typeName === `Client` && Date.now() - start < logDurrationFromStart) {
  //   const error = new Error();
  //   const stackTrace = error.stack!.split("\n");
  //   const callerLine = stackTrace[2]; // The line number of the calling function

  //   console.log("Caller:", callerLine);
  // }
  // const chars = genRandomChars(10);
  // const data = ref<T | null | undefined>(null);

  // Add standard props
  const hasBeenDeleted = ref(false);
  let haveSetUpDeletionWatch = false;
  watchEffect(() => {
    const actualDocRef = isRef(docRef) ? docRef.value : docRef;
    if (!exists(actualDocRef)) return;
    const doesExist = localCache.checkDeletion(typeName, actualDocRef.path);
    // We skip the first run so we only watch for changes.
    if (haveSetUpDeletionWatch) {
      hasBeenDeleted.value = doesExist;
    } else {
      haveSetUpDeletionWatch = true;
    }
  });
  let proxy: Doc<{ [key: string]: any }> = {
    get _firestoreRef() {
      const actualDocRef = isRef(docRef) ? docRef.value : docRef;
      return actualDocRef ?? undefined;
    },
    get isLoaded() {
      const actualDocRef = isRef(docRef) ? docRef.value : docRef;
      if (exists(actualDocRef)) {
        return localCache.checkExists(typeName, actualDocRef.path);
      } else {
        return false;
      }
    },
    get isDeleted() {
      return hasBeenDeleted.value;
    },
    async deleteDoc() {
      const actualDocRef = isRef(docRef) ? docRef.value : docRef;
      if (exists(actualDocRef)) {
        // Delete all sub docs
        for (const format of Object.values(objFormats[typeName])) {
          if (format.format === `many`) {
            const collectionRef = collection(firebaseDb, format.typeName!);
            const docs = await getDocs(
              query(collectionRef, where(`mx_parent`, "==", actualDocRef)),
            );
            docs.forEach((doc) =>
              docProx(
                doc.ref,
                format.typeName!,
                objFormats,
                localCache,
              ).deleteDoc(),
            );
          }
        }
        await deleteDoc(actualDocRef);
      }
    },
  };
  // (async () => {
  //   const unpromisedDocRef = await docRef;
  //   let lastData: DocumentData | null = null;
  //   function hasChanged(newData: DocumentData | null) {
  //     if (lastData === null) return true;
  //     if (newData === null) return true;
  //     for (const key of Object.keys(newData)) {
  //       if (lastData[key] !== newData[key]) return true;
  //     }
  //     for (const key of Object.keys(lastData)) {
  //       if (lastData[key] !== newData[key]) return true;
  //     }
  //     return false;
  //   }
  //   if (!exists(unpromisedDocRef)) {
  //     data.value = undefined;
  //   } else {
  //     onSnapshot(unpromisedDocRef, (doc) => {
  //       // if (Date.now() - start < logDurrationFromStart)
  //       //   console.log(`Snapshot: ${chars} - ${typeName} = ${doc.ref.path}`);
  //       if (hasChanged(doc.data() ?? null)) {
  //         lastData = doc.data() ?? null;
  //         data.value = doc.data() as UnwrapRef<T> | null | undefined;
  //       }
  //     });
  //   }
  // })();

  // Add getters and setters for each property
  for (let [propKey, format] of Object.entries(objFormats[typeName])) {
    if (format.format === `one`) {
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return docProx(
            localCache.getPropValue(
              typeName,
              proxy._firestoreRef?.path ?? ``,
              propKey,
            ) as DocumentReference | null | undefined,
            format.typeName!,
            objFormats,
            localCache,
          );
        },
        set: function (newValue: any) {
          (async () => {
            const actualDocRef = proxy._firestoreRef;
            if (
              exists(actualDocRef) &&
              proxy._firestoreRef?.path !== newValue?._firestoreRef?.path
            ) {
              updateDoc(actualDocRef, {
                [propKey]: newValue?._firestoreRef ?? null,
              });
            }
          })();
        },
      });
    } else if (format.format === `many`) {
      /** NOTE: We use to have to instnatiate the list proxy here. I think it was beacuse
       * of the infinite reactive refresh bug. I don't think we have to do this anymore. */
      // const actualDocRef = isRef(docRef) ? docRef.value : docRef;
      // const newListProx = listProx(
      //   format.typeName!,
      //   objFormats,
      //   localCache,
      //   true,
      //   typeName,
      //   actualDocRef,
      //   propKey,
      // );
      // Object.defineProperty(proxy, propKey, {
      //   get: function () {
      //     return newListProx;
      //   },
      //   set: undefined,
      // });
      Object.defineProperty(proxy, propKey, {
        get: function () {
          const actualDocRef = isRef(docRef) ? docRef.value : docRef;
          return listProx(
            format.typeName!,
            objFormats,
            localCache,
            true,
            typeName,
            actualDocRef,
            propKey,
          );
        },
        set: undefined,
      });
    }
    // else if (format.format === `file`) {
    //   Object.defineProperty(proxy, propKey, {
    //     get: async function () {
    //       const fileDetails = data.value?.[
    //         propKey as keyof typeof data.value
    //       ] as any;

    //       if (exists(fileDetails)) {
    //         if (
    //           exists(fileDetails) &&
    //           `local` in fileDetails &&
    //           exists(fileDetails.local)
    //         ) {
    //           try {
    //             const result = await readFileFromIndexedDB(
    //               `MX_FilesToUpload`,
    //               `${fileDetails.local}.txt`,
    //             );
    //             return result;
    //             // const result = await Filesystem.readFile({
    //             //   path: `MX_FilesToUpload/${fileDetails}.txt`,
    //             //   directory: Directory.Data,
    //             //   encoding: Encoding.UTF8,
    //             // });
    //             // return result.data;
    //           } catch (err) {
    //             try {
    //               const result = await readFileFromIndexedDB(
    //                 `MX_Files`,
    //                 `${fileDetails.remote}.txt`,
    //               );
    //               return result;
    //               // const result = await Filesystem.readFile({
    //               //   path: `MX_Files/${fileDetails}.txt`,
    //               //   directory: Directory.Data,
    //               //   encoding: Encoding.UTF8,
    //               // });
    //               // return result.data;
    //             } catch (err) {
    //               return null;
    //             }
    //           }
    //         } else {
    //           try {
    //             const result = await readFileFromIndexedDB(
    //               `MX_Files`,
    //               `${fileDetails.remote}.txt`,
    //             );
    //             return result;
    //             // const result = await Filesystem.readFile({
    //             //   path: `MX_Files/${fileDetails}.txt`,
    //             //   directory: Directory.Data,
    //             //   encoding: Encoding.UTF8,
    //             // });
    //             // return result.data;
    //           } catch (err) {
    //             return null;
    //           }
    //         }
    //       } else {
    //         return fileDetails;
    //       }
    //     },
    //     set: async function (newValue: Promise<string | null> | string | null) {
    //       const actualDocRef = proxy._firestoreRef;
    //       if (exists(actualDocRef)) {
    //         const newPropData = await newValue;
    //         if (exists(newPropData)) {
    //           const newFileId = await getUuid();

    //           // Write newValue to local storage
    //           await writeFileToIndexedDB(
    //             `MX_FilesToUpload`,
    //             `${newFileId}.txt`,
    //             newPropData,
    //           );
    //           // await Filesystem.writeFile({
    //           //   path: `MX_FilesToUpload/${newFileId}.txt`,
    //           //   data: newPropData,
    //           //   directory: Directory.Data,
    //           //   encoding: Encoding.UTF8,
    //           //   recursive: true,
    //           // });

    //           await writeFileToIndexedDB(
    //             `MX_FilesToUpload`,
    //             `${newFileId}.json`,
    //             JSON.stringify({
    //               docRef: actualDocRef.path,
    //               propKey,
    //             }),
    //           );
    //           // await Filesystem.writeFile({
    //           //   path: `MX_FilesToUpload/${newFileId}.json`,
    //           //   data: JSON.stringify({
    //           //     docRef: actualDocRef.path,
    //           //     propKey,
    //           //   }),
    //           //   directory: Directory.Data,
    //           //   encoding: Encoding.UTF8,
    //           //   recursive: true,
    //           // });
    //           const fileDetails =
    //             data.value?.[propKey as keyof typeof data.value];
    //           updateDoc(actualDocRef, {
    //             [propKey]: {
    //               ...(fileDetails ?? { remote: null }),
    //               local: newFileId,
    //             },
    //           });
    //           completeFileUpload({
    //             docPath: actualDocRef.path,
    //             propKey,
    //             fileId: newFileId,
    //             data: newPropData,
    //             oldFileIdToDelete: ((fileDetails as any) ?? { remote: null })
    //               .remote,
    //           });
    //         } else {
    //           updateDoc(actualDocRef, {
    //             [propKey]: {
    //               local: null,
    //               remote: null,
    //             },
    //           });
    //         }
    //       }
    //     },
    //   });
    // }
    else {
      Object.defineProperty(proxy, propKey, {
        get: function () {
          return localCache.getPropValue(
            typeName,
            proxy._firestoreRef?.path ?? ``,
            propKey,
          );
        },
        set: function (newValue: any) {
          const actualDocRef = proxy._firestoreRef;
          if (exists(actualDocRef) && proxy[propKey] !== newValue) {
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
// function genRandomChars(length: number) {
//   let result = ``;
//   const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }
const PARENT_KEY = `mx_parent`;
const start = Date.now();
const logDurrationFromStart = 2000;
function listProx<
  TypeName extends string,
  F extends ObjFormats,
  T extends Doc = FormatToTsType<TypeName, F>,
>(
  typeName: TypeName,
  objFormats: F,
  localCache: ReturnType<typeof createCache>,
  isChild: boolean = false,
  parentType?: string,
  mx_parent?: DocumentReference | null | undefined,
  propNameOnParent?: string,
) {
  // const chars = genRandomChars(10);
  const collectionRef = collection(firebaseDb, typeName);
  // const collectionList = (() => {
  //   const collectionList = ref<T[]>([]);
  //   let lastSnapshot: QuerySnapshot | null = null;
  //   function hasChanged(querySnapshot: QuerySnapshot) {
  //     if (lastSnapshot === null) return true;
  //     if (querySnapshot.size !== lastSnapshot.size) return true;
  //     for (let i = 0; i < querySnapshot.size; i++) {
  //       if (querySnapshot.docs[i].ref.path !== lastSnapshot.docs[i].ref.path)
  //         return true;
  //     }
  //     return false;
  //   }
  //   if (isChild) {
  //     if (mx_parent) {
  //       (async () => {
  //         const unpromisedParent = await mx_parent;
  //         onSnapshot(
  //           // If we used this for both children and non children, root lists would get all docs without a parent, which might be what we want.
  //           query(collectionRef, where(PARENT_KEY, "==", unpromisedParent)),
  //           (querySnapshot) => {
  //             // if (Date.now() - start < logDurrationFromStart)
  //             //   console.log(
  //             //     `Snapshot: ${chars} - only ${typeName}s with parent: ${
  //             //       (mx_parent as any)?.path
  //             //     }`,
  //             //   );
  //             if (hasChanged(querySnapshot)) {
  //               lastSnapshot = querySnapshot;
  //               collectionList.value = querySnapshot.docs.map((doc) => {
  //                 return docProx(doc.ref, typeName, objFormats, localCache);
  //               });
  //             }
  //           },
  //         );
  //       })();
  //     }
  //   } else {
  //     onSnapshot(collectionRef, (querySnapshot) => {
  //       // if (Date.now() - start < logDurrationFromStart)
  //       //   console.log(`Snapshot: ${chars} - all ${typeName}s`);
  //       if (hasChanged(querySnapshot)) {
  //         collectionList.value = querySnapshot.docs.map((doc) =>
  //           docProx(doc.ref, typeName, objFormats, localCache),
  //         );
  //       }
  //     });
  //   }
  //   return collectionList;
  // })();
  if (isChild) {
    // const mx_parentPath: Ref<undefined | string> = ref(undefined);
    // (async () => {
    //   const unawaitedParent = await mx_parent;
    //   const path = (unawaitedParent as any)?.path;
    //   console.log(`path`, path);
    //   mx_parentPath.value = path;
    // })();
    const collectionList = computed(() => {
      if (exists((mx_parent as any)?.path)) {
        return (
          localCache.getPropValue(
            parentType!,
            (mx_parent as any)?.path!,
            propNameOnParent!,
          ) as DocumentReference[]
        ).map((elementRef) =>
          docProx(elementRef, typeName, objFormats, localCache),
        );
      } else {
        return [];
      }
    });
    return vueRefToList(collectionList, mx_parent);
  } else {
    const collectionList = computed(() =>
      localCache
        .listAllObjectsOfType(typeName)
        .map((elementRef) =>
          docProx(elementRef, typeName, objFormats, localCache),
        ),
    );
    return vueRefToList(collectionList, mx_parent);
  }
  function vueRefToList<T extends Doc<{}>>(
    collectionList: ComputedRef<T[]> | Ref<T[]>,
    mx_parent?: DocumentReference | null | undefined,
  ): List<T> {
    return {
      [Symbol.iterator]: () => collectionList.value[Symbol.iterator](),
      get length() {
        // if (typeName === `Tank` && Date.now() - start < logDurrationFromStart)
        //   console.log(`${chars} ${(mx_parent as any)?.path}`);
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
          (() => {
            const newDocRef = ref(null as null | DocumentReference);

            (async () => {
              const parent = mx_parent;

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
                } else if (
                  prop.format === `one` &&
                  exists(createParams[key as keyof typeof createParams])
                ) {
                  defaultProps[key] = (
                    createParams[key as keyof typeof createParams] as Doc
                  )?._firestoreRef;
                }
              }
              newDocRef.value = await addDoc(collectionRef, {
                // ...getDefaultProps(),
                // ...createParams,
                ...defaultProps,
                ...(exists(parent) ? { mx_parent: parent } : {}),
              });
              for (const [key, initValue] of Object.entries(fileDefaults)) {
                if (exists(initValue)) {
                  // console.log(`initValue`, initValue);
                  (docProx(newDocRef, typeName, objFormats, localCache) as any)[
                    key
                  ] = initValue;
                }
              }
            })();

            return newDocRef;
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
function createCache(objFormats: ObjFormats) {
  type DocCache = {
    [propName: string]: Ref<
      number | string | boolean | null | DocumentReference
    >;
  } & { mx_parentPath?: string; deletionCheck: Ref<boolean> };
  const getParentOf = (() => {
    const parentOfMap: {
      [childType: string]: {
        parentType: string;
        propName: string;
      };
    } = {};
    for (const typeName of Object.keys(objFormats)) {
      // This obj is the parent of any of it's many props
      const props = objFormats[typeName];
      for (const [propName, propFormat] of Object.entries(props)) {
        if (propFormat.format === `many`) {
          parentOfMap[propFormat.typeName!] = {
            parentType: typeName,
            propName: propName,
          };
        }
      }
    }
    return function (childType: string) {
      return parentOfMap[childType];
    };
  })();
  const cache: {
    [collection: string]: {
      docsChanged: Ref<number>;
      docs: {
        [docPath: string]: DocCache;
      };
    };
  } = {};
  function createDocCache(
    initData: DocumentData,
    docFormat: ObjFormats[string],
  ) {
    const docCache: DocCache = {
      deletionCheck: ref(false),
    };
    for (const [propName, propFormat] of Object.entries(docFormat)) {
      if (propFormat.format === `many`) {
        docCache[propName] = ref(0);
      } else {
        docCache[propName] = ref(initData[propName]);
      }
    }
    if (initData.mx_parent) {
      docCache.mx_parentPath = initData.mx_parent.path;
    }
    return docCache;
  }
  function updateDocCache(
    docCache: DocCache,
    newData: DocumentData,
    docFormat: ObjFormats[string],
  ) {
    for (const propName in docFormat) {
      // console.log(propName);
      const oldValue = docCache[propName].value;
      const newValue = newData[propName];
      if (oldValue !== newValue) {
        docCache[propName].value = newData[propName];
      }
    }
  }
  for (const typeName in objFormats) {
    const collectionRef = collection(firebaseDb, typeName);
    cache[typeName] = {
      docsChanged: ref(0),
      docs: {},
    };
    onSnapshot(collectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docPath = change.doc.ref.path;
        const docData = change.doc.data();
        if (change.type === "added") {
          cache[typeName].docs[docPath] = createDocCache(
            docData,
            objFormats[typeName],
          );
          cache[typeName].docsChanged.value += 1;
          if (exists(docData.mx_parent)) {
            const newPropPath = docData.mx_parent?.path;
            const parentInfo = getParentOf(typeName);
            if (exists(parentInfo)) {
              const newParentsProp =
                cache[parentInfo.parentType]?.docs[newPropPath]?.[
                  parentInfo.propName
                ];
              if (exists(newParentsProp)) {
                (newParentsProp.value as number) += 1;
              }
            }
          }
          // console.log(`added`, docPath, docData);
        } else if (change.type === "modified") {
          updateDocCache(
            cache[typeName].docs[docPath],
            docData,
            objFormats[typeName],
          );
          if (
            docData.mx_parent?.path !==
            cache[typeName].docs[docPath].mx_parentPath
          ) {
            const oldPropPath = cache[typeName].docs[docPath].mx_parentPath;
            const newPropPath = docData.mx_parent?.path;
            const parentInfo = getParentOf(typeName);
            if (exists(parentInfo)) {
              if (exists(oldPropPath)) {
                const oldParentsProp =
                  cache[parentInfo.parentType].docs[oldPropPath][
                    parentInfo.propName
                  ];
                if (exists(oldParentsProp)) {
                  (oldParentsProp.value as number) += 1;
                }
              }
              const newParentsProp =
                cache[parentInfo.parentType].docs[newPropPath][
                  parentInfo.propName
                ];
              if (exists(newParentsProp)) {
                (newParentsProp.value as number) += 1;
              }
            }
          }
          // console.log(`modified`, docPath, docData);
        } else if (change.type === "removed") {
          cache[typeName].docs[docPath].deletionCheck.value = true;
          delete cache[typeName].docs[docPath];
          cache[typeName].docsChanged.value += 1;
          // console.log(`removed`, docPath, docData);
        }
      });
    });
  }
  return {
    listAllObjectsOfType(typeName: string) {
      // Do this so that vue knows to update when the list changes
      cache[typeName].docsChanged.value;
      const objects: DocumentReference[] = [];
      for (const docPath in cache[typeName].docs) {
        objects.push(doc(firebaseDb, docPath));
      }
      return objects;
    },
    checkExists(typeName: string, objPath: string) {
      return exists(cache[typeName].docs[objPath]);
    },
    checkDeletion(typeName: string, objPath: string) {
      return cache[typeName].docs[objPath]?.deletionCheck.value;
    },
    getPropValue(typeName: string, objPath: string, propName: string) {
      if (objFormats[typeName][propName].format === `many`) {
        // Do this so that vue knows to update when the list changes
        cache[typeName].docs[objPath]?.[propName].value;
        const childType = objFormats[typeName][propName].typeName!;
        const contents: DocumentReference[] = [];
        for (const docPath in cache[childType].docs) {
          const thisDoc = cache[childType].docs[docPath];
          if (thisDoc.mx_parentPath === objPath) {
            contents.push(doc(firebaseDb, docPath));
          }
        }
        return contents;
      } else {
        return cache[typeName].docs[objPath]?.[propName].value;
      }
    },
  };
}
export function defineAppDataStructure<T extends { [key: string]: DefMany }>(
  modelName: string,
  firebaseOptions: FirebaseOptions,
  modelDef: T,
) {
  // Setup Firebase
  const firebasApp = initializeApp(firebaseOptions);
  firebaseDb = initializeFirestore(firebasApp, {
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

  // Setup Mufasa interface
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
      const localCache = createCache(objFormats);

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
            localCache,
          ) as any;
        }
      }
      return manyCollections;
    }),
    mufasaTypes: {} as FormatToTs<typeof objFormats>,
  };
}
