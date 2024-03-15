import { MfsDoc } from "./Doc.js";
import { DocStoreConfig } from "./DocStore.js";
type GetListFromTableConfig<OtherInst extends MfsDoc, TableConfig> = undefined extends TableConfig ? List<OtherInst> : TableConfig extends DocStoreConfig ? List<OtherInst> : TableConfig extends keyof OtherInst ? OtherInst[TableConfig] extends MfsDoc ? ReadonlyList<OtherInst> : List<OtherInst> : List<OtherInst>;
export declare function list<OtherClass extends typeof MfsDoc, TableConfig extends undefined | DocStoreConfig | (keyof InstanceType<OtherClass> & string)>(OtherClass: OtherClass, tableConfig?: TableConfig): GetListFromTableConfig<InstanceType<OtherClass>, TableConfig>;
export declare class List<T extends MfsDoc> {
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
export type ReadonlyList<T extends MfsDoc> = Omit<List<T>, `add` | `remove`>;
export {};
