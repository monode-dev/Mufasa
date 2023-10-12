import { PropReader, MFS_IS_PROP, Prop, MFS_IS_LIST } from "../Reactivity";
export declare function list<T extends typeof MfsObj>(entryClass: T, propName: keyof InstanceType<T>): {
    [MFS_IS_PROP]: boolean;
    [MFS_IS_LIST]: boolean;
    entryClass: T;
    otherPropName: keyof InstanceType<T>;
    get(): never[];
};
export type MfsPropsForCreate<T extends typeof MfsObj> = Partial<{
    [propName in keyof InstanceType<T>]: InstanceType<T>[propName] extends Prop<infer T> ? T : never;
}>;
/** TypeName will be inferred from class name. Override YourType.typeName to manually specify a type name. */
export declare abstract class MfsObj {
    /*** This can be overridden to manually specify a type name. */
    static get typeName(): string;
    get typeName(): string;
    readonly mfsId: PropReader<string>;
    static getAllDocs<T extends typeof MfsObj>(this: T): InstanceType<T>[];
    static create<T extends typeof MfsObj>(this: T, createProps?: MfsPropsForCreate<T>): InstanceType<T>;
    private static _create;
    /** Permanently deletes this object. */
    delete(): void;
}
