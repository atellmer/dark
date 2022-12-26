import { SLASH, PARAMETER } from '../constants';

function comparePathes(a: string, b: string) {
  const splittedA = a.split(SLASH).filter(Boolean);
  const splittedB = b.split(SLASH).filter(Boolean);

  for (let i = 0; i < splittedA.length; i++) {
    const isParam = detectIsParam(splittedA[i]);

    if (!isParam && splittedA[i] !== splittedB[i]) {
      return false;
    }
  }

  return true;
}

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

function uniq<T>(list: Array<T>, selector: (x: T) => string | number) {
  const map: Record<string, boolean> = {};
  const uniq: Array<T> = [];

  for (const item of list) {
    const key = selector(item);

    if (!map[key]) {
      uniq.push(item);
      map[key] = true;
    }
  }

  return uniq;
}

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const createPath = (prefix: string, path: string) => (prefix ? `${prefix}${SLASH}${path}` : path);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

export { comparePathes, sort, detectIsParam, createPath, splitPath };
