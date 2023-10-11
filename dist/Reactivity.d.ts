export declare const MFS_IS_PROP: unique symbol;
export type PropReader<T> = {
    readonly [MFS_IS_PROP]: true;
    get(): T;
};
export type PropWriter<T> = {
    readonly [MFS_IS_PROP]: true;
    set(newValue: T): void;
};
export type Prop<T> = PropReader<T> & PropWriter<T>;
export declare function prop<T>(initValue: T): Prop<T>;
export declare function formula<T>(evaluate: () => T): PropReader<T>;
