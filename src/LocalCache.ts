import { TypeSchemaDict, UPLOADING_FILE } from "./Parse";
import { JsonObject, exists, sleep } from "./utils";
import { MfsFileSystem, Signal } from "./Implement";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { newSignalTree, SignalEvent } from "./SignalTree";
import { initializeFirestoreSync } from "./FirestoreSync";
import { PersistedFunctionManager } from "./PersistedFunctionManager";
import { v4 as uuidv4 } from "uuid";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";

export const DELETED_KEY = `mx_deleted`;
export const MX_PARENT_KEY = `mx_parent`;

export type DocData = {
  [propName: string]: number | string | boolean | null | undefined;
};

export type LocalCache = ReturnType<typeof initializeCache>;
export function initializeCache({
  typeSchemas,
  getCollectionName,
  firebaseApp,
  firestore,
  firebaseStorage,
  auth,
  _signal,
  persistedFunctionManager,
  fileSystem,
  isProduction,
}: {
  typeSchemas: TypeSchemaDict;
  getCollectionName: (typeName: string) => string;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  firebaseStorage: FirebaseStorage;
  auth: Auth;
  _signal: <T>(initValue: T) => Signal<T>;
  persistedFunctionManager: PersistedFunctionManager;
  fileSystem: MfsFileSystem;
  isProduction: boolean;
}) {
  // SECTION: Offline Cache
  type OfflineCache = Partial<{
    lastChangeDate: {
      dev: number;
      prod: number;
    };
    childLists: {
      [childType: string]: {
        [parentId: string]: {
          [childId: string]: true;
        };
      };
    };
    types: {
      [typeName: string]: {
        [docId: string]: DocData;
      };
    };
  }>;
  const offlineCacheFileName = `mfs_offlineCache`;
  const _offlineCache = fileSystem
    .readFile(offlineCacheFileName)
    .then((saveFileString) => {
      return (
        exists(saveFileString) ? JSON.parse(saveFileString) : {}
      ) as OfflineCache;
    });
  let unPromisedOfflineCache: Partial<OfflineCache> | undefined = undefined;
  _offlineCache.then((cache) => {
    unPromisedOfflineCache = cache;
  });
  async function updateOfflineCache(updates: Partial<OfflineCache>) {
    const offlineCache = await _offlineCache;
    updateRec(offlineCache, updates);
    requestSave();
    function updateRec(original: any, updates: any) {
      for (const propName in updates) {
        const value = updates[propName];
        if (value === undefined) {
          // Undefined means delete
          delete original[propName];
        } else if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // Objects
          if (
            !exists(original[propName]) ||
            typeof original[propName] !== "object" ||
            Array.isArray(original[propName]) ||
            original[propName] === null
          ) {
            original[propName] = {};
          }
          updateRec(original[propName], value);
        } else {
          // Primitives
          original[propName] = value;
        }
      }
    }
    requestSave();
  }
  // Start save Loop
  let saveIndex = 0;
  let lastSaveIndex = saveIndex;
  function requestSave() {
    saveIndex += 1;
  }
  _offlineCache.then(async (offlineCache) => {
    while (true) {
      if (lastSaveIndex !== saveIndex) {
        await fileSystem.writeFile(
          offlineCacheFileName,
          JSON.stringify(offlineCache),
        );
        lastSaveIndex = saveIndex;
      }
      await sleep(250);
    }
  });

  // Signal tree
  const docSignalTree = newSignalTree<{
    [typeName: string]: {
      docsChanged: SignalEvent;
      parents: {
        [parentId: string]: SignalEvent;
      };
      docs: {
        [docId: string]: {
          [propName: string]: SignalEvent;
        };
      };
    };
  }>(_signal);
  const firestoreSync = initializeFirestoreSync(
    firebaseApp,
    firestore,
    firebaseStorage,
    auth,
    isProduction,
    persistedFunctionManager,
    fileSystem,
    _signal,
  );

  async function updateSessionStorage(params: {
    typeName: string;
    docId: string;
    props: {
      [propName: string]: number | string | boolean | null | undefined;
    };
  }) {
    const offlineCache = await _offlineCache;
    const collectionName = getCollectionName(params.typeName);

    // We use this to defer triggering listeners until after we have updated the cache
    const thingsToTrigger: (() => void)[] = [];

    // If this doc is being created or deleted, record that so we can notify listeners later
    const isBeingCreated = !exists(
      offlineCache.types?.[collectionName]?.[params.docId],
    );
    const isBeingDeleted = params.props[DELETED_KEY] === true;
    if (isBeingCreated || isBeingDeleted) {
      thingsToTrigger.push(() => {
        docSignalTree[params.typeName].docsChanged.trigger();
      });
    }

    // Record all the props that changed so we can notify listeners later
    const oldDoc = offlineCache.types?.[collectionName]?.[params.docId];
    // TODO: Run these notifications even if a previous version doesn't exists.
    for (const propName of Object.keys(params.props)) {
      if (!exists(oldDoc) || oldDoc[propName] !== params.props[propName]) {
        thingsToTrigger.push(() => {
          docSignalTree[params.typeName].docs[params.docId][propName].trigger();
        });
        if (propName === MX_PARENT_KEY) {
          // Notify Old Parent
          if (exists(oldDoc?.[propName])) {
            await updateOfflineCache({
              childLists: {
                [collectionName]: {
                  [oldDoc?.[propName] as string]: {
                    [params.docId]: undefined as any,
                  },
                },
              },
            });
            thingsToTrigger.push(() => {
              docSignalTree[params.typeName].parents[
                oldDoc?.[propName] as string
              ].trigger();
            });
          }
          // Notify New Parent
          if (exists(params.props[propName])) {
            await updateOfflineCache({
              childLists: {
                [collectionName]: {
                  [params.props[propName] as string]: {
                    [params.docId]: true,
                  },
                },
              },
            });
            thingsToTrigger.push(() => {
              docSignalTree[params.typeName].parents[
                params.props[propName] as string
              ].trigger();
            });
          }
        }
      }
    }

    // Download any new files.
    for (const propName of Object.keys(params.props)) {
      if (typeSchemas[params.typeName][propName]?.format === "file") {
        const fileId = params.props[propName] as string | null | undefined;
        if (!exists(fileId)) continue;
        (async () => {
          // TODO: Persist this file download in case it gets interrupted.
          await firestoreSync.downloadFile(fileId);
          docSignalTree[params.typeName].docs[params.docId][propName].trigger();
        })();
      }
    }

    // Apply the updates locally
    await updateOfflineCache({
      types: {
        [collectionName]: {
          [params.docId]: params.props,
        },
      },
    });

    // Now that we've made the updates, then trigger the changes.
    thingsToTrigger.forEach((trigger) => trigger());
  }

  _offlineCache.then(() => {
    // After we load data from the offline cache we should let the app know when the data is loaded.
    for (const typeName of Object.keys(typeSchemas)) {
      docSignalTree[typeName].docsChanged.trigger();
      for (const parentId of Object.keys(docSignalTree[typeName].parents)) {
        docSignalTree[typeName].parents[parentId].trigger();
      }
      for (const docId of Object.keys(docSignalTree[typeName].docs)) {
        for (const propName of Object.keys(
          docSignalTree[typeName].docs[docId],
        )) {
          docSignalTree[typeName].docs[docId][propName].trigger();
        }
      }
    }

    // Start syncing with the DB
    for (const typeName in typeSchemas) {
      firestoreSync.watchType(typeName, (docId, docUpdates) => {
        updateSessionStorage({
          typeName: typeName,
          docId: docId,
          props: docUpdates as any,
        });
      });
    }
  });
  return {
    listAllObjectsOfType(typeName: string) {
      docSignalTree[typeName].docsChanged.listen();
      const objects: string[] = [];
      for (const [docId, thisDoc] of Object.entries(
        unPromisedOfflineCache?.types?.[getCollectionName(typeName)] ?? {},
      )) {
        if (exists(thisDoc[DELETED_KEY]) && thisDoc[DELETED_KEY]) continue;
        objects.push(docId);
      }
      return objects;
    },
    checkExists(typeName: string, docId: string | null | undefined) {
      docSignalTree[typeName].docsChanged.listen();
      return (
        exists(docId) &&
        exists(
          unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId],
        )
      );
    },
    getChildDocs(childType: string, parentId: string) {
      docSignalTree[childType].parents[parentId].listen();
      return Object.keys(
        unPromisedOfflineCache?.childLists?.[getCollectionName(childType)]?.[
          parentId
        ] ?? {},
      );
      // const children: string[] = [];
      // for (const [docId, thisDoc] of Object.entries(
      //   clientStorage?.data.types?.[getCollectionName(childType)] ?? {},
      // )) {
      //   if (exists(thisDoc[DELETED_KEY]) && thisDoc[DELETED_KEY]) continue;
      //   if (thisDoc?.[MX_PARENT_KEY] === parentId) {
      //     children.push(docId);
      //   }
      // }
      // return children;
    },
    getPropValue(typeName: string, docId: string, propName: string) {
      docSignalTree[typeName].docs[docId][propName].listen();
      const propValue =
        unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[
          propName
        ];
      if (typeSchemas[typeName]?.[propName]?.format === "file") {
        if (!exists(propValue) || typeof propValue !== "string") return null;

        //  Check if a new file is being uploaded
        const fileIsUploading = firestoreSync.isFileUploading({
          docId,
          propName,
          fileId: propValue,
        });
        if (fileIsUploading) return UPLOADING_FILE;

        // Read the file from storage.
        return fileSystem.readFile(propValue) ?? null;
      } else {
        return propValue;
      }
    },
    getFilePath(typeName: string, docId: string, propName: string) {
      const fileId = unPromisedOfflineCache?.types?.[
        getCollectionName(typeName)
      ]?.[docId]?.[propName] as string | undefined | null;
      if (!exists(fileId)) return null;
      return fileSystem.getFilePath(fileId) ?? null;
    },
    addDoc(typeName: string, props: { [propName: string]: any }) {
      const docId = uuidv4();
      firestoreSync.uploadDocChange({
        shouldOverwrite: true,
        typeName,
        docId,
        data: props,
      });
      updateSessionStorage({ typeName, docId, props });

      return docId;
    },
    async setPropValue(
      typeName: string,
      docId: string,
      propName: string,
      value: any,
    ) {
      if (typeSchemas[typeName]?.[propName]?.format === "file") {
        const newFileId = uuidv4();

        // Write the file
        unPromisedOfflineCache = await _offlineCache;
        await fileSystem.writeFile(newFileId, value);

        // Write to server
        const oldFileId = unPromisedOfflineCache.types?.[
          getCollectionName(typeName)
        ]?.[docId]?.[propName] as string | undefined | null;
        firestoreSync.uploadFileChange({
          docTypeName: typeName,
          docId,
          propName,
          newFileId,
          oldFileId: oldFileId ?? undefined,
          notifyUploadStarted:
            docSignalTree[typeName].docs[docId][propName].trigger,
        });
      } else {
        // Write to server
        const changes = {
          [propName]: value,
        };
        firestoreSync.uploadDocChange({
          shouldOverwrite: false,
          typeName,
          docId,
          data: changes,
        });

        // Write locally
        updateSessionStorage({ typeName, docId, props: changes });
      }
    },
    deleteDoc(typeName: string, docId: string) {
      firestoreSync.uploadDocChange({
        shouldOverwrite: true,
        typeName,
        docId,
        data: {
          [DELETED_KEY]: true,
        },
      });

      // Delete any files
      for (const propName of Object.keys(typeSchemas[typeName])) {
        if (typeSchemas[typeName][propName]?.format === "file") {
          const fileId = unPromisedOfflineCache?.types?.[
            getCollectionName(typeName)
          ]?.[docId]?.[propName] as string | undefined | null;
          if (exists(fileId)) {
            firestoreSync.deleteFile({ fileId });
          }
        }
      }

      // Write locally
      const propKeys = Object.keys(typeSchemas[typeName]);
      updateSessionStorage({
        typeName,
        docId,
        props: {
          [DELETED_KEY]: true,
          [MX_PARENT_KEY]: undefined,
          ...propKeys.reduce(
            (total, curr) => ({
              ...total,
              [curr]: undefined,
            }),
            {},
          ),
        },
      });
    },
  };
}
