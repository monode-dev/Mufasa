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

export function formatNumWithCommas(
  num: number,
  digits: number | `min` = 0,
): string {
  const rounded = roundToString(num, digits);
  const [whole, decimal] = rounded.split(`.`);
  const wholeWithComma = whole.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  return `${wholeWithComma}${exists(decimal) ? `.${decimal}` : ``}`;
}

export function roundToString(num: number, digits: number | `min` = 0): string {
  // Sometimes there are rouding errors. adding a 0.000..01 on the end seems to reduce these.
  const significantDecimals = num.toString().split(`.`)[1]?.length ?? 0;
  const acutalDigits = digits === `min` ? significantDecimals : digits;
  const numRoundingOffset = Math.pow(10, -significantDecimals - 1);
  const digitRoundOffset = Math.pow(10, -acutalDigits - 1);
  const roundingOffset = Math.min(numRoundingOffset, digitRoundOffset);
  return (num + roundingOffset).toFixed(acutalDigits);
}
