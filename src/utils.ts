export function isDefined<T>(x: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}
export function isNum(x: unknown): x is number {
  return isDefined(x) && typeof x === `number`;
}
export function isString(x: unknown): x is string {
  return isDefined(x) && typeof x === `string`;
}