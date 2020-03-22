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
      flatList.push(...item);
    } else {
      flatList.push(item);
    }
  }

  return flatList;
}

function getTime() {
  return performance.now();
}

function truncateComponentId(componentId: string): string {
  const hasComponentMarker =
    componentId[componentId.length - 2] === '-' &&
    componentId[componentId.length - 5] === '-';

  if (hasComponentMarker) {
    return componentId.replace(/((\.\-1)+)$/, '.-1');
  }

  return componentId;
}

function debounce(fn: Function, delay: number = 0) {
  let calls = [];
  let prevResult;
  let timerId = null;

  if (process.env.NODE_ENV === 'test') {
    return fn;
  }

  return (...args) => {
    calls.push(() => fn(...args));
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      if (calls.length > 0) {
        prevResult = calls[calls.length - 1]();
        calls = [];
      }
    }, delay);

    return prevResult;
  };
};

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
  debounce,
};
