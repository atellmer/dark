import { INDEX_KEY, LIB } from '../constants';

const detectIsFunction = (o: any): o is Function => typeof o === 'function';

const detectIsUndefined = (o: any): o is undefined => typeof o === 'undefined';

const detectIsNumber = (o: any): o is number => typeof o === 'number';

const detectIsString = (o: any): o is string => typeof o === 'string';

const detectIsTextBased = (o: any): o is string | number => typeof o === 'string' || typeof o === 'number';

const detectIsObject = (o: any): o is object => typeof o === 'object';

const detectIsBoolean = (o: any): o is boolean => typeof o === 'boolean';

const detectIsArray = Array.isArray as (o: any) => o is Array<any>;

const detectIsNull = (o: any): o is null => o === null;

const detectIsEmpty = (o: any) => o === null || typeof o === 'undefined';

const detectIsFalsy = (o: any) => o === null || typeof o === 'undefined' || o === false; // inlines it for optimization

const detectIsPromise = <T = unknown>(o: any): o is Promise<T> => o instanceof Promise;

const detectIsEqual = Object.is as (a: any, b: any) => boolean;

const keys = Object.keys as (o: object) => Array<string>;

const hasKeys = (o: object) => keys(o).length > 0;

const getTime = () => Date.now();

const dummyFn = () => {};

const trueFn = () => true;

const falseFn = () => false;

const logError = (...args: Array<any>) => !detectIsUndefined(console) && console.error(...args);

const formatErrorMsg = (x: string, prefix = LIB) => `[${prefix}]: ${x}`;

function throwThis(x: Error | Promise<unknown>) {
  throw x;
}

const illegal = (x: string, prefix = LIB) => throwThis(new Error(formatErrorMsg(x, prefix)));

const flatten = <T = any>(x: Array<any>) => x.flat(Infinity) as Array<T>;

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

const createError = (x: unknown) => (x instanceof Error ? x : new Error(String(x)));

const stringify = JSON.stringify as (x: unknown) => string;

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
  stringify,
};
