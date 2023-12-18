import { CLASS_NAME_DELIMETER_MARK } from '../constants';

const uniq = <T>(items: Array<T>, selector: (x: T) => unknown = x => x) => {
  const arr: Array<T> = [];
  const set = new Set();

  for (const item of items) {
    const key = selector(item);

    !set.has(key) && arr.push(item);
    set.add(key);
  }

  return arr;
};

const mapProps = <T extends object>(props: T) => Object.keys(props).map(key => props[key]);

const mergeClassNames = (classNames: Array<string>) => uniq(classNames.filter(Boolean)).join(CLASS_NAME_DELIMETER_MARK);

export { uniq, mapProps, mergeClassNames };
