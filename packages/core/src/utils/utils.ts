import type { NestedArray } from '../shared';
import { INDEX_KEY, LIB } from '../constants';

const detectIsFunction = (o: any): o is Function => typeof o === 'function';

const detectIsUndefined = (o: any): o is undefined => typeof o === 'undefined';

const detectIsNumber = (o: any): o is number => typeof o === 'number';

const detectIsString = (o: any): o is string => typeof o === 'string';

const detectIsTextBased = (o: any): o is string | number => typeof o === 'string' || typeof o === 'number';

const detectIsObject = (o: any): o is object => typeof o === 'object';

const detectIsBoolean = (o: any): o is boolean => typeof o === 'boolean';

const detectIsArray = (o: any): o is Array<any> => Array.isArray(o);

const detectIsNull = (o: any): o is null => o === null;

const detectIsEmpty = (o: any) => detectIsNull(o) || detectIsUndefined(o);

const detectIsFalsy = (o: any) => detectIsEmpty(o) || o === false;

const detectIsPromise = <T = unknown>(o: any): o is Promise<T> => o instanceof Promise;

const detectIsEqual = (a: any, b: any) => Object.is(a, b);

const keys = (o: object) => Object.keys(o);

const hasKeys = (o: object) => keys(o).length > 0;

const getTime = () => Date.now();

const dummyFn = () => {};

const trueFn = () => true;

const falseFn = () => false;

const sameFn = <T = any>(x: T) => x;

const logError = (...args: Array<any>) => !detectIsUndefined(console) && console.error(...args);

const formatErrorMsg = (x: string, prefix = LIB) => `[${prefix}]: ${x}`;

function throwThis(x: Error | Promise<unknown>) {
  throw x;
}

const illegal = (x: string, prefix = LIB) => throwThis(new Error(formatErrorMsg(x, prefix)));

function flatten<T = any>(source: Array<NestedArray<T>>, transform: (x: T) => any = sameFn): Array<T> {
  if (detectIsArray(source)) {
    if (source.length === 0) return [];
  } else {
    return [transform(source)];
  }

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
      list.push(transform(x));

      if (stack.length === 0 && idx < source.length - 1) {
        idx++;
        stack.push(source[idx]);
      }
    }
  }

  return list;
}

function detectAreDepsDifferent(prevDeps: Array<unknown>, nextDeps: Array<unknown>): boolean {
  if (prevDeps === nextDeps || (prevDeps.length === 0 && nextDeps.length === 0)) return false;
  const max = Math.max(prevDeps.length, nextDeps.length);

  for (let i = 0; i < max; i++) {
    if (!detectIsEqual(prevDeps[i], nextDeps[i])) return true;
  }

  return false;
}

const nextTick = (callback: () => void) => Promise.resolve().then(callback);

const createIndexKey = (idx: number) => `${INDEX_KEY}:${idx}`;

const mapRecord = <T extends object>(record: T) => keys(record).map(x => record[x]);

function createError(reason: unknown) {
  return reason instanceof Error ? reason : new Error(String(reason).replace('Error: ', ''));
}

export {
  detectIsFunction,
  detectIsUndefined,
  detectIsNumber,
  detectIsString,
  detectIsTextBased,
  detectIsObject,
  detectIsBoolean,
  detectIsArray,
  detectIsNull,
  detectIsEmpty,
  detectIsFalsy,
  detectIsPromise,
  detectIsEqual,
  keys,
  hasKeys,
  getTime,
  dummyFn,
  trueFn,
  falseFn,
  logError,
  formatErrorMsg,
  throwThis,
  illegal,
  flatten,
  detectAreDepsDifferent,
  nextTick,
  createIndexKey,
  mapRecord,
  createError,
};
