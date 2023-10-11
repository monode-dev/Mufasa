"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formula = exports.prop = exports.MFS_IS_PROP = void 0;
const Implement_1 = require("./Implement");
exports.MFS_IS_PROP = Symbol(`MFS_IS_PROP`);
function prop(initValue) {
    return (0, Implement_1.getLocalCache)().createProp(initValue);
}
exports.prop = prop;
function formula(evaluate) {
    return (0, Implement_1.getLocalCache)().createFormula(evaluate);
}
exports.formula = formula;
// export function list<T extends abstract new (...args: any) => any>(
//   typeClass: T,
//   propName: keyof InstanceType<T>,
// ) {
//   return [];
// }
