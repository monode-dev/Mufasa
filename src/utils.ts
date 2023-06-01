export function exists<T>(x: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}
