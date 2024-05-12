import { detectIsFalsy } from '@dark-engine/core';

import { parseURL, illegal } from '../utils';

class RouterLocation {
  url: string;
  protocol: string;
  host: string;
  pathname: string;
  hash: string;
  search: string;
  key: string;

  constructor(url: string) {
    if (detectIsFalsy(url)) illegal('The RouterLocation must have an initial url!');
    const { protocol, host, pathname, hash, search } = parseURL(url);

    this.url = url;
    this.protocol = protocol;
    this.host = host;
    this.pathname = pathname;
    this.hash = hash;
    this.search = search;
    this.key = createKey(pathname);
    Object.freeze(this);
  }
}

function createKey(path: string): string {
  return path
    .split('')
    .map(x => x.charCodeAt(0))
    .reduce((acc, x) => ((acc += x), acc), 200000)
    .toString(32);
}

const createRouterLocation = (url: string) => new RouterLocation(url);

export { RouterLocation, createRouterLocation };
