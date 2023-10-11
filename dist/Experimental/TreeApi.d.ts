import { PropReader } from "../Reactivity";
export declare const MFS_ID: unique symbol;
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
export declare abstract class MfsObj {
    /*** This can be overridden to manually specify a type name. */
    static get typeName(): string;
    get typeName(): string;
    readonly [MFS_ID]: PropReader<string>;
    constructor(id: PropReader<string>);
    private static _spawnInst;
    static create<T extends typeof MfsObj>(this: T, createProps?: Partial<InstanceType<T>>): InstanceType<T>;
    static getAllDocs<T extends typeof MfsObj>(this: T): InstanceType<T>[];
    static docCollections: {
        [collectionName: string]: {
            [docId: string]: MfsObj;
        };
    };
}
