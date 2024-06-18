import { v4 as uuidv4 } from "uuid";
import type { MosaApi } from "mosa-js";
import {
  Device,
  Cloud,
  Persistance,
  PersistanceTaggedUpdateBatch,
  WritableUpdateBatch,
  DELETED_KEY,
} from "./DocStore.js";
import { createPersistedFunction } from "./PersistedFunction.js";
import { doNow, isValid } from "./Utils.js";

type DELETED = { [DELETED_KEY]: true };
const docIsDeleted = <T extends DocJson>(doc: T | DELETED): doc is DELETED => {
  return doc[DELETED_KEY] === true;
};
const newDeletedDoc = (): DELETED => ({ [DELETED_KEY]: true });

type DeviceDirectoryPersister = {
  directory: (directoryName: string) => DeviceDirectoryPersister;
  file: (fileName: string) => DeviceFilePersister;
  stop(): Promise<void>;
  export(
    path: string,
    shouldInclude?: (filePath: string) => boolean,
  ): Promise<void>;
};
type DeviceFilePersister = {
  readFile(): Promise<string | undefined>;
  writeFile(contents: string): Promise<void>;
  stop(): Promise<void>;
  export(
    path: string,
    shouldInclude?: (filePath: string) => boolean,
  ): Promise<void>;
};
type DocJson = {
  [key: string]: PrimVal;
};
type PrimVal = boolean | number | string | null | undefined;

export function createDocStore(config: {
  sessionPersister: MosaApi & {
    useStore<T extends {}>(initStore: T): T;
    batch(func: () => void): void;
  };
  directoryPersister: DeviceDirectoryPersister;
  cloudWorkspacePersister: Cloud.WorkspacePersister;
  trackUpload: () => void;
  untrackUpload: () => void;
  trackDownload: () => void;
  untrackDownload: () => void;
  onIncomingCreate: (docId: string) => void;
  onIncomingDelete: (docId: string) => void;
}) {
  // Watch Device
  const docsFile = config.directoryPersister.file(`localDocs`);

  // Watch Session
  return docsFile.readFile().then((initDocs) => {
    const sessionDocs = config.sessionPersister.useStore<{
      [docId: string]: DocJson | DELETED | undefined;
    }>(initDocs !== undefined ? JSON.parse(initDocs) : {});
    const requestSave = config.sessionPersister.doNow(() => {
      let haveRequestedSave = false;
      return () => {
        if (haveRequestedSave) return;
        haveRequestedSave = true;
        // This will run sometime later.
        Promise.resolve().then(async () => {
          haveRequestedSave = false;
          // TODO: Skip session only props.
          await docsFile.writeFile(JSON.stringify(sessionDocs));
        });
      };
    });

    // Watch cloud.
    // const haveCompletedFirstSync = ;
    const cloudWatcher = config.cloudWorkspacePersister.setupWatcher(
      (updates) => {
        config.trackDownload();
        config.sessionPersister.batch(() => {
          Object.entries(updates).forEach(([docId, props]) => {
            const currentDoc = sessionDocs[docId];
            if (currentDoc === undefined) {
              config.onIncomingCreate(docId);
              sessionDocs[docId] = props;
            } else if (docIsDeleted(currentDoc)) {
              console.warn(
                `Attempted to update deleted docId: ${docId}, doc: ${currentDoc}, props: ${props}`,
              );
            } else if (props[DELETED_KEY] === true) {
              config.onIncomingDelete(docId);
              sessionDocs[docId] = newDeletedDoc();
            } else {
              Object.entries(props).forEach(([key, value]) => {
                currentDoc[key] = value;
              });
            }
          });
        });
        requestSave();
        // haveCompletedFirstSync.value = true;
        config.untrackDownload();
      },
      config.directoryPersister.file(`globalPersisterMetaData`) as any,
    );
    cloudWatcher.start();
    const pushGlobalChange = createPersistedFunction(
      config.directoryPersister.file(`pushGlobalChange`) as any,
      async (docChange: Cloud.DocChange) => {
        config.trackUpload();
        await config.cloudWorkspacePersister.updateDoc(docChange);
        config.untrackUpload();
      },
    );

    // This Interface should be all the Class API needs to interface with the store.
    return {
      // getHaveCompletedFirstSync() {
      //   return haveCompletedFirstSync.value;
      // },

      createDoc(
        props: PersistanceTaggedUpdateBatch[string],
        manualDocId?: string,
      ) {
        const docId = manualDocId ?? uuidv4();
        batchUpdate({
          sourceStoreType: Persistance.session,
          newDocsAreOnlyVirtual: false,
          updates: {
            [docId]: props,
          },
          overwriteGlobally: true,
        });
        return docId;
      },

      getProp(docId: string, key: string): PrimVal {
        const doc = sessionDocs[docId];
        if (doc === undefined || docIsDeleted(doc)) {
          console.warn(
            `Attempted to get prop on non-existent docId: ${docId}, doc: ${doc}, key: ${key}`,
          );
          return undefined;
        }
        return doc[key];
      },

      getAllDocs: () => Object.keys(sessionDocs),

      setProp(
        docId: string,
        key: string,
        value: PrimVal,
        persistance: Persistance,
      ) {
        const doc = sessionDocs[docId];
        if (doc === undefined || docIsDeleted(doc)) {
          console.warn(
            `Attempted to set prop on non-existent docId: ${docId}, doc: ${doc}, key: ${key}, value: ${value}`,
          );
          return;
        }
        doc[key] = value;
        if (persistance >= Persistance.local) requestSave();
        if (persistance >= Persistance.global) {
          // TODO: Push to cloud.
        }
      },

      deleteDoc(docId: string) {
        sessionDocs[docId] = newDeletedDoc();
        // TODO: Push to cloud.
        requestSave();
      },

      isDocDeleted(docId: string): boolean {
        const doc = sessionDocs[docId];
        if (doc === undefined) {
          console.warn(
            `Attempted to check if doc is deleted on non-existent docId: ${docId}, doc: ${doc}`,
          );
          return false;
        }
        return docIsDeleted(doc);
      },

      docExists(docId: string) {
        const doc = sessionDocs[docId];
        return doc !== undefined && !docIsDeleted(doc);
      },

      async export(
        path: string,
        shouldInclude?: (filePath: string) => boolean,
      ) {
        await config.directoryPersister.export(
          path,
          shouldInclude ?? (() => true),
        );
      },

      async stop() {
        await pushGlobalChange.pauseAll();
        await cloudWatcher.stop();
        await config.directoryPersister.stop();
      },
    } as const;
  });
}
