export function exists<T>(x: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}
export function isNum(x: unknown): x is number {
  return exists(x) && typeof x === `number`;
}
export function isString(x: unknown): x is string {
  return exists(x) && typeof x === `string`;
}

// Define the new method on the Number interface
// declare global {
//   interface Number {
//     readonly flex: FlexSize;
//   }
// }

// // TODO: Make this a callable function and a value
// Object.defineProperty(Number.prototype, "flex", {
//   get: function () {
//     return {
//       flex: this,
//       min: -1,
//       max: Infinity,
//     };
//   },
// });

// export interface FlexSize {
//   flex: number;
//   min: number;
//   max: number;
// }
// function isFlexSize(size: any): size is FlexSize {
//   return isDefined(size?.flex);
// }

// const a = (1.0).flex;
