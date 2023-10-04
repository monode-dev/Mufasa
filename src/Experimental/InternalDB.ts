import { exists } from "../utils";

type SyncPlugin = {
  /** False for Firestore and Capacitor. True for Session. */
  reEmitWriteEventBackToThisSource: boolean;
};
type IdbPrimitive = string | number | boolean | null | undefined;
type IdbPropType =
  | IdbPrimitive
  | IdbPrimitive[]
  | { [key: string]: IdbPrimitive };
export type ReactiveValue<T> = {
  readonly get: () => T;
  readonly set: (newValue: T) => void;
};

type InternalDb = {
  // registerSyncPlugin(name: string, syncPlugin: SyncPlugin): void;
  updateDoc(props: {
    collectionName: string;
    docId: string;
    updates: {
      [key: string]: IdbPropType;
    };
    source: string;
  }): void;
  deleteDoc(props: {
    collectionName: string;
    docId: string;
    source: string;
  }): void;
  getPropValue(props: {
    collectionName: string;
    docId: string;
    propName: string;
  }): ReactiveValue<IdbPropType>;
  getDocsWhere(props: {
    collectionName: string;
    where: {
      [key: string]: IdbPropType;
    };
  }): { [key: string]: ReactiveValue<IdbPropType> }[];
};


const mfsInternalDb = (() => {
  
})();
const internalDBs: {
  [dbName: string]: InternalDb;
} = {};
export function initializeInternalDb(
  dbName: string,
  options: {
    createReactiveValue: <T>(initValue: T) => ReactiveValue<T>;
    syncPlugins?: {
      [syncSource: string]: SyncPlugin;
    };
  },
): InternalDb {
  if (!exists(internalDBs[dbName])) {
    const collections: {
      [collectionName: string]: {
        [docId: string]: {
          [key: string]: ReactiveValue<IdbPropType>;
        };
      };
    } = {};
    internalDBs[dbName] = {
      updateDoc(props) {
        if (!exists(collections[props.collectionName])) {
          collections[props.collectionName] = {};
        }
        if (!exists(collections[props.collectionName][props.docId])) {
          collections[props.collectionName][props.docId] = {};
        }
        const doc = collections[props.collectionName][props.docId];
        for (const key in props.updates) {
          if (!exists(doc[key])) {
            doc[key] = options.createReactiveValue(props.updates[key]);
          } else {
            doc[key].set(props.updates[key]);
          }
        }
      },
      deleteDoc(props: { collectionName: string; docId: string }) {
        delete collections[props.collectionName][props.docId];
      },
      getPropValue(props) {
        return collections[props.collectionName][props.docId][props.propName];
      },
      getDocsWhere(props) {
        // TODO: Index by all keys
        return Object.values(collections[props.collectionName]).filter(
          (doc) => {
            for (const key in props.where) {
              if (doc[key].get() !== props.where[key]) {
                return false;
              }
            }
            return true;
          },
        );
      },
    };
  }
  return internalDBs[dbName];
}
