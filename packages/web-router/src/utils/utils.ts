import { illegal as $illegal } from '@dark-engine/core';

import { SLASH_MARK, PARAMETER_MARK, PROTOCOL_MARK, HASH_MARK, SEARCH_MARK, LIB } from '../constants';

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
    [protocol, body] = body.split(PROTOCOL_MARK).filter((x, _, arr) => (arr.length > 2 ? Boolean(x) : true));
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
    pathname,
    search: createSearch(search),
    hash: createHash(hash),
  };
}

const createSearch = (x: string) => (x ? `${SEARCH_MARK}${x}` : '');

const createHash = (x: string) => (x ? `${HASH_MARK}${x}` : '');

const detectIsParam = (x: string) => x && x.startsWith(PARAMETER_MARK);

const getParamName = (x: string) => (detectIsParam(x) ? x.slice(1, x.length) : null);

const split = (x: string, token: string) => x.split(token).filter(Boolean);

const splitBySlash = (x: string) => split(x, SLASH_MARK);

const startSlash = (x: string) => (x.startsWith(SLASH_MARK) ? x : SLASH_MARK + x);

const join = (...args: Array<string>) => args.join('');

function normalizePath(x: string) {
  const { pathname, search, hash } = parseURL(startSlash(x));

  return reduceSlashes(join(pathname, search, hash));
}

const reduceSlashes = (x: string) => x.replaceAll(new RegExp(`${SLASH_MARK}+`, 'g'), SLASH_MARK);

const trimSlashes = (x: string) => x.replace(new RegExp(`^${SLASH_MARK}+|${SLASH_MARK}+$`, 'g'), '');

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

const cm = (...args: Array<string>) => [...args].filter(Boolean).join(' ').trim() || undefined;

const illegal = (x: string) => $illegal(x, LIB);

function keyBy<T = any>(
  list: Array<T>,
  fn: (o: T) => string | number,
  value = false,
): Record<string | number, T | boolean> {
  return list.reduce((acc, x) => ((acc[fn(x)] = value ? x : true), acc), {});
}

export {
  pipe,
  parseURL,
  detectIsParam,
  getParamName,
  splitBySlash,
  normalizePath,
  reduceSlashes,
  trimSlashes,
  join,
  sort,
  cm,
  illegal,
  keyBy,
};
