import {
  Firestore,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  deleteObject,
  FirebaseStorage,
} from "firebase/storage";
import {
  ClientStorage,
  GetClientStorage,
} from "../ClientStorage/ClientStorage";
import { CHANGE_DATE_KEY, DocData } from "../LocalCache";
import { DeepReadonly, exists } from "../utils";
import { FirebaseApp } from "firebase/app";

export function loadChangeUploader(
  firestoreDb: Firestore | null,
  // firebaseApp: FirebaseApp,
  getClientStorage: GetClientStorage,
  serverFileStorage: FirebaseStorage | null,
  newDocPath: (collectionName: string) => string,
  updateSessionStorage: (params: {
    typeName: string;
    docId: string;
    props: {
      [propName: string]: number | string | boolean | null | undefined;
    };
  }) => Promise<void>,
) {
  // Types
  type DocChange = {
    shouldOverwrite: boolean;
    docId: string;
    data: DocData;
  };
  type FileChange = {
    newFileId: string;
    haveUploadedFile: boolean;
    propPath?: {
      typeName: string;
      docId: string;
      propName: string;
    };
    oldFileId?: string;
  };
  type FileDelete = {
    idOfFileToDelete: string;
  };
  function isFileChange(change: any): change is DeepReadonly<FileChange> {
    return exists(change?.newFileId);
  }
  function isFileDelete(change: any): change is DeepReadonly<FileDelete> {
    return exists(change?.idOfFileToDelete);
  }

  // Init
  const cloudEnabled = exists(firestoreDb);
  const storageEnabled = exists(serverFileStorage) && cloudEnabled;
  type ChangeStorage = {
    [changeId: string]: DocChange | FileChange | FileDelete;
  };
  const promisedClientStorage = getClientStorage<ChangeStorage>(
    `mx_unPushedChanges`,
    {},
  );
  let unpromisedClientStorage: ClientStorage<ChangeStorage> | undefined =
    undefined;
  (async () => {
    const clientStorage = await promisedClientStorage;
    unpromisedClientStorage = clientStorage;
    for (const changeId of Object.keys(clientStorage.data)) {
      uploadStashedChange(changeId);
    }
  })();

  // Upload a change to the server
  async function uploadStashedChange(changeId: string) {
    const clientStorage = await promisedClientStorage;
    const change = clientStorage.data[changeId];
    if (!exists(change)) return;

    // Apply to server
    if (isFileChange(change)) {
      // Apply doc change
      if (exists(change.propPath)) {
        updateSessionStorage({
          typeName: change.propPath.typeName,
          docId: change.propPath.docId,
          props: {
            [change.propPath.propName]: change.newFileId,
          },
        });
        if (!cloudEnabled) return;
        await applyDocChange(
          {
            shouldOverwrite: false,
            docId: change.propPath.docId,
            data: {
              [change.propPath.propName]: change.newFileId,
            },
          },
          firestoreDb,
        );
        // TODO: Figure out why typing isn't working and we have to do `as any`.
        clientStorage.updateData({
          [changeId]: {
            propPath: undefined,
          } as any,
        });
      }

      if (!storageEnabled) return;
      // Upload file
      if (!change.haveUploadedFile) {
        const data = await clientStorage.readFile(change.newFileId);
        if (!exists(data)) {
          clientStorage.updateData({
            [changeId]: undefined,
          });
          return;
        }
        const fileRef = storageRef(serverFileStorage, change.newFileId);
        await uploadString(fileRef, data);
        // TODO: Figure out why typing isn't working and we have to do `as any`.
        clientStorage.updateData({
          [changeId]: {
            haveUploadedFile: true,
          } as any,
        });
      }

      // Delete old file
      if (exists(change.oldFileId)) {
        // console.log(
        //   `change.oldFileId: ${JSON.stringify(change.oldFileId, null, 2)}`,
        // );
        if (!storageEnabled) return;
        const oldFileRef = storageRef(serverFileStorage, change.oldFileId);
        // NOTE: I don't think we have to wait for these.
        clientStorage.deleteFile(change.oldFileId);
        try {
          deleteObject(oldFileRef);
        } catch (e) {
          console.error(e);
        }
      }
    } else if (isFileDelete(change)) {
      try {
        if (!storageEnabled) return;
        await deleteObject(
          storageRef(serverFileStorage, change.idOfFileToDelete),
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      // Doc Change
      if (!cloudEnabled) return;
      await applyDocChange(change, firestoreDb);
    }

    // Mark complete
    clientStorage.updateData({
      [changeId]: undefined,
    });

    // Both file changes and doc changes require a doc change
    async function applyDocChange(change: DocChange, firestoreDb: Firestore) {
      const docRef = doc(firestoreDb, change.docId);
      const props = {
        ...change.data,
        [CHANGE_DATE_KEY]: serverTimestamp(),
      };
      if (change.shouldOverwrite) {
        await setDoc(docRef, props);
      } else {
        await updateDoc(docRef, props);
      }
    }
  }

  return {
    async uploadDocChange(change: DocChange) {
      // Save in case app is closed
      const clientStorage = await promisedClientStorage;
      const changeId = newDocPath(`Mx_Change`);
      clientStorage.updateData({
        [changeId]: change,
      });

      // Apply to server
      await uploadStashedChange(changeId);
    },

    async uploadFileChange(params: {
      typeName: string;
      docId: string;
      propName: string;
      newFileId: string;
      oldFileId?: string;
      notifyUploadStarted: () => void;
    }) {
      const clientStorage = await promisedClientStorage;

      // Save in case app is closed
      const changeId = newDocPath(`Mx_Change`);
      clientStorage.updateData({
        [changeId]: {
          newFileId: params.newFileId,
          haveUploadedFile: false,
          propPath: {
            typeName: params.typeName,
            docId: params.docId,
            propName: params.propName,
          },
          oldFileId: params.oldFileId,
        },
      });

      // Notify listeners so that they can show a loading indicator
      params.notifyUploadStarted();

      // Apply to server
      await uploadStashedChange(changeId);
    },

    async deleteFile(params: { fileId: string }) {
      if (!exists(firestoreDb)) return;
      const clientStorage = await promisedClientStorage;
      // Save in case app is closed
      const changeId = doc(collection(firestoreDb, `Mx_Change`)).path;
      clientStorage.updateData({
        [changeId]: {
          idOfFileToDelete: params.fileId,
        },
      });

      // Apply to server
      await uploadStashedChange(changeId);
    },

    isFileUploading(params: {
      docId: string;
      propName: string;
      fileId: string;
    }): boolean {
      if (!storageEnabled) return false;
      if (!exists(unpromisedClientStorage)) return false;
      for (const change of Object.values(unpromisedClientStorage.data)) {
        if (!isFileChange(change)) continue;
        const propPath = change.propPath;
        if (!exists(propPath)) continue;
        if (propPath.docId !== params.docId) continue;
        if (propPath.propName !== params.propName) continue;
        // If the prop has the new file id, then the upload has finished, we're just deleting the old file.
        return params.fileId !== change.newFileId;
      }
      return false;
    },
  };
}
