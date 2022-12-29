import { detectIsFalsy } from '@dark-engine/core';
import { parseURL } from '../utils';

class RouterLocation {
  public url: string;
  public protocol: string;
  public host: string;
  public pathname: string;
  public search: string;
  public key: string;
  private static nextId = 200000;

  constructor(url: string) {
    if (detectIsFalsy(url)) {
      throw new Error('[web-router]: RouterLocation must have initial url!');
    }

    const { protocol, host, pathname, search } = parseURL(url);

    this.url = url;
    this.protocol = protocol;
    this.host = host;
    this.pathname = pathname;
    this.search = search;
    this.key = (++RouterLocation.nextId).toString(32);
    Object.freeze(this);
  }
}

const createRouterLocation = (url: string) => new RouterLocation(url);

export { RouterLocation, createRouterLocation };
