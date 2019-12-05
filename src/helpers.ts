const isFunction = (o): o is Function => typeof o === 'function';
const isUndefined = o => typeof o === 'undefined';
const isNumber = o => typeof o === 'number';
const isString = o => typeof o === 'string';
const isObject = o => typeof o === 'object';
const isArray = Array.isArray;
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

function getTime() {
  return performance.now();
}

const truncateComponentId = (id: string): string => id.replace(/(\.|-1)*$/, '.-1');

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
  getTime,
  truncateComponentId,
};
