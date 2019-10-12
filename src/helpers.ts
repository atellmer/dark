const isFunction = o => typeof o === 'function';
const isUndefined = o => typeof o === 'undefined';
const isNumber = o => typeof o === 'number';
const isString = o => typeof o === 'string';
const isObject = o => typeof o === 'object';
const isArray = Array.isArray;
const isNull = o => o === null;
const isEmpty = o => isNull(o) || isUndefined(o);
const isDOMElement = element => element instanceof Element || element instanceof HTMLDocument;

function error(errStr) {
  throw new Error(errStr);
}

function deepClone(obj: any) {
  const isObject = typeof obj === 'object';
  const isFunction = typeof obj === 'function';
  const copyObj = isObject
    ? Array.isArray(obj)
      ? [...obj]
      : Boolean(obj)
      ? { ...obj }
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
  let flatList = [];

  for (const el of list) {
    if (isArray(el)) {
      flatList = flatList.concat(el);
    } else {
      flatList.push(el);
    }
  }

  return flatList;
}

export {
  isFunction,
  isUndefined,
  isNumber,
  isString,
  isObject,
  isArray,
  isNull,
  isEmpty,
  error,
  isDOMElement,
  deepClone,
  flatten,
};
