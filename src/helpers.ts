import { NestedArray } from '@core/shared';


const isFunction = (o): o is Function => typeof o === 'function';
const isUndefined = o => typeof o === 'undefined';
const isNumber = o => typeof o === 'number';
const isString = o => typeof o === 'string';
const isObject = o => typeof o === 'object';
const isBoolean = o => typeof o === 'boolean';
const isArray = (o: unknown): o is Array<any> => Array.isArray(o);
const isNull = o => o === null;
const isEmpty = o => isNull(o) || isUndefined(o);
const isDOMElement = element => element instanceof Element || element instanceof HTMLDocument;

function error(str: string) {
  if (typeof console !== 'undefined') {
    console.error(str);
  }
}

function deepClone(obj: any) {
  const isObject = typeof obj === 'object';
  const isFunction = typeof obj === 'function';
  const copyObj = isObject
    ? Array.isArray(obj)
      ? [...obj]
      : Boolean(obj)
      ? obj instanceof Element ? obj : { ...obj }
      : obj
    : isFunction
    ? function() {
        return obj.apply(this, arguments);
      }
    : obj;
  const clonePropsFn = (prop: string) => (copyObj[prop] = deepClone(copyObj[prop]));

  Boolean(copyObj) && isObject && Object.keys(copyObj).forEach(clonePropsFn);

  return copyObj;
}

// flatten without recursion
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

    if (isArray(item)) {
      level++;
      levelMap[level] = {
        idx: 0,
        source: item,
      };
    } else {
      list.push(item);
      levelMap[level].idx++;
    }
  } while (!(level === 0 && levelMap[level].idx >= levelMap[level].source.length))

  return list;
}

function getTime() {
  return performance.now();
}

function keyBy<T = any>(list: Array<T>, fn: (o: T) => string | number, value = false): Record<string | number, T | boolean> {
  return list.reduce((acc, x) => (acc[fn(x)] = value ? x : true, acc), {});
}

function takeListFromEnd(source: Array<any>, count: number) {
  return [...source].splice(-count);
}

export {
  isFunction,
  isUndefined,
  isNumber,
  isString,
  isObject,
  isBoolean,
  isArray,
  isNull,
  isEmpty,
  error,
  isDOMElement,
  deepClone,
  flatten,
  getTime,
  keyBy,
  takeListFromEnd,
};
