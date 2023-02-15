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
  return pathnames.findIndex(x => detectIsMatch(pathname, x));
}

function detectIsVisited(map: Record<string, boolean>, pathname: string) {
  for (const key of Object.keys(map)) {
    const source = key.length >= pathname.length ? key : pathname;
    const target = key.length < pathname.length ? key : pathname;

    if (detectIsMatch(source, target)) return true;
  }

  return false;
}

function detectIsMatch(currentPathname: string, pathname: string) {
  const isMatch = currentPathname.indexOf(pathname) !== -1;

  return isMatch;
}

export { createPathname, normalizePathname, prependSlash, getSegments, getMatchedIdx, detectIsVisited, detectIsMatch };
