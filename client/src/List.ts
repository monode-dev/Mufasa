import { CustomProp, Doc, IsCustomProp, prop } from "./Doc.js";
import { PersistanceConfig } from "./DocStore.js";
import { isValid } from "./Utils.js";

const relTables = new Map<typeof Doc, Map<string, typeof Doc>>();

type GetListFromTableConfig<
  OtherInst extends Doc,
  TableConfig,
> = undefined extends TableConfig
  ? List<OtherInst>
  : TableConfig extends PersistanceConfig
  ? List<OtherInst>
  : TableConfig extends keyof OtherInst
  ? OtherInst[TableConfig] extends Doc
    ? ReadonlyList<OtherInst>
    : List<OtherInst>
  : List<OtherInst>;
export function list<
  OtherClass extends typeof Doc,
  TableConfig extends
    | undefined
    | PersistanceConfig
    | (keyof InstanceType<OtherClass> & string),
>(
  OtherClass: OtherClass,
  tableConfig?: TableConfig,
): GetListFromTableConfig<InstanceType<OtherClass>, TableConfig> {
  if (typeof tableConfig === `string`) {
    const otherProp: keyof InstanceType<OtherClass> & string =
      tableConfig as any;
    const emptyOtherInst = new OtherClass();
    const otherPropIsNewList: boolean =
      (emptyOtherInst as any)[otherProp].isNewList ?? false;
    const docStoreConfig = (emptyOtherInst as any)[otherProp].docStoreConfig;
    if (otherPropIsNewList) {
      return listProp({
        getPrimaryClass: () => OtherClass,
        getSecondaryClass: (inst) => inst.constructor as any,
        gePrimaryProp: () => otherProp,
        docStoreConfig: docStoreConfig,
        otherDocsToStartSyncing: [OtherClass],
      }) as any;
    } else {
      return {
        [IsCustomProp]: true,
        isFullCustom: true,
        init: (inst, key) => {
          const listInst = new List(
            () =>
              OtherClass.getAllDocs().filter(
                (other) => (other[otherProp] as Doc)?.docId === inst.docId,
              ),
            () => {},
            () => {},
          );
          Object.defineProperty(inst, key, {
            get: () => listInst,
          });
        },
        otherDocsToStartSyncing: [OtherClass],
      } satisfies CustomProp as any;
    }
  } else {
    return {
      isNewList: true,
      docStoreConfig: tableConfig ?? null,
      ...listProp({
        getPrimaryClass: (inst) => inst.constructor as any,
        getSecondaryClass: () => OtherClass,
        gePrimaryProp: (thisProp) => thisProp,
        docStoreConfig: tableConfig ?? null,
        otherDocsToStartSyncing: [OtherClass],
      }),
    } as any;
  }
}
function listProp(config: {
  getPrimaryClass: (inst: Doc) => typeof Doc;
  getSecondaryClass: (inst: Doc) => typeof Doc;
  gePrimaryProp: (thisProp: string) => string;
  docStoreConfig: PersistanceConfig | null;
  otherDocsToStartSyncing: (typeof Doc)[];
}) {
  return {
    [IsCustomProp]: true,
    isFullCustom: true,
    init: (inst, key) => {
      const PrimaryClass = config.getPrimaryClass(inst);
      const SecondaryClass = config.getSecondaryClass(inst);
      if (!relTables.has(PrimaryClass)) relTables.set(PrimaryClass, new Map());
      const relTablesForThisType = relTables.get(PrimaryClass)!;
      if (!relTablesForThisType.has(key)) {
        relTablesForThisType.set(
          key,
          class extends Doc.customize({
            docType: `${PrimaryClass.docType}_${key}`,
            docStoreConfig: config.docStoreConfig ?? undefined,
          }) {
            primary = prop(PrimaryClass);
            secondary = prop(SecondaryClass);
          },
        );
      }
      const RelTable = relTablesForThisType.get(key)!;
      const listInst = new List(
        () =>
          RelTable.getAllDocs().filter(
            (rel) => (rel as any).primary.docId === inst.docId,
          ),
        (value) => {
          RelTable.create({
            primary: inst,
            secondary: value,
          });
        },
        (value) => {
          RelTable.getAllDocs()
            .filter(
              (rel) =>
                (rel as any).primary.docId === inst.docId &&
                (rel as any).secondary.docId === value.docId,
            )
            .forEach((rel) => rel.deleteDoc());
        },
      );
      Object.defineProperty(inst, key, {
        get: () => listInst,
      });
    },
    otherDocsToStartSyncing: config.otherDocsToStartSyncing,
  } satisfies CustomProp;
}
export class List<T extends Doc> {
  [Symbol.iterator](): IterableIterator<T> {
    return this.getArray()[Symbol.iterator]();
  }
  forEach(callbackfn: (value: T) => void) {
    this.getArray().forEach(callbackfn);
  }
  map<U>(callbackfn: (value: T) => U): U[] {
    return this.getArray().map(callbackfn);
  }
  has(toFind: T) {
    return this.getArray().some((item) => item.docId === toFind.docId);
  }
  get count(): number {
    return this.getArray().length;
  }
  constructor(
    private readonly getArray: () => T[],
    public readonly add: (value: T) => void,
    public readonly remove: (value: T) => void,
  ) {}
}
export type ReadonlyList<T extends Doc> = Omit<List<T>, `add` | `remove`>;