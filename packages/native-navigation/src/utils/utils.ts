import { SLASH } from '../constants';

const createPathname = (name: string, prefix: string) => {
  return normalizePathname(`${prefix}${name}`);
};

function normalizePathname(pathname: string) {
  const normal = prependSlash(pathname.split(SLASH).filter(Boolean).join(SLASH) + SLASH);

  return normal;
}

function prependSlash(pathname: string) {
  return pathname.startsWith(SLASH) ? pathname : SLASH + pathname;
}

function getSegments(pathname: string, prefix: string) {
  const segments = pathname.replace(prefix, '').split(SLASH).filter(Boolean);

  return segments;
}

function getMatchedIdx(pathnames: Array<string>, pathname: string) {
  return pathnames.findIndex(x => pathname.indexOf(x) !== -1);
}

export { createPathname, normalizePathname, prependSlash, getSegments, getMatchedIdx };
