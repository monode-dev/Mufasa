import { batch, createEffect, createRoot } from "solid-js";
import {
  PersistanceConfig,
  Persistance,
  PersistanceTaggedUpdateBatch,
  PrimVal,
  WritablePersistanceTaggedUpdateBatch,
  StoreBank,
} from "./DocStore";
import {
  Flagged,
  PickFlagged,
  listObjEntries,
  StripFlag,
  doNow,
  isValid,
} from "./Utils";
import { createMutable } from "solid-js/store";

let defaultPersistanceConfig: PersistanceConfig;
let _getStoreBank: () => StoreBank = (() => {}) as any;
export const getStoreBank = () => _getStoreBank();
let _trackUpload: () => void = () => {};
export const trackUpload = () => _trackUpload();
let _untrackUpload: () => void = () => {};
export const untrackUpload = () => _untrackUpload();
export type DocExports = ReturnType<typeof initializeDocClass>;
export type DocClass = ReturnType<DocExports["Doc"]>;
export type DocInst = InstanceType<DocClass>;
export function initializeDocClass(config: {
  storeBank: StoreBank;
  defaultPersistance: PersistanceConfig;
}) {
  defaultPersistanceConfig = config.defaultPersistance;
  _getStoreBank = () => config.storeBank;
  _trackUpload = config.defaultPersistance.trackUpload;
  _untrackUpload = config.defaultPersistance.untrackUpload;

  return {
    Doc(
      docType: string,
      customizations?: Omit<Parameters<typeof Doc.customize>[0], `docType`>
    ) {
      return Doc.customize({ docType, ...(customizations ?? {}) });
    },
  };
}
// TODO: This is probably why all our docs are freaking out with null stuff.
const _allDocInstances = new Map<
  string | null,
  | {
      [docId: string]: DocInst | undefined;
    }
  | undefined
>();
function _initializeInst<T extends Doc>(
  inst: T,
  overrideProps: { [jsKey: string | number]: PrimVal },
  // We should try not making docId reactive, and then decide if that was the wrong idea.
  getDocId: (initProps: PersistanceTaggedUpdateBatch[string]) => string
): T {
  // Create Instance
  const initProps: WritablePersistanceTaggedUpdateBatch[string] = {};
  const customProps: {
    [jsKey: string]: CustomProp;
  } = {};
  listObjEntries(inst).forEach(([jsKey, propConfig]) => {
    if (!isCustomProp(propConfig)) return;
    if (typeof jsKey !== `string`) return;
    customProps[jsKey] = propConfig;
    doNow(() => {
      if (typeof jsKey !== `string`) return;
      if (propConfig.isFullCustom) return;
      const initValue =
        overrideProps[jsKey] !== undefined && isValid(propConfig.toPrim)
          ? propConfig.toPrim(overrideProps[jsKey])
          : propConfig.getInitValue();
      if (initValue === undefined) return;
      const mfsKey = propConfig.overrideKey ?? jsKey;
      initProps[mfsKey] = {
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
  Object.entries(customProps).forEach(([jsKey, propConfig]) => {
    const mfsKey = propConfig.overrideKey ?? jsKey;
    if (propConfig.isFullCustom) {
      propConfig.init(inst, mfsKey);
    } else {
      Object.defineProperty(inst, jsKey, {
        get: function () {
          const storeValue: PrimVal = this._docStore.getProp(
            docId,
            mfsKey,
            propConfig.getFallbackValue()
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
                      [mfsKey]: {
                        value: asPrim,
                        maxPersistance: propConfig.persistance,
                      },
                    },
                  },
                  {
                    overwriteGlobally: false,
                  }
                );
              },
            }
          : isValid(propConfig.onSet)
          ? {
              set: function (value) {
                propConfig.onSet!(value);
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
export class Doc {
  // private constructor() {}
  static readonly RootClass = Doc;
  /** Finds all `static myComputed = formula(() => ...)` and replaces them with getters
   * based on hidden `useRoot(useFormula(() => ...))` variables. */
  static initStaticFormulas<This extends typeof Doc>(this: This) {
    let currentClass: This | Function = this;

    // Traverse up the prototype chain to initialize static formulas for all classes
    while (currentClass !== Function.prototype) {
      Object.entries(currentClass).forEach(([key, propConfig]) => {
        const isFormula =
          isCustomProp(propConfig) &&
          !propConfig.isFullCustom &&
          typeof propConfig?.getFallbackValue() === `function`;
        if (!isFormula) return;

        const { useRoot, useFormula } =
          defaultPersistanceConfig.sessionPersister;
        const underlyingFormula = useRoot(() =>
          useFormula(propConfig.getFallbackValue() as any)
        );

        Object.defineProperty(currentClass, key, {
          get: function () {
            return underlyingFormula.value;
          },
        });
      });

      // Move up the prototype chain
      currentClass = Object.getPrototypeOf(currentClass) as This;
    }
  }

  /*** NOTE: This can be overridden to manually specify a type name. */
  static get docType(): string | null {
    return this.name;
  }
  get docType() {
    return (this.constructor as typeof Doc).docType;
  }
  static getDocStoreConfig<This extends typeof Doc>(
    this: This
  ): PersistanceConfig {
    return defaultPersistanceConfig;
  }
  static ensureSyncHasStarted() {
    this._docStore;
  }
  static get _docStore() {
    return getStoreBank().getStore({
      storeType: `doc`,
      docType: this.docType,
      getStoreConfig: () => this.getDocStoreConfig(),
      /** Docs don't start syncing until they are accessed the first time. So as soon as
       * the first one is accessed we start syncing all the connected doc types too. */
      onStoreInit: () => {
        const customProps = Object.values(new this()).filter(isCustomProp);
        const otherDocsToStartSyncing = new Set(
          customProps.flatMap((prop) => prop.otherDocsToStartSyncing)
        );
        otherDocsToStartSyncing.forEach((docClass) =>
          docClass.ensureSyncHasStarted()
        );
      },
    });
  }
  get _docStore() {
    return (this.constructor as typeof Doc)._docStore;
  }
  // TODO: Rename this to "customize" or something like that so we can add more options to it like overriding docType.
  static customize<This extends typeof Doc>(
    this: This,
    customizations: {
      docType?: string | null;
      docStoreConfig?: Partial<PersistanceConfig>;
    }
  ): This {
    return class extends (this as any) {
      static get docType() {
        return customizations.docType === undefined
          ? this.name
          : customizations.docType;
      }

      static getDocStoreConfig<This extends typeof Doc>(
        this: This
      ): PersistanceConfig {
        return {
          ...defaultPersistanceConfig!,
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

  static getAllDocs<T extends typeof Doc>(this: T): InstanceType<T>[] {
    /** This is the wrong place to set up _allDocInstances. We were doing it here because I though getAllDocs()
     * would always be called before any instances where accesesed, but this is only true for top level types
     * like "Client"  other types like "Asset" might never have getAllDocs() called. Sometimes it is via
     * LimitedDoc, but not always. */
    if (!_allDocInstances.has(this.docType)) {
      _allDocInstances.set(
        this.docType,
        createRoot(() => createMutable({}))
      );
      const instances = _allDocInstances.get(this.docType)!;
      createRoot(() =>
        createEffect(() => {
          batch(() => {
            const docsToRemove = new Set(Object.keys(instances));
            this._docStore.getAllDocs().forEach((docId) => {
              docsToRemove.delete(docId);
              if (isValid(instances[docId])) return;
              instances[docId] = _initializeInst(new this(), {}, () => docId);
            });
            docsToRemove.forEach((docId) => {
              delete instances[docId];
            });
          });
        })
      );
    }
    return Object.values(
      _allDocInstances.get(this.docType)!
    ) as InstanceType<T>[];
  }
  static getHaveCompletedFirstSync<T extends typeof Doc>(this: T): boolean {
    return this._docStore.getHaveCompletedFirstSync();
  }
  static getHaveLoadedFromDisk<T extends typeof Doc>(this: T): boolean {
    return this._docStore.getHaveLoadedFromDisk();
  }

  static _fromId<T extends typeof Doc>(
    this: T,
    docId: string
  ): InstanceType<T> {
    if (this.docType === null) {
      this.getAllDocs();
    }
    return _allDocInstances.get(this.docType)?.[docId] as InstanceType<T>;
  }

  static create<T extends typeof Doc>(
    this: T,
    ...overrideProps: CreateParams<T>
  ): InstanceType<T> {
    return _initializeInst(
      new this(),
      overrideProps[0] ?? {},
      this._docStore.createDoc
    ) as any;
  }

  static async export(path: string, shouldInclude?: (path: string) => boolean) {
    return await this._docStore.export(path, shouldInclude);
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
type CreateParams<T extends typeof Doc> = CreateParamsFromInst<InstanceType<T>>;
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
type PropClass =
  | typeof Boolean
  | typeof Number
  | typeof String
  | typeof Doc
  | [typeof String];
type PropType<T extends PropClass = PropClass> = T | [T, null];
type PropInst = boolean | number | string | string[] | Doc | null;
type PropValue<T extends PropType | PropInst = PropType | PropInst> =
  T extends [any, any]
    ? PropValue<T[number]>
    : T extends [any]
    ? PropValue<T[0]>[]
    : T extends typeof Doc
    ? InstanceType<T> | null
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
    : never
>(
  firstParam: FirstParam,
  secondParam?: SecondParam,
  /* TODO: Make third param be an options obj. Both "key" and "persistance" should
   * be options. Alternately we could do prop.customize({ ...options }); */
  options: {
    persistance?: Persistance;
    key?: string;
  } = {}
): Flagged<
  PropValue<FirstParam>,
  FirstParam extends PropType
    ? undefined extends SecondParam
      ? RequiredPropFlag
      : OptionalPropFlag
    : OptionalPropFlag
> {
  function getTypeClassFromFirstParam(
    firstParam: PropType | PropValue
  ): PropClass {
    return typeof firstParam === `function`
      ? firstParam
      : Array.isArray(firstParam)
      ? // This return String instead of [String] for string lists, but that is good enough for now.
        getTypeClassFromFirstParam(firstParam[0])
      : firstParam instanceof Doc
      ? Doc
      : typeof firstParam === `boolean`
      ? Boolean
      : typeof firstParam === `number`
      ? Number
      : String;
  }
  const TypeClass: PropClass = getTypeClassFromFirstParam(firstParam);
  const initValue: PropValue | undefined = [
    `boolean`,
    `number`,
    `string`,
  ].includes(typeof firstParam)
    ? firstParam
    : (secondParam as any);
  const persistance: Persistance = options.persistance ?? Persistance.global;
  if (!Array.isArray(TypeClass) && isDocClass(TypeClass)) {
    return {
      [IsCustomProp]: true,
      isFullCustom: false,
      getInitValue: () =>
        initValue instanceof Doc ? initValue.docId : initValue,
      getFallbackValue: () => null,
      fromPrim: (prim) => {
        if (prim === null) return null;
        if (typeof prim !== `string`) {
          console.error(
            `Tried to read a doc prop of type ${TypeClass.docType} but got ${prim} instead of a docId string.`
          );
          return null;
        }
        return TypeClass._fromId(prim);
      },
      toPrim: (inst: InstanceType<typeof TypeClass> | null) =>
        inst?.docId ?? null,
      persistance,
      otherDocsToStartSyncing: [TypeClass],
      overrideKey: options.key,
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
      overrideKey: options.key,
    } satisfies CustomProp as any;
  }
}
export function formula<T>(compute: () => T, set?: (newVal: T) => void): T {
  return {
    [IsCustomProp]: true,
    isFullCustom: false,
    getInitValue: () => undefined,
    getFallbackValue: () => compute,
    fromPrim: (prim) => prim,
    onSet: set,
    persistance: Persistance.session,
    otherDocsToStartSyncing: [],
  } satisfies CustomProp as any;
}
export type IsCustomProp = typeof IsCustomProp;
export const IsCustomProp = Symbol(`IsCustomProp`);
export type CustomProp = {
  [IsCustomProp]: true;
  otherDocsToStartSyncing: (typeof Doc)[];
  overrideKey?: string;
} & (
  | ({
      isFullCustom: false;
      getInitValue: () => PrimVal | undefined;
      getFallbackValue: () => PrimVal | (() => any);
      fromPrim: (prim: PrimVal) => any;
      isNewList?: boolean;
      persistance: Persistance;
    } & (
      | {
          toPrim?: (inst: any) => PrimVal;
          onSet?: undefined;
        }
      | {
          onSet?: (newVal: any) => void;
          toPrim?: undefined;
        }
    ))
  | {
      isFullCustom: true;
      init: (inst: Doc, key: string) => void;
    }
);
function isCustomProp(arg: any): arg is CustomProp {
  return arg?.[IsCustomProp] === true;
}
function isDocClass(possibleDocClass: {
  new (...args: any[]): any;
}): possibleDocClass is typeof Doc {
  return Object.prototype.isPrototypeOf.call(
    Doc.prototype,
    possibleDocClass.prototype
  );
}
