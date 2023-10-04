import {
  Firestore,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  deleteObject,
  getBytes,
} from "firebase/storage";
import { Json, JsonObject, exists, sleep } from "./utils";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  PersistedFunctionManager,
  QUIT_PERSISTED_FUNCTION,
} from "./PersistedFunctionManager";
import { MfsFileSystem } from "./Implement";

export const CHANGE_DATE_KEY = `mfs_changeDate`;

export function initializeFirestoreSync(
  firebaseOptions: FirebaseOptions,
  isProduction: boolean,
  persistedFunctionManager: PersistedFunctionManager,
  fileSystem: MfsFileSystem,
) {
  const firebaseApp = initializeApp(firebaseOptions);
  const firestore = getFirestore(firebaseApp);
  const firebaseStorage = getStorage(firebaseApp);

  const savedDataFileName = `mfs_firestoreSavedData`;
  const _savedData = fileSystem
    .readFile(savedDataFileName)
    .then((saveFileString) => {
      return exists(saveFileString)
        ? (JSON.parse(saveFileString) as {
            [collectionName: string]: number;
          })
        : {};
    });
  async function updateSavedData(
    collectionName: string,
    mostRecentChangeDate: number,
  ) {
    const savedData = await _savedData;
    savedData[collectionName] = mostRecentChangeDate;
    requestSave();
  }
  // Start save Loop
  let saveIndex = 0;
  let lastSaveIndex = saveIndex;
  function requestSave() {
    saveIndex += 1;
  }
  _savedData.then(async (savedData) => {
    while (true) {
      if (lastSaveIndex !== saveIndex) {
        await fileSystem.writeFile(
          savedDataFileName,
          JSON.stringify(savedData),
        );
        lastSaveIndex = saveIndex;
      }
      await sleep(250);
    }
  });

  // Both file changes and doc changes require a doc change
  async function applyDocChange(change: {
    shouldOverwrite: boolean;
    docId: string;
    data: {
      [key: string]: Json;
    };
  }) {
    const docRef = doc(firestore, change.docId);
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

  const uploadFileChangeTypeName = `uploadFileChangeToGoogleStorage`;
  const uploadFileChange = persistedFunctionManager
    // Upload the new file
    .createPersistedFunction(
      uploadFileChangeTypeName,
      async (props: {
        docId: string;
        propName: string;
        newFileId: string;
        oldFileId?: string;
      }) => {
        const data = await fileSystem.readFile(props.newFileId);
        if (!exists(data)) return QUIT_PERSISTED_FUNCTION;
        const fileRef = storageRef(firebaseStorage, props.newFileId);
        await uploadString(fileRef, data);
        return props;
      },
    )
    // Update the doc
    .addStage(async (props) => {
      await applyDocChange({
        shouldOverwrite: false,
        docId: props.docId,
        data: {
          [props.propName]: props.newFileId,
        },
      });
      return props;
    })
    // Delete the old file
    .addStage(async (props) => {
      if (exists(props.oldFileId)) {
        const oldFileRef = storageRef(firebaseStorage, props.oldFileId);
        // NOTE: I don't think we have to wait for these.
        fileSystem.deleteFile(props.oldFileId);
        try {
          deleteObject(oldFileRef);
        } catch (e) {
          console.error(e);
        }
      }
    });
  const changeUploaders = {
    uploadDocChange: persistedFunctionManager.createPersistedFunction(
      `uploadDocChangeToFirestore`,
      applyDocChange,
    ),

    uploadFileChange(props: {
      docId: string;
      propName: string;
      newFileId: string;
      oldFileId?: string;
      notifyUploadStarted: () => void;
    }) {
      uploadFileChange({
        docId: props.docId,
        propName: props.propName,
        newFileId: props.newFileId,
        oldFileId: props.oldFileId,
      });
      // Notify listeners so that they can show a loading indicator
      props.notifyUploadStarted();
    },

    deleteFile: persistedFunctionManager.createPersistedFunction(
      `deleteFileFromFirestore`,
      async (props: { fileId: string }) => {
        try {
          await deleteObject(storageRef(firebaseStorage, props.fileId));
        } catch (e) {
          console.error(e);
        }
      },
    ),

    isFileUploading(props: {
      docId: string;
      propName: string;
      fileId: string;
    }): boolean {
      const state = persistedFunctionManager.findFunctionData(
        (functionData) => {
          return (
            functionData.functionTypeName === uploadFileChangeTypeName &&
            functionData.stageIndex < 2 &&
            functionData.props.docId === props.docId &&
            functionData.props.propName === props.propName
          );
        },
      );
      return exists(state) && props.fileId === state.props.newFileId;
    },

    async downloadFile(fileId: string): Promise<void> {
      const bytes = await getBytes(storageRef(firebaseStorage, fileId));
      const asString = new TextDecoder("utf-8").decode(bytes);
      await fileSystem.writeFile(fileId, asString);
    },

    async watchCollection(
      collectionName: string,
      handleUpdate: (id: string, data: JsonObject) => void,
    ) {
      const savedData = await _savedData;
      const mostRecentChangeDateOnStartup = savedData[collectionName] ?? 0;
      onSnapshot(
        query(
          collection(
            firestore,
            `${isProduction ? `Prod` : `Dev`}_${collectionName}`,
          ),
          where(
            CHANGE_DATE_KEY,
            ">",
            new Date(mostRecentChangeDateOnStartup * 1000 - 30),
          ),
        ),
        (snapshot) => {
          let mostRecentChangeDate = savedData[collectionName] ?? 0;
          snapshot.docChanges().forEach((change) => {
            if (change.type !== "removed") {
              const docData = change.doc.data();
              mostRecentChangeDate = Math.max(
                mostRecentChangeDate,
                docData[CHANGE_DATE_KEY].seconds,
              );
              handleUpdate(change.doc.ref.id, docData);
            }
          });
          if (mostRecentChangeDate > savedData[collectionName] ?? 0) {
            updateSavedData(collectionName, mostRecentChangeDate);
          }
        },
      );
    },
  };

  return changeUploaders;
}
