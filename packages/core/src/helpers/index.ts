import type { NestedArray } from '../shared';

const detectIsFunction = (o: any): o is Function => typeof o === 'function';

const detectIsUndefined = (o: any): o is undefined => typeof o === 'undefined';

const detectIsNumber = (o: any): o is number => typeof o === 'number';

const detectIsString = (o: any): o is string => typeof o === 'string';

const detectIsObject = (o: any): o is object => typeof o === 'object';

const detectIsBoolean = (o: any): o is boolean => typeof o === 'boolean';

const detectIsArray = (o: any): o is Array<any> => Array.isArray(o);

const detectIsNull = (o: any): o is null => o === null;

const detectIsEmpty = (o: any) => detectIsNull(o) || detectIsUndefined(o);

const detectIsFalsy = (o: any) => detectIsEmpty(o) || o === false;

const getTime = () => Date.now();

const dummyFn = () => {};

const trueFn = () => true;

function error(...args: Array<any>) {
  !detectIsUndefined(console) && console.error(...args);
}

function flatten<T = any>(source: Array<NestedArray<T>>): Array<T> {
  if (source.length === 0) return [];
  const list: Array<T> = [];
  const stack = [source[0]];
  let idx = 0;

  while (stack.length > 0) {
    const x = stack.pop();

    if (detectIsArray(x)) {
      for (let i = x.length - 1; i >= 0; i--) {
        stack.push(x[i]);
      }
    } else {
      list.push(x);

      if (stack.length === 0 && idx < source.length - 1) {
        idx++;
        stack.push(source[idx]);
      }
    }
  }

  return list;
}

function keyBy<T = any>(
  list: Array<T>,
  fn: (o: T) => string | number,
  value = false,
): Record<string | number, T | boolean> {
  return list.reduce((acc, x) => ((acc[fn(x)] = value ? x : true), acc), {});
}

function detectAreDepsDifferent(deps: Array<unknown>, prevDeps: Array<unknown>): boolean {
  if (deps && prevDeps && deps.length > 0 && prevDeps.length > 0) {
    for (let i = 0; i < prevDeps.length; i++) {
      if (prevDeps[i] !== deps[i]) return true;
    }
  }

  return false;
}

function nextTick(callback: () => void) {
  Promise.resolve().then(callback);
}

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
  getTime,
  dummyFn,
  trueFn,
  error,
  flatten,
  keyBy,
  detectAreDepsDifferent,
  nextTick,
};
