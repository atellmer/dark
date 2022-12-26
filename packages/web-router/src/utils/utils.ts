import { SLASH, PARAMETER } from '../constants';

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

const normalaizeEnd = (path: string) => (path.endsWith(SLASH) ? path : path + SLASH);

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

export { detectIsParam, splitPath, normalaizeEnd, sort };
