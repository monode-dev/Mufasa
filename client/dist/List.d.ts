import { DocClass, DocInst } from "./Doc.js";
import { PersistanceConfig } from "./DocStore.js";
type GetListFromTableConfig<OtherInst extends DocInst, TableConfig> = undefined extends TableConfig ? List<OtherInst> : TableConfig extends PersistanceConfig ? List<OtherInst> : TableConfig extends keyof OtherInst ? OtherInst[TableConfig] extends DocInst ? ReadonlyList<OtherInst> : List<OtherInst> : List<OtherInst>;
export declare function list<OtherClass extends DocClass, TableConfig extends undefined | PersistanceConfig | (keyof InstanceType<OtherClass> & string)>(OtherClass: OtherClass, tableConfig?: TableConfig): GetListFromTableConfig<InstanceType<OtherClass>, TableConfig>;
export declare class List<T extends DocInst> {
    private readonly getArray;
    readonly add: (value: T) => void;
    readonly remove: (value: T) => void;
    [Symbol.iterator](): IterableIterator<T>;
    forEach(callbackfn: (value: T) => void): void;
    map<U>(callbackfn: (value: T) => U): U[];
    has(toFind: T): boolean;
    get count(): number;
    constructor(getArray: () => T[], add: (value: T) => void, remove: (value: T) => void);
}
export type ReadonlyList<T extends DocInst> = Omit<List<T>, `add` | `remove`>;
export {};
