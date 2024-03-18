import {
  DocStoreConfig,
  DocStore,
  Persistance,
  PersistanceTaggedUpdateBatch,
  PrimVal,
  WritablePersistanceTaggedUpdateBatch,
  createDocStore,
  initDocStoreConfig,
} from "./DocStore.js";
import {
  Flagged,
  PickFlagged,
  listObjEntries,
  StripFlag,
  doNow,
  isValid,
} from "./Utils.js";

let _getWorkspaceId: () => string | null;
export const getWorkspaceId = () => _getWorkspaceId();
let _getStage: () => string | null;
export const getStage = () => _getStage();
let defaultDocStoreConfig: DocStoreConfig;
export type DocExports<T extends DocStoreConfig> = ReturnType<
  typeof initializeDocClass<T>
>;
export function initializeDocClass<T extends DocStoreConfig>(config: {
  getStage: () => string | null;
  getWorkspaceId: () => string | null;
  defaultDocStoreConfig: T;
}) {
  _getStage = config.getStage;
  _getWorkspaceId = config.getWorkspaceId;
  defaultDocStoreConfig = config.defaultDocStoreConfig;

  return {
    MfsDoc(
      docType: string,
      customizations?: Omit<Parameters<typeof MfsDoc.customize>[0], `docType`>,
    ) {
      return MfsDoc.customize({ docType, ...(customizations ?? {}) });
    },
    defaultDocStoreConfig: config.defaultDocStoreConfig,
    getWorkspaceId,
  };
}
const _allDocInstances = new Map<string, MfsDoc>();
function _initializeInst<T extends MfsDoc>(
  inst: T,
  overrideProps: { [key: string | number]: PrimVal },
  // We should try not making docId reactive, and then decide if that was the wrong idea.
  getDocId: (initProps: PersistanceTaggedUpdateBatch[string]) => string,
): T {
  // Create Instance
  const initProps: WritablePersistanceTaggedUpdateBatch[string] = {};
  const customProps: {
    [key: string]: CustomProp;
  } = {};
  listObjEntries(inst).forEach(([key, propConfig]) => {
    if (!isCustomProp(propConfig)) return;
    if (typeof key !== `string`) return;
    customProps[key] = propConfig;
    doNow(() => {
      if (typeof key !== `string`) return;
      if (propConfig.isFullCustom) return;
      const initValue =
        overrideProps[key] !== undefined && isValid(propConfig.toPrim)
          ? propConfig.toPrim(overrideProps[key])
          : propConfig.getInitValue();
      if (initValue === undefined) return;
      initProps[key] = {
        value: initValue,
        maxPersistance: propConfig.persistance,
      };
    });
  });
  const docId = getDocId(initProps);

  // Setup docId. It won't change so it doesn't need to be reactive
  Object.defineProperty(inst, "docId", {
    get: function () {
      return docId;
    },
  });

  // Setup all custom props.
  Object.entries(customProps).forEach(([key, propConfig]) => {
    if (propConfig.isFullCustom) {
      propConfig.init(inst, key);
    } else {
      Object.defineProperty(inst, key, {
        get: function () {
          const storeValue: PrimVal = this._docStore.getProp(
            docId,
            key,
            propConfig.getFallbackValue(),
          );
          return propConfig.fromPrim(storeValue);
        },
        ...(isValid(propConfig.toPrim)
          ? {
              set: function (value) {
                const asPrim = propConfig.toPrim!(value);
                // TODO: Only do update if value is different.
                this._docStore.batchUpdate(
                  {
                    [docId]: {
                      [key]: {
                        value: asPrim,
                        maxPersistance: propConfig.persistance,
                      },
                    },
                  },
                  {
                    overwriteGlobally: false,
                  },
                );
              },
            }
          : {}),
      });
    }
  });

  return inst;
}

/* TODO: Maybe Require a special, non-exported symbol as the parameter of the constructor
 * so that no one outside of this file can create a new instance. */
const docStores = new Map<string | null, Map<string, DocStore>>();
export class MfsDoc {
  // private constructor() {}

  /*** NOTE: This can be overridden to manually specify a type name. */
  static get docType() {
    return this.name;
  }
  get docType() {
    return (this.constructor as typeof MfsDoc).docType;
  }
  static getDocStoreConfig<This extends typeof MfsDoc>(
    this: This,
  ): DocStoreConfig {
    return defaultDocStoreConfig;
  }
  static get _docStore() {
    const stage = getStage();
    const workspaceId = getWorkspaceId();
    if (!docStores.has(workspaceId)) docStores.set(workspaceId, new Map());
    const workspaceStore = docStores.get(workspaceId)!;
    if (!workspaceStore.has(this.docType)) {
      workspaceStore.set(
        this.docType,
        createDocStore(
          initDocStoreConfig({
            config: this.getDocStoreConfig(),
            stage: stage,
            workspaceId: workspaceId,
            docType: this.docType,
          }),
        ),
      );
      /** Docs don't start syncing until they are accessed the first time. So as soon as
       * the first one is accessed we start syncing all the connected doc types too. */
      const uninitializedInst = new this();
      Object.values(uninitializedInst).forEach((prop) => {
        if (isCustomProp(prop)) {
          prop.otherDocsToStartSyncing.forEach(
            (docClass) => docClass._docStore,
          );
        }
      });
    }
    return workspaceStore.get(this.docType)!;
  }
  get _docStore() {
    return (this.constructor as typeof MfsDoc)._docStore;
  }
  // TODO: Rename this to "customize" or something like that so we can add more options to it like overriding docType.
  static customize<This extends typeof MfsDoc>(
    this: This,
    customizations: {
      docType?: string;
      docStoreConfig?: Partial<DocStoreConfig>;
    },
  ): This {
    return class extends (this as any) {
      static get docType() {
        return customizations.docType ?? this.name;
      }

      static getDocStoreConfig<This extends typeof MfsDoc>(
        this: This,
      ): DocStoreConfig {
        return {
          ...defaultDocStoreConfig!,
          ...customizations.docStoreConfig,
        };
      }
    } as any;
  }
  // TODO: Let this be defined as a hash of two keys for rel-tables.
  get docId() {
    return ``;
  }
  get isDeleted(): boolean {
    return this._docStore.isDocDeleted(this.docId);
  }

  static getAllDocs<T extends typeof MfsDoc>(this: T): InstanceType<T>[] {
    return this._docStore.getAllDocs().map(this._fromId.bind(this) as any);
  }

  static _fromId<T extends typeof MfsDoc>(
    this: T,
    docId: string,
  ): InstanceType<T> {
    if (!_allDocInstances.has(docId)) {
      _allDocInstances.set(
        docId,
        _initializeInst(new this(), {}, () => docId),
      );
    }
    return _allDocInstances.get(docId) as InstanceType<T>;
  }

  static create<T extends typeof MfsDoc>(
    this: T,
    ...overrideProps: CreateParams<T>
  ): InstanceType<T> {
    return _initializeInst(
      new this(),
      overrideProps[0] ?? {},
      this._docStore.createDoc,
    ) as any;
  }

  /** Override to run code just before an object is deleted. */
  onDelete() {}

  /** Permanently deletes this object. */
  readonly deleteDoc = () => {
    // NOTE: If we try to declare this using the "function" format, like deleteDoc() {}, then
    // the "this" keyword will not work correctly.
    this.onDelete();
    this._docStore.deleteDoc(this.docId);
  };
}

// TODO: Add Local and Session flags.
// TODO: Add initFrom flag to init from func.
type CreateParams<T extends typeof MfsDoc> = CreateParamsFromInst<
  InstanceType<T>
>;
type OptionalParameter<T, IsOptional extends boolean> = Parameters<
  IsOptional extends true ? (prop?: T) => void : (prop: T) => void
>;
type CreateParamsFromInst<T> = OptionalParameter<
  {
    [K in PickFlagged<T, RequiredPropFlag>]: StripFlag<T[K], RequiredPropFlag>;
  } & Partial<{
    [K in PickFlagged<T, OptionalPropFlag>]: StripFlag<T[K], OptionalPropFlag>;
  }>,
  PickFlagged<T, RequiredPropFlag> extends never ? true : false
>;
export type RequiredPropFlag = typeof RequiredPropFlag;
export const RequiredPropFlag = Symbol(`RequiredPropFlag`);
export type OptionalPropFlag = typeof OptionalPropFlag;
export const OptionalPropFlag = Symbol(`OptionalPropFlag`);
// TODO: Delete docs that depend on non-nullable docs.
type PropClass = typeof Boolean | typeof Number | typeof String | typeof MfsDoc;
type PropType<T extends PropClass = PropClass> = T | [T, null];
type PropInst = boolean | number | string | MfsDoc | null;
type PropValue<T extends PropType | PropInst = PropType | PropInst> =
  T extends any[]
    ? PropValue<T[number]>
    : T extends typeof MfsDoc
    ? InstanceType<T>
    : T extends typeof Boolean
    ? boolean
    : T extends typeof Number
    ? number
    : T extends typeof String
    ? string
    : T extends boolean
    ? boolean
    : T extends number
    ? number
    : T extends string
    ? string
    : null;
export function prop<
  FirstParam extends PropType | PropValue,
  SecondParam extends FirstParam extends PropType
    ? PropValue<FirstParam> | undefined
    : never,
>(
  firstParam: FirstParam,
  secondParam?: SecondParam,
  /* TODO: Make third param be an options obj. Both "key" and "persistance" should
   * be options. Alternately we could do prop.customize({ ...options }); */
  persistance: Persistance = Persistance.global,
): Flagged<
  PropValue<FirstParam>,
  FirstParam extends PropType
    ? undefined extends SecondParam
      ? RequiredPropFlag
      : OptionalPropFlag
    : OptionalPropFlag
> {
  const TypeClass: PropClass =
    typeof firstParam === `function`
      ? firstParam
      : Array.isArray(firstParam)
      ? firstParam[0]
      : firstParam instanceof MfsDoc
      ? MfsDoc
      : typeof firstParam === `boolean`
      ? Boolean
      : typeof firstParam === `number`
      ? Number
      : String;
  const initValue: PropValue | undefined = [
    `boolean`,
    `number`,
    `string`,
  ].includes(typeof firstParam)
    ? firstParam
    : (secondParam as any);
  if (isDocClass(TypeClass)) {
    return {
      [IsCustomProp]: true,
      isFullCustom: false,
      getInitValue: () =>
        initValue instanceof MfsDoc ? initValue.docId : initValue,
      getFallbackValue: () => null,
      fromPrim: (prim) => {
        if (prim === null) return null;
        if (typeof prim !== `string`) {
          console.error(
            `Tried to read a doc prop of type ${TypeClass.docType} but got ${prim} instead of a docId string.`,
          );
          return null;
        }
        return TypeClass._fromId(prim);
      },
      toPrim: (inst: InstanceType<typeof TypeClass> | null) =>
        inst?.docId ?? null,
      persistance,
      otherDocsToStartSyncing: [TypeClass],
    } satisfies CustomProp as any;
  } else {
    return {
      [IsCustomProp]: true,
      isFullCustom: false,
      getInitValue: () => initValue as any,
      getFallbackValue: () => initValue as PrimVal,
      fromPrim: (prim: PrimVal) => prim,
      toPrim: (inst) => inst,
      persistance,
      otherDocsToStartSyncing: [],
    } satisfies CustomProp as any;
  }
}
export function formula<T>(compute: () => T): T {
  return {
    [IsCustomProp]: true,
    isFullCustom: false,
    getInitValue: () => undefined,
    getFallbackValue: () => compute,
    fromPrim: (prim) => prim,
    persistance: Persistance.session,
    otherDocsToStartSyncing: [],
  } satisfies CustomProp as any;
}
export type IsCustomProp = typeof IsCustomProp;
export const IsCustomProp = Symbol(`IsCustomProp`);
export type CustomProp = {
  [IsCustomProp]: true;
  otherDocsToStartSyncing: (typeof MfsDoc)[];
} & (
  | {
      isFullCustom: false;
      getInitValue: () => PrimVal | undefined;
      getFallbackValue: () => PrimVal | (() => any);
      fromPrim: (prim: PrimVal) => any;
      toPrim?: (inst: any) => PrimVal;
      isNewList?: boolean;
      persistance: Persistance;
    }
  | {
      isFullCustom: true;
      init: (inst: MfsDoc, key: string) => void;
    }
);
function isCustomProp(arg: any): arg is CustomProp {
  return arg?.[IsCustomProp] === true;
}
function isDocClass(possibleDocClass: {
  new (...args: any[]): any;
}): possibleDocClass is typeof MfsDoc {
  return Object.prototype.isPrototypeOf.call(
    MfsDoc.prototype,
    possibleDocClass.prototype,
  );
}
