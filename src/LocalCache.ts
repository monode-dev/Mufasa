import { TypeSchemaDict, UPLOADING_FILE } from "./Parse";
import { JsonObject, NONEXISTENT, exists, sleep } from "./utils";
import { MfsFileSystem, Signal } from "./Implement";
import { FirebaseApp } from "firebase/app";
import { newSignalTree, SignalEvent } from "./SignalTree";
import { initializeFirestoreSync } from "./FirestoreSync";
import { PersistedFunctionManager } from "./PersistedFunctionManager";
import { v4 as uuidv4 } from "uuid";
import { PropGetter, PropSetter, prop } from "./Reactivity";

export const DELETED_KEY = `mx_deleted`;
export const MX_PARENT_KEY = `mx_parent`;

export type DocData = {
  [propName: string]: PropValue;
};
export type PropValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      value: string | number | boolean | null | undefined;
      typeName: string;
    };

export type LocalCache = ReturnType<typeof initializeCache>;
export function initializeCache({
  getCollectionName,
  firebaseApp,
  _signal,
  createSignal,
  createComputed,
  persistedFunctionManager,
  fileSystem,
  isProduction,
}: {
  getCollectionName: (typeName: string) => string;
  firebaseApp: FirebaseApp;
  _signal: <T>(initValue: T) => Signal<T>;
  createSignal: <T>(initValue: T) => PropGetter<T> & PropSetter<T>;
  createComputed: <T>(evaluate: () => T) => PropGetter<T>;
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
    // childLists: {
    //   [childType: string]: {
    //     [parentId: string]: {
    //       [childId: string]: true;
    //     };
    //   };
    // };
    indexes: {
      [typeName: string]: {
        [propName: string]: {
          [propValue: string]: {
            [docId: string]: true;
          };
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
      indexes: {
        [propName: string]: {
          [propValue: string]: SignalEvent;
        };
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
    isProduction,
    persistedFunctionManager,
    fileSystem,
  );

  async function updateSessionStorage(params: {
    typeName: string;
    docId: string;
    props: DocData;
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
              indexes: {
                [params.typeName]: {
                  [propName]: {
                    [oldDoc?.[propName] as string]: {
                      [params.docId]: undefined as any,
                    },
                  },
                },
              },
            });
            thingsToTrigger.push(() => {
              docSignalTree[params.typeName].indexes[propName][
                oldDoc?.[propName] as string
              ].trigger();
            });
          }
          // Notify New Parent
          if (exists(params.props[propName])) {
            await updateOfflineCache({
              indexes: {
                [params.typeName]: {
                  [propName]: {
                    [params.props[propName] as string]: {
                      [params.docId]: true,
                    },
                  },
                },
              },
            });
            thingsToTrigger.push(() => {
              docSignalTree[params.typeName].indexes[propName][
                params.props[propName] as string
              ].trigger();
            });
          }
        }
      }
    }

    // Download any new files.
    for (const propName of Object.keys(params.props)) {
      const propValue = params.props[propName];
      if (typeof propValue === "object" && propValue?.typeName === `file`) {
        const fileId = propValue.value as string;
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

  // We need to tell the DB what types to watch for.
  const syncedTypes = new Set<string>();
  async function syncType(typeName: string) {
    await _offlineCache;
    if (syncedTypes.has(typeName)) return;
    syncedTypes.add(typeName);
    // Start syncing with the DB
    firestoreSync.watchType(typeName, (docId, docUpdates) => {
      updateSessionStorage({
        typeName: typeName,
        docId: docId,
        props: docUpdates as any,
      });
    });
  }

  _offlineCache.then((offlineCache) => {
    const typeNames = Object.keys(offlineCache.types ?? {});
    // After we load data from the offline cache we should let the app know when the data is loaded.
    for (const typeName of typeNames) {
      docSignalTree[typeName].docsChanged.trigger();
      for (const propName of Object.keys(docSignalTree[typeName].indexes)) {
        for (const propValue of Object.keys(
          docSignalTree[typeName].indexes[propName],
        )) {
          docSignalTree[typeName].indexes[propName][propValue].trigger();
        }
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
    typeNames.forEach(syncType);
  });

  return {
    syncType: syncType,

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
      return this.getIndexedDocs(childType, MX_PARENT_KEY, parentId);
    },
    getIndexedDocs(typeName: string, propName: string, propValue: string) {
      docSignalTree[typeName].indexes[propName][propValue].listen();
      return Object.keys(
        unPromisedOfflineCache?.indexes?.[typeName]?.[propName]?.[propValue] ??
          {},
      );
    },
    getPropValue(typeName: string, docId: string, propName: string) {
      docSignalTree[typeName].docs[docId][propName].listen();
      const propValue =
        unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId]?.[
          propName
        ];
      if (typeof propValue === "object" && propValue?.typeName === `file`) {
        const fileId = propValue.value as string;

        //  Check if a new file is being uploaded
        const fileIsUploading = firestoreSync.isFileUploading({
          docId,
          propName,
          fileId: fileId,
        });
        if (fileIsUploading) return UPLOADING_FILE;

        // Read the file from storage.
        return fileSystem.readFile(fileId) ?? NONEXISTENT;
      } else {
        return propValue ?? NONEXISTENT;
      }
    },
    getFilePath(typeName: string, docId: string, propName: string) {
      const fileId = unPromisedOfflineCache?.types?.[
        getCollectionName(typeName)
      ]?.[docId]?.[propName] as string | undefined | null;
      if (!exists(fileId)) return null;
      return fileSystem.getFilePath(fileId) ?? null;
    },
    addDoc(
      typeName: string,
      props: { [propName: string]: any },
      mfsId?: string,
    ) {
      mfsId = mfsId ?? uuidv4();
      firestoreSync.uploadDocChange({
        shouldOverwrite: true,
        typeName,
        docId: mfsId,
        data: props,
      });
      updateSessionStorage({ typeName, docId: mfsId, props });

      return mfsId;
    },
    async setPropValue(
      typeName: string,
      docId: string,
      propName: string,
      value:
        | string
        | number
        | boolean
        | null
        | undefined
        | {
            value: string | number | boolean | null | undefined;
            typeName: string;
          },
    ) {
      if (typeof value === "object" && value?.typeName === `file`) {
        const newFileId = uuidv4();

        // Write the file
        unPromisedOfflineCache = await _offlineCache;
        await fileSystem.writeFile(newFileId, value.value as string);

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

    // TODO: Insert a addIndex function here.
    async indexOnProp(typeName: string, propName: string) {
      const offlineCache = await _offlineCache;
      const collectionName = getCollectionName(typeName);

      // Index all existing docs
      const indexedData: {
        [propValue: string]: {
          [docId: string]: true;
        };
      } = {};
      for (const [docId, docData] of Object.entries(
        offlineCache.types?.[collectionName] ?? {},
      )) {
        const propValue = docData[propName];
        if (exists(propValue)) {
          indexedData[propValue as string] = {
            ...(indexedData[propValue as string] ?? {}),
            [docId]: true,
          };
        }
      }

      // Add the index
      updateOfflineCache({
        indexes: {
          [typeName]: {
            [propName]: indexedData,
          },
        },
      });
    },

    createSignal: createSignal,

    createComputed: createComputed,

    deleteDoc(typeName: string, docId: string) {
      firestoreSync.uploadDocChange({
        shouldOverwrite: true,
        typeName,
        docId,
        data: {
          [DELETED_KEY]: true,
        },
      });

      const docData =
        unPromisedOfflineCache?.types?.[getCollectionName(typeName)]?.[docId];
      if (exists(docData)) {
        const propKeys = Object.keys(docData);

        // Delete any files
        for (const propName of Object.keys(docData)) {
          const propValue = docData[propName];
          if (typeof propValue === "object" && propValue?.typeName === `file`) {
            const fileId = propValue.value as string;
            if (exists(fileId)) {
              firestoreSync.deleteFile({ fileId });
            }
          }
        }

        // Write locally
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
      }
    },
  };
}
