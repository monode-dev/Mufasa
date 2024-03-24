import { PersistanceConfig, Persistance, PrimVal } from "./DocStore.js";
import { Flagged, PickFlagged, StripFlag } from "./Utils.js";
export declare const getStage: () => string;
export declare const getWorkspaceId: () => string | null;
export declare const trackUpload: () => void;
export declare const untrackUpload: () => void;
export type DocExports = ReturnType<typeof initializeDocClass>;
export declare function initializeDocClass(config: {
    stage: string;
    getWorkspaceId: () => string | null;
    defaultPersistanceConfig: PersistanceConfig;
}): {
    Doc(docType: string, customizations?: Omit<Parameters<typeof Doc.customize>[0], `docType`>): typeof Doc;
    defaultPersistanceConfig: PersistanceConfig;
};
export declare class Doc {
    /*** NOTE: This can be overridden to manually specify a type name. */
    static get docType(): string;
    get docType(): string;
    static getDocStoreConfig<This extends typeof Doc>(this: This): PersistanceConfig;
    static ensureSyncHasStarted(): void;
    static get _docStore(): {
        readonly loadedFromLocalStorage: Promise<void>;
        readonly batchUpdate: (updates: {
            readonly [x: string]: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            };
        }, options: {
            overwriteGlobally: boolean;
        }) => void;
        readonly createDoc: (props: {
            readonly [x: string]: {
                readonly value: PrimVal;
                readonly maxPersistance: Persistance;
            };
        }, manualDocId?: string | undefined) => string;
        readonly deleteDoc: (docId: string) => void;
        readonly isDocDeleted: (docId: string) => boolean;
        readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
        readonly getAllDocs: () => string[];
    };
    get _docStore(): {
        readonly loadedFromLocalStorage: Promise<void>;
        readonly batchUpdate: (updates: {
            readonly [x: string]: {
                readonly [x: string]: {
                    readonly value: PrimVal;
                    readonly maxPersistance: Persistance;
                };
            };
        }, options: {
            overwriteGlobally: boolean;
        }) => void;
        readonly createDoc: (props: {
            readonly [x: string]: {
                readonly value: PrimVal;
                readonly maxPersistance: Persistance;
            };
        }, manualDocId?: string | undefined) => string;
        readonly deleteDoc: (docId: string) => void;
        readonly isDocDeleted: (docId: string) => boolean;
        readonly getProp: (id: string, key: string, initValue: PrimVal | (() => PrimVal)) => PrimVal;
        readonly getAllDocs: () => string[];
    };
    static customize<This extends typeof Doc>(this: This, customizations: {
        docType?: string;
        docStoreConfig?: Partial<PersistanceConfig>;
    }): This;
    get docId(): string;
    get isDeleted(): boolean;
    static getAllDocs<T extends typeof Doc>(this: T): InstanceType<T>[];
    static _fromId<T extends typeof Doc>(this: T, docId: string): InstanceType<T>;
    static create<T extends typeof Doc>(this: T, ...overrideProps: CreateParams<T>): InstanceType<T>;
    /** Override to run code just before an object is deleted. */
    onDelete(): void;
    /** Permanently deletes this object. */
    readonly deleteDoc: () => void;
}
type CreateParams<T extends typeof Doc> = CreateParamsFromInst<InstanceType<T>>;
type OptionalParameter<T, IsOptional extends boolean> = Parameters<IsOptional extends true ? (prop?: T) => void : (prop: T) => void>;
type CreateParamsFromInst<T> = OptionalParameter<{
    [K in PickFlagged<T, RequiredPropFlag>]: StripFlag<T[K], RequiredPropFlag>;
} & Partial<{
    [K in PickFlagged<T, OptionalPropFlag>]: StripFlag<T[K], OptionalPropFlag>;
}>, PickFlagged<T, RequiredPropFlag> extends never ? true : false>;
export type RequiredPropFlag = typeof RequiredPropFlag;
export declare const RequiredPropFlag: unique symbol;
export type OptionalPropFlag = typeof OptionalPropFlag;
export declare const OptionalPropFlag: unique symbol;
type PropClass = typeof Boolean | typeof Number | typeof String | typeof Doc;
type PropType<T extends PropClass = PropClass> = T | [T, null];
type PropInst = boolean | number | string | Doc | null;
type PropValue<T extends PropType | PropInst = PropType | PropInst> = T extends any[] ? PropValue<T[number]> : T extends typeof Doc ? InstanceType<T> : T extends typeof Boolean ? boolean : T extends typeof Number ? number : T extends typeof String ? string : T extends boolean ? boolean : T extends number ? number : T extends string ? string : null;
export declare function prop<FirstParam extends PropType | PropValue, SecondParam extends FirstParam extends PropType ? PropValue<FirstParam> | undefined : never>(firstParam: FirstParam, secondParam?: SecondParam, persistance?: Persistance): Flagged<PropValue<FirstParam>, FirstParam extends PropType ? undefined extends SecondParam ? RequiredPropFlag : OptionalPropFlag : OptionalPropFlag>;
export declare function formula<T>(compute: () => T): T;
export type IsCustomProp = typeof IsCustomProp;
export declare const IsCustomProp: unique symbol;
export type CustomProp = {
    [IsCustomProp]: true;
    otherDocsToStartSyncing: (typeof Doc)[];
} & ({
    isFullCustom: false;
    getInitValue: () => PrimVal | undefined;
    getFallbackValue: () => PrimVal | (() => any);
    fromPrim: (prim: PrimVal) => any;
    toPrim?: (inst: any) => PrimVal;
    isNewList?: boolean;
    persistance: Persistance;
} | {
    isFullCustom: true;
    init: (inst: Doc, key: string) => void;
});
export {};