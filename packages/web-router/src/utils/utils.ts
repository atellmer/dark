import { SLASH, PARAMETER, PROTOCOL, SEARCH } from '../constants';

function parseURL(url: string) {
  let body = url;
  let protocol = '';
  let host = '';
  let pathname = '';
  let search = '';

  if (body.indexOf(PROTOCOL) !== -1) {
    [protocol, body] = body.split(PROTOCOL).filter(Boolean);
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

  if (pathname.indexOf(SEARCH) !== -1) {
    [pathname, search] = pathname.split(SEARCH).filter(Boolean);
  }

  return {
    protocol,
    host,
    pathname,
    search,
  };
}

function createPathname(url: string, isServer: boolean): string {
  if (url) {
    const { pathname } = parseURL(url);

    return normalaizeEnd(pathname);
  }

  if (!isServer) {
    return normalaizeEnd(location.pathname);
  }

  return '';
}

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const getParamName = (value: string) => (detectIsParam(value) ? value.slice(1, value.length) : null);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

const normalaizeEnd = (path: string) => (path.endsWith(SLASH) ? path : path + SLASH);

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

const cm = (...args: Array<string>) => [...args].filter(Boolean).join(' ').trim() || undefined;

export { parseURL, createPathname, detectIsParam, getParamName, splitPath, normalaizeEnd, sort, cm };
