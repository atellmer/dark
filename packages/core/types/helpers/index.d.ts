import type { NestedArray } from '../shared';
declare const detectIsFunction: (o: any) => o is Function;
declare const detectIsUndefined: (o: any) => o is undefined;
declare const detectIsNumber: (o: any) => o is number;
declare const detectIsString: (o: any) => o is string;
declare const detectIsObject: (o: any) => o is object;
declare const detectIsBoolean: (o: any) => o is boolean;
declare const detectIsArray: (o: any) => o is any[];
declare const detectIsNull: (o: any) => o is null;
declare const detectIsEmpty: (o: any) => boolean;
declare const detectIsFalsy: (o: any) => boolean;
declare function error(str: string): void;
declare function flatten<T = any>(source: Array<NestedArray<T>>): Array<T>;
declare function getTime(): number;
declare function keyBy<T = any>(
  list: Array<T>,
  fn: (o: T) => string | number,
  value?: boolean,
): Record<string | number, T | boolean>;
declare const dummyFn: () => void;
declare function detectIsDepsDifferent(deps: Array<unknown>, prevDeps: Array<unknown>): boolean;
export {
  detectIsFunction,
  detectIsUndefined,
  detectIsNumber,
  detectIsString,
  detectIsObject,
  detectIsBoolean,
  detectIsArray,
  detectIsNull,
  detectIsEmpty,
  detectIsFalsy,
  error,
  flatten,
  getTime,
  keyBy,
  dummyFn,
  detectIsDepsDifferent,
};
