import { SLASH_MARK, PARAMETER_MARK, PROTOCOL_MARK, HASH_MARK, SEARCH_MARK } from '../constants';

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
  let hash = '';
  let search = '';

  if (body.indexOf(PROTOCOL_MARK) !== -1) {
    [protocol, body] = body.split(PROTOCOL_MARK).filter(Boolean);
  }

  const splitted = body.split('');
  const idx = splitted.findIndex(x => x === SLASH_MARK);

  if (idx !== -1) {
    host = splitted.filter((_, idx1) => idx1 < idx).join('');
    pathname = splitted.filter((_, idx1) => idx1 >= idx).join('');
  } else {
    host = body;
    pathname = pathname || SLASH_MARK;
  }

  if (pathname.indexOf(SEARCH_MARK) !== -1) {
    [pathname, search] = split(pathname, SEARCH_MARK);
  }

  if (body.indexOf(HASH_MARK) !== -1) {
    if (search) {
      [search, hash] = split(search, HASH_MARK);
    } else {
      [pathname, hash] = split(pathname, HASH_MARK);
    }
  }

  return {
    protocol,
    host,
    pathname: addSlashToEnd(pathname),
    search: createSearch(search),
    hash: createHash(hash),
  };
}

const createSearch = (value: string) => (value ? `${SEARCH_MARK}${value}` : '');

const createHash = (value: string) => (value ? `${HASH_MARK}${value}` : '');

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER_MARK);

const getParamName = (value: string) => (detectIsParam(value) ? value.slice(1, value.length) : null);

const split = (value: string, token: string) => value.split(token).filter(Boolean);

const splitPath = (path: string) => split(path, SLASH_MARK);

const addSlashToStart = (path: string) => (path.startsWith(SLASH_MARK) ? path : SLASH_MARK + path);

const addSlashToEnd = (path: string) => (path.endsWith(SLASH_MARK) ? path : path + SLASH_MARK);

function normalaizePathname(spath: string) {
  const { pathname, search, hash } = parseURL(addSlashToStart(spath));
  const newSpath = pathname + search + hash;

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
