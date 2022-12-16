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

const detectIsFalsy = (o: any) => detectIsNull(o) || detectIsUndefined(o) || o === false;

const getTime = () => Date.now();

const dummyFn = () => {};

function error(...args: Array<any>) {
  !detectIsUndefined(console) && console.error(...args);
}

function flatten<T = any>(source: Array<NestedArray<T>>): Array<T> {
  const list = [];
  const levelMap = { 0: { idx: 0, source } };
  let level = 0;

  do {
    const { source, idx } = levelMap[level];
    const item = source[idx];

    if (idx >= source.length) {
      level--;
      levelMap[level].idx++;
      continue;
    }

    if (detectIsArray(item)) {
      level++;
      levelMap[level] = {
        idx: 0,
        source: item,
      };
    } else {
      list.push(item);
      levelMap[level].idx++;
    }
  } while (level > 0 || levelMap[level].idx < levelMap[level].source.length);

  return list;
}

function keyBy<T = any>(
  list: Array<T>,
  fn: (o: T) => string | number,
  value = false,
): Record<string | number, T | boolean> {
  return list.reduce((acc, x) => ((acc[fn(x)] = value ? x : true), acc), {});
}

function detectIsDepsDifferent(deps: Array<unknown>, prevDeps: Array<unknown>): boolean {
  if (!detectIsUndefined(deps) && !detectIsUndefined(prevDeps) && deps.length > 0 && prevDeps.length > 0) {
    for (let i = 0; i < prevDeps.length; i++) {
      if (prevDeps[i] !== deps[i]) {
        return true;
      }
    }
  }

  return false;
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
  error,
  flatten,
  keyBy,
  detectIsDepsDifferent,
};
