export function exists<T>(x: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}

export function orderDocs<T, K extends string | number | null | undefined>(
  list: Iterable<T>,
  getKey: (obj: T) => K,
  options?: {
    nullPosition?: `first` | `last`;
    direction?: `normal` | `reverse`;
  },
): T[] {
  return [...list].sort((a, b) => {
    const direction = options?.direction ?? `normal`;
    const nullPosition = options?.nullPosition ?? `first`;
    const keyA = getKey(direction === `normal` ? a : b);
    const keyB = getKey(direction === `normal` ? b : a);
    if (!exists(keyA)) {
      return nullPosition === `first` ? -1 : 1;
    } else if (!exists(keyB)) {
      return nullPosition === `first` ? 1 : -1;
    } else {
      if (typeof keyA === `number` && typeof keyB === `number`) {
        return keyA - keyB;
      } else {
        return keyA.toString().localeCompare(keyB.toString());
      }
    }
  });
}
