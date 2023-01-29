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
  const hasSameRoute = pathnames.some(x => nextPathname.indexOf(x) !== -1);
  const nextSegment = getSegment(nextPathname, prefix);
  const prevSegment = getSegment(prevPathname, prefix);
  const isMatch = hasSameRoute && nextSegment !== prevSegment;

  return isMatch;
}

function getSegment(pathname: string, prefix: string) {
  const [segment] = pathname.replace(prefix, '').split(SLASH).filter(Boolean);

  return segment;
}

export { createPathname, normalizePathname, prependSlash, detectIsMatch, getSegment };
