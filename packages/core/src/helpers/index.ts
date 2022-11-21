import type { NestedArray } from '../shared';

const detectIsFunction = (o: any): o is Function => typeof o === 'function';
const detectIsUndefined = (o: any) => typeof o === 'undefined';
const detectIsNumber = (o: any) => typeof o === 'number';
const detectIsString = (o: any) => typeof o === 'string';
const detectIsObject = (o: any) => typeof o === 'object';
const detectIsBoolean = (o: any) => typeof o === 'boolean';
const detectIsArray = (o: any): o is Array<any> => Array.isArray(o);
const detectIsNull = (o: any) => o === null;
const detectIsEmpty = (o: any) => detectIsNull(o) || detectIsUndefined(o);

function error(str: string) {
  !detectIsUndefined(console) && console.error(str);
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

function getTime() {
  return Date.now();
}

function keyBy<T = any>(
  list: Array<T>,
  fn: (o: T) => string | number,
  value = false,
): Record<string | number, T | boolean> {
  return list.reduce((acc, x) => ((acc[fn(x)] = value ? x : true), acc), {});
}

function takeListFromEnd<T>(source: Array<T>, count: number) {
  return source.slice(source.length - count, source.length);
}

const dummyFn = () => {};

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
  error,
  flatten,
  getTime,
  keyBy,
  takeListFromEnd,
  dummyFn,
  detectIsDepsDifferent,
};
