import {
  createEffect,
  createMemo,
  createRoot,
  getOwner,
  mapArray,
  runWithOwner,
  untrack,
} from "solid-js";
import { CustomProp, DocClass, DocInst, IsCustomProp, prop } from "./Doc";
import { PersistanceConfig } from "./DocStore";
import { createMutable } from "solid-js/store";
import { onDispose, exists } from "@/miwi/src/miwi";

const relTables = new Map<DocClass, Map<string, DocClass>>();
const docIndex = new Map<
  string | null /** DocType */,
  Map<
    string /** propName */,
    /** This should be a mutable store */
    {
      [parentId: string /** parentId /> prop value */]: string[];
    } /** docIds in this list */
  >
>();

type GetListFromTableConfig<
  OtherInst extends DocInst,
  TableConfig,
> = undefined extends TableConfig
  ? List<OtherInst>
  : TableConfig extends PersistanceConfig
  ? List<OtherInst>
  : TableConfig extends keyof OtherInst
  ? OtherInst[TableConfig] extends DocInst
    ? ReadonlyList<OtherInst>
    : List<OtherInst>
  : List<OtherInst>;
export function list<
  OtherClass extends DocClass,
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
          const otherDocType = OtherClass.docType;
          if (!docIndex.has(otherDocType)) {
            docIndex.set(otherDocType, new Map());
          }
          const otherDocTypeIndex = docIndex.get(otherDocType)!;
          if (!otherDocTypeIndex.has(otherProp)) {
            // Create the mutable
            otherDocTypeIndex.set(
              otherProp,
              createRoot(() => createMutable({})),
            );
            const otherDocIdsByParentId = otherDocTypeIndex.get(otherProp)!;

            // Watch for changes to the other props
            createRoot(() => {
              const mapped = mapArray(
                () => OtherClass.getAllDocs(),
                (otherInst) => {
                  const parentId = (otherInst[otherProp] as DocInst).docId;
                  if (!otherDocIdsByParentId[parentId]) {
                    otherDocIdsByParentId[parentId] = [];
                  }
                  otherDocIdsByParentId[parentId].push(otherInst.docId);
                  onDispose(() => {
                    otherDocIdsByParentId[parentId] = otherDocIdsByParentId[
                      parentId
                    ].filter((docId) => docId !== otherInst.docId);
                    if (otherDocIdsByParentId[parentId].length === 0) {
                      delete otherDocIdsByParentId[parentId];
                    }
                  });
                },
              );
              createEffect(() => mapped());
            });
          }
          const listInst = new List(
            () =>
              docIndex
                .get(otherDocType)
                ?.get(otherProp)
                ?.[inst.docId]?.map((docId) => OtherClass._fromId(docId))
                ?.filter(exists) ?? [],
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
  getPrimaryClass: (inst: DocInst) => DocClass;
  getSecondaryClass: (inst: DocInst) => DocClass;
  gePrimaryProp: (thisProp: string) => string;
  docStoreConfig: PersistanceConfig | null;
  otherDocsToStartSyncing: DocClass[];
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
          class extends PrimaryClass.RootClass.customize({
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
export class List<T extends DocInst> {
  // private readonly getArray: () => T[];
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
export type ReadonlyList<T extends DocInst> = Omit<List<T>, `add` | `remove`>;
