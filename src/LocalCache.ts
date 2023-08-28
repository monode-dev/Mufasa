import {
  onSnapshot,
  doc,
  CollectionReference,
  Firestore,
  query,
  where,
  collection,
} from "firebase/firestore";
import { TypeSchemaDict, UPLOADING_FILE } from "./Parse";
import { exists } from "./utils";
import { Signal } from "./Implement";
import { FirebaseApp } from "firebase/app";
import { GetClientStorage } from "./ClientStorage/ClientStorage";
import { newSignalTree, SignalEvent } from "./SignalTree";
import { loadChangeUploader } from "./ServerStorage/ChangeUploader";
import { getStorage, getBytes, ref as storageRef } from "firebase/storage";

export const CHANGE_DATE_KEY = `mx_changeDate`;
export const DELETED_KEY = `mx_deleted`;
export const MX_PARENT_KEY = `mx_parent`;

export type DocData = {
  [propName: string]: number | string | boolean | null | undefined;
};

export type LocalCache = ReturnType<typeof createCache>;
export function createCache({
  typeSchemas,
  getCollectionName,
  firebaseApp,
  firestoreDb,
  _signal,
  getClientStorage,
  isProduction,
}: {
  typeSchemas: TypeSchemaDict;
  getCollectionName: (typeName: string) => string;
  firebaseApp: FirebaseApp;
  firestoreDb: Firestore;
  _signal: (initValue: any) => Signal<any>;
  getClientStorage: GetClientStorage;
  isProduction: boolean;
}) {
  console.log(`About to Load client storage.`);
  const promisedClientStorage = getClientStorage<{
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
  }>(`mx_docs`, {
    lastChangeDate: {
      dev: 0,
      prod: 0,
    },
    childLists: {},
    types: {},
  });
  type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
    ? U
    : never;
  let clientStorage: PromiseType<typeof promisedClientStorage> | undefined =
    undefined;
  (async () => {
    clientStorage = await promisedClientStorage;
  })();
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
  const changeUploader = loadChangeUploader(
    firestoreDb,
    firebaseApp,
    getClientStorage,
  );
  const serverFileStorage = getStorage(firebaseApp);

  async function updateSessionStorage(params: {
    typeName: string;
    docId: string;
    props: {
      [propName: string]: number | string | boolean | null | undefined;
    };
  }) {
    const clientStorage = await promisedClientStorage;
    const collectionName = getCollectionName(params.typeName);

    // We use this to defer triggering listeners until after we have updated the cache
    const thingsToTrigger: (() => void)[] = [];

    // If this doc is being created or deleted, record that so we can notify listeners later
    const isBeingCreated = !exists(
      clientStorage.data?.types?.[collectionName]?.[params.docId],
    );
    const isBeingDeleted = params.props[DELETED_KEY] === true;
    if (isBeingCreated || isBeingDeleted) {
      thingsToTrigger.push(() => {
        docSignalTree[params.typeName].docsChanged.trigger();
      });
    }

    // Record all the props that changed so we can notify listeners later
    const oldDoc = clientStorage.data?.types?.[collectionName]?.[params.docId];
    // TODO: Run these notifications even if a previous version doesn't exists.
    for (const propName of Object.keys(params.props)) {
      if (!exists(oldDoc) || oldDoc[propName] !== params.props[propName]) {
        thingsToTrigger.push(() => {
          docSignalTree[params.typeName].docs[params.docId][propName].trigger();
        });
        if (propName === MX_PARENT_KEY) {
          // Notify Old Parent
          if (exists(oldDoc?.[propName])) {
            clientStorage.updateData({
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
            clientStorage.updateData({
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
          const bytes = await getBytes(storageRef(serverFileStorage, fileId));
          const asString = new TextDecoder("utf-8").decode(bytes);
          await clientStorage.writeFile(fileId, asString);
          docSignalTree[params.typeName].docs[params.docId][propName].trigger();
        })();
      }
    }

    // Apply the updates locally
    clientStorage.updateData({
      types: {
        [collectionName]: {
          [params.docId]: params.props,
        },
      },
    });

    // Now that we've made the updates, then trigger the changes.
    thingsToTrigger.forEach((trigger) => trigger());
  }

  (async () => {
    const lastChangeDateProdKey = isProduction ? "prod" : "dev";
    const clientStorage = await promisedClientStorage;
    console.log(`Finished Loading promisedClientStorage`);
    for (const typeName of Object.keys(typeSchemas)) {
      console.log(
        `${typeName}: ${
          Object.keys(clientStorage.data.types?.[typeName] ?? {}).length
        }`,
      );
      // Let the app know when the data is loaded.
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
    console.log(
      `lastChangeDate: ${clientStorage.data.lastChangeDate?.[lastChangeDateProdKey]}`,
    );
    // for (const typeName in typeSchemas) {
    //   onSnapshot(
    //     query(
    //       collection(firestoreDb, getCollectionName(typeName)),
    //       where(
    //         CHANGE_DATE_KEY,
    //         ">",
    //         new Date(
    //           (clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ??
    //             0) *
    //             1000 -
    //             30,
    //         ),
    //       ),
    //     ),
    //     (snapshot) => {
    //       let mostRecentChangeDate =
    //         clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ?? 0;
    //       snapshot.docChanges().forEach((change) => {
    //         if (change.type !== "removed") {
    //           const docData = change.doc.data();
    //           mostRecentChangeDate = Math.max(
    //             mostRecentChangeDate,
    //             docData[CHANGE_DATE_KEY].seconds,
    //           );
    //           updateSessionStorage({
    //             typeName: typeName,
    //             docId: change.doc.ref.path,
    //             props: docData,
    //           });
    //         }
    //       });
    //       console.log(
    //         `${typeName} docs changed: ${snapshot.docChanges().length}`,
    //       );
    //       if (
    //         mostRecentChangeDate >
    //         (clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ?? 0)
    //       ) {
    //         clientStorage.updateData({
    //           lastChangeDate: {
    //             [lastChangeDateProdKey]: mostRecentChangeDate,
    //           } as any,
    //         });
    //         console.log(
    //           new Date(
    //             (clientStorage.data.lastChangeDate?.[lastChangeDateProdKey] ??
    //               0) *
    //               1000 -
    //               30,
    //           ),
    //         );
    //       }
    //     },
    //   );
    // }
  })();
  const result = {
    listAllObjectsOfType(typeName: string) {
      docSignalTree[typeName].docsChanged.listen();
      const objects: string[] = [];
      for (const [docId, thisDoc] of Object.entries(
        clientStorage?.data.types?.[getCollectionName(typeName)] ?? {},
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
          clientStorage?.data.types?.[getCollectionName(typeName)]?.[docId],
        )
      );
    },
    getChildDocs(childType: string, parentId: string) {
      docSignalTree[childType].parents[parentId].listen();
      return Object.keys(
        clientStorage?.data.childLists?.[getCollectionName(childType)]?.[
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
        clientStorage?.data.types?.[getCollectionName(typeName)]?.[docId]?.[
          propName
        ];
      if (typeSchemas[typeName]?.[propName]?.format === "file") {
        if (!exists(propValue) || typeof propValue !== "string") return null;

        //  Check if a new file is being uploaded
        const fileIsUploading = changeUploader.isFileUploading({
          docId,
          propName,
          fileId: propValue,
        });
        if (fileIsUploading) return UPLOADING_FILE;

        // Read the file from storage.
        return clientStorage?.readFile(propValue) ?? null;
      } else {
        return propValue;
      }
    },
    addDoc(typeName: string, props: { [propName: string]: any }) {
      const docId = doc(
        collection(firestoreDb, getCollectionName(typeName)),
      ).path;
      changeUploader.uploadDocChange({
        shouldOverwrite: true,
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
        const newFileId = doc(collection(firestoreDb, `Mx_File`)).path;

        // Write the file
        clientStorage = await promisedClientStorage;
        await clientStorage.writeFile(newFileId, value);

        // Write to server
        const oldFileId = clientStorage?.data.types?.[
          getCollectionName(typeName)
        ]?.[docId]?.[propName] as string | undefined | null;
        changeUploader.uploadFileChange({
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
        changeUploader.uploadDocChange({
          shouldOverwrite: false,
          docId,
          data: changes,
        });

        // Write locally
        updateSessionStorage({ typeName, docId, props: changes });
      }
    },
    deleteDoc(typeName: string, docId: string) {
      changeUploader.uploadDocChange({
        shouldOverwrite: true,
        docId,
        data: {
          [DELETED_KEY]: true,
        },
      });

      // Delete any files
      for (const propName of Object.keys(typeSchemas[typeName])) {
        if (typeSchemas[typeName][propName]?.format === "file") {
          const fileId = clientStorage?.data.types?.[
            getCollectionName(typeName)
          ]?.[docId]?.[propName] as string | undefined | null;
          if (exists(fileId)) {
            changeUploader.deleteFile({ fileId });
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
  return result;
}
