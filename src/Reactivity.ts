import { getLocalCache } from "./Implement";

export const MFS_IS_PROP = Symbol(`MFS_IS_PROP`);

// TODO: Implement an optional type.
export type PropReader<T> = {
  readonly [MFS_IS_PROP]: true;
  // subscribe(callback: () => void): () => void; // Returns a function to unsubscribe.
  get(): T;
};
export type PropWriter<T> = {
  readonly [MFS_IS_PROP]: true;
  set(newValue: T): void;
};
export type Prop<T> = PropReader<T> & PropWriter<T>;
export function prop<T>(initValue: T): Prop<T> {
  return getLocalCache().createProp(initValue);
}
export function formula<T>(evaluate: () => T): PropReader<T> {
  return getLocalCache().createFormula(evaluate);
}
// export function list<T extends abstract new (...args: any) => any>(
//   typeClass: T,
//   propName: keyof InstanceType<T>,
// ) {
//   return [];
// }
