const isFunction = o => typeof o === 'function';
const isUndefined = o => typeof o === 'undefined';
const isNumber = o => typeof o === 'number';
const isObject = o => typeof o === 'object';
const isArray = o => Array.isArray(o);
const isNull = o => o === null;
const isEmpty = o => isNull(o) || isUndefined(o);
const isDOMElement = element => element instanceof Element || element instanceof HTMLDocument;

function escapeTags(str: string) {
  const map = {};

  return str.replace(/(.)/gm, (char: string) => map[char] || char);
}

function sanitize(o = {}) {
  if (typeof o === 'string') {
    return escapeTags(o);
  } else if (typeof o === 'object' && o !== null) {
    Object.keys(o).forEach(key => {
      if (typeof o[key] === 'string') {
        o[key] = escapeTags(o[key]);
      } else if (typeof o[key] === 'object') {
        sanitize(o[key]);
      }
    });
  }

  return o;
}

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

function flatten(arr: Array<any>): Array<any> {
  const list = arr.reduce((acc, el) => {
    if (isArray(el)) {
      acc.push(...(el as any));
    } else {
      acc.push(el);
    }

    return acc;
  }, []);

  return list;
}

export {
  isFunction,
  isUndefined,
  isNumber,
  isObject,
  isArray,
  isNull,
  isEmpty,
  escapeTags,
  sanitize,
  error,
  isDOMElement,
  deepClone,
  flatten,
};
