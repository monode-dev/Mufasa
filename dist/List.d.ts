import { Doc, GetDefaultPersistersFromDocType } from "./Doc.js";
type GetListFromTableConfig<OtherInst extends Doc, TableConfig> = undefined extends TableConfig ? List<OtherInst> : TableConfig extends GetDefaultPersistersFromDocType ? List<OtherInst> : TableConfig extends keyof OtherInst ? OtherInst[TableConfig] extends Doc ? ReadonlyList<OtherInst> : List<OtherInst> : List<OtherInst>;
export declare function list<OtherClass extends typeof Doc, TableConfig extends undefined | GetDefaultPersistersFromDocType | keyof InstanceType<OtherClass>>(OtherClass: OtherClass, tableConfig?: TableConfig): GetListFromTableConfig<InstanceType<OtherClass>, TableConfig>;
export declare class List<T extends Doc> {
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
export type ReadonlyList<T extends Doc> = Omit<List<T>, `add` | `remove`>;
export {};
