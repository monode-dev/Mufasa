type SyncPlugin = {
    /** False for Firestore and Capacitor. True for Session. */
    reEmitWriteEventBackToThisSource: boolean;
};
type IdbPrimitive = string | number | boolean | null | undefined;
type IdbPropType = IdbPrimitive | IdbPrimitive[] | {
    [key: string]: IdbPrimitive;
};
export type ReactiveValue<T> = {
    readonly get: () => T;
    readonly set: (newValue: T) => void;
};
type InternalDb = {
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
    }): {
        [key: string]: ReactiveValue<IdbPropType>;
    }[];
};
export declare function initializeInternalDb(dbName: string, options: {
    createReactiveValue: <T>(initValue: T) => ReactiveValue<T>;
    syncPlugins?: {
        [syncSource: string]: SyncPlugin;
    };
}): InternalDb;
export {};
