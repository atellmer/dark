import { illegal as $illegal } from '@dark-engine/core';

import { SLASH_MARK, LIB } from '../constants';

const createPathname = (name: string, prefix: string) => normalizePathname(`${prefix}${name}`);

function normalizePathname(pathname: string) {
  return prependSlash(pathname.split(SLASH_MARK).filter(Boolean).join(SLASH_MARK) + SLASH_MARK);
}

function prependSlash(pathname: string) {
  return pathname.startsWith(SLASH_MARK) ? pathname : SLASH_MARK + pathname;
}

function getSegments(pathname: string, prefix: string) {
  return pathname.replace(prefix, '').split(SLASH_MARK).filter(Boolean);
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
  return currentPathname.indexOf(pathname) !== -1;
}

const illegal = (x: string) => $illegal(x, LIB);

export { createPathname, normalizePathname, prependSlash, getSegments, detectIsVisited, detectIsMatch, illegal };
