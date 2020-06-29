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

function error(errStr) {
  if (typeof console !== 'undefined') {
    console.error(errStr);
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

function flatten(list: Array<any>): Array<any> {
  const flatList = [];

  for (const item of list) {
    if (isArray(item)) {
      flatList.push(...flatten(item));
    } else {
      flatList.push(item);
    }
  }

  return flatList;
}

function getTime() {
  return performance.now();
}

function keyBy<T = any>(list: Array<T>, fn: (o: T) => string | number, value = false): Record<string | number, T | boolean> {
  return list.reduce((acc, x) => (acc[fn(x)] = value ? x : true, acc), {});
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
};
