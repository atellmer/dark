import { SLASH, PARAMETER, PROTOCOL_MARK, SEARCH_MARK } from '../constants';

function pipe<T>(...fns: Array<Function>): (...args: Array<any>) => T {
  const [fn, ...rest] = fns;

  return (...args: Array<any>) => {
    return rest.reduce(
      (fn1, fn2) => () => fn2(fn1()),
      () => fn(...args),
    )();
  };
}

function parseURL(url: string) {
  let body = url;
  let protocol = '';
  let host = '';
  let pathname = '';
  let search = '';

  if (body.indexOf(PROTOCOL_MARK) !== -1) {
    [protocol, body] = body.split(PROTOCOL_MARK).filter(Boolean);
  }

  const splitted = body.split('');
  const idx = splitted.findIndex(x => x === SLASH);

  if (idx !== -1) {
    host = splitted.filter((_, idx1) => idx1 < idx).join('');
    pathname = splitted.filter((_, idx1) => idx1 >= idx).join('');
  } else {
    host = body;
    pathname = SLASH;
  }

  if (pathname.indexOf(SEARCH_MARK) !== -1) {
    [pathname, search] = pathname.split(SEARCH_MARK).filter(Boolean);
  }

  return {
    protocol,
    host,
    pathname: normalaizePathname(pathname),
    search: createSearch(search),
  };
}

const createSearch = (value: string) => (value ? `${SEARCH_MARK}${value}` : '');

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const getParamName = (value: string) => (detectIsParam(value) ? value.slice(1, value.length) : null);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

function normalaizePathname(spath: string) {
  const [path, search] = spath.split(SEARCH_MARK);
  const newSpath = (path.endsWith(SLASH) ? path : path + SLASH) + createSearch(search);

  return newSpath;
}

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

const cm = (...args: Array<string>) => [...args].filter(Boolean).join(' ').trim() || undefined;

export { pipe, parseURL, detectIsParam, getParamName, splitPath, normalaizePathname, sort, cm };
