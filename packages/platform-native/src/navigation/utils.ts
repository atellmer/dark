import { SLASH } from './constants';

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

type DetectIsMatchOptions = {
  prevPathname: string;
  nextPathname: string;
  pathnames: Array<string>;
  prefix: string;
};

function detectIsMatch(options: DetectIsMatchOptions) {
  const { prevPathname, nextPathname, pathnames, prefix } = options;
  const hasSameRoute = detectIsMatchPathname(pathnames, nextPathname);
  const nextSegment = getSegment(nextPathname, prefix);
  const prevSegment = getSegment(prevPathname, prefix);
  const isMatch = hasSameRoute && nextSegment !== prevSegment;

  return isMatch;
}

function getSegment(pathname: string, prefix: string) {
  const [segment] = pathname.replace(prefix, '').split(SLASH).filter(Boolean);

  return segment;
}

function detectIsMatchPathname(pathnames: Array<string>, pathname: string) {
  return pathnames.some(x => pathname.indexOf(x) !== -1);
}

function getMatchedIdx(pathnames: Array<string>, pathname: string) {
  return pathnames.findIndex(x => pathname.indexOf(x) !== -1);
}

export { createPathname, normalizePathname, prependSlash, detectIsMatch, getSegment, getMatchedIdx };
