import { type DarkElement } from '@dark-engine/core';

import { SLASH, WILDCARD } from '../constants';
import { splitPath, normalaizeEnd, detectIsParam, getParamName, sort } from '../utils';
import type { Routes, RouteDescriptor, PathMatchStrategy } from './types';

type RouteConstructorOptions = {
  prefix: string;
  parent: Route;
} & RouteDescriptor;

class Route {
  public path = '';
  public fullPath = '';
  public pathMatch?: PathMatchStrategy;
  public redirectTo?: string;
  public parent: Route = null;
  public children: Array<Route> = [];
  public cursor: Route = null;
  public level: number = null;
  public component?: RouteConstructorOptions['component'];

  constructor(options: RouteConstructorOptions) {
    const { prefix, path, redirectTo, pathMatch = 'prefix', children = [], parent, component } = options;
    const fullPath = createPath(pathMatch, prefix, path);

    this.level = parent ? parent.level + 1 : 0;
    this.cursor = this;
    this.path = path;
    this.pathMatch = pathMatch;
    this.parent = parent;
    this.fullPath = fullPath;
    this.children = createRoutes(children, fullPath, this);

    if (component) {
      this.component = component;
    }

    if (redirectTo) {
      this.redirectTo = createPath(pathMatch, prefix, redirectTo);
    }
  }

  public setCursor(cursor: Route) {
    this.cursor = cursor || this.cursor;

    if (this.parent) {
      this.parent.setCursor(cursor);
    }
  }

  public matchRender(url: string): DarkElement {
    const matched = match(url, this.children);

    this.setCursor(matched);

    return this.component({ slot: renderRoute(url, matched), key: this.path, path: this.fullPath });
  }
}

const getParamsMap = (url: string, route: Route): Map<string, string> => {
  const sUrl = splitPath(url);
  const sPath = splitPath(route.fullPath);
  const map = new Map();

  for (let i = 0; i < sPath.length; i++) {
    if (detectIsParam(sPath[i])) {
      map.set(getParamName(sPath[i]), sUrl[i]);
    }
  }

  return map;
};

function createRoutes(routes: Routes, prefix = SLASH, parent: Route = null): Array<Route> {
  const routes$: Array<Route> = [];

  for (const route of routes) {
    const route$ = new Route({ ...route, prefix, parent });

    routes$.push(route$, ...route$.children);
  }

  return routes$;
}

function match(url: string, routes: Array<Route>): Route {
  const route = matchRoute(url, routes);

  if (route?.redirectTo) return redirect(route.fullPath, route.redirectTo, routes);

  if (detectCanRenderRoute(route)) return route;

  const wildcard = getWildcardRoute(routes);

  if (wildcard?.redirectTo) return redirect(wildcard.fullPath, wildcard.redirectTo, routes);

  if (detectCanRenderRoute(wildcard)) return wildcard;

  return null;
}

function matchRoute(url: string, routes: Array<Route>) {
  const forwardRoute = routes.find(x => detectIsMatch(url, normalaizeEnd(x.path), true)) || null;

  if (forwardRoute) return forwardRoute;

  const route = routes.find(x => detectIsMatch(url, x.fullPath)) || null;

  return route;
}

function redirect(from: string, to: string, routes: Array<Route>) {
  const hasRoute = routes.findIndex(x => x.fullPath === to) !== -1;

  if (!hasRoute) {
    throw new Error(
      `[web-router]: Illegal redirect from ${from} to ${to}! A nested route can only redirect to routes at the same hierarchy level.`,
    );
  }

  return match(to, routes);
}

function detectCanRenderRoute(route: Route): boolean {
  return route?.component && !route.redirectTo;
}

function renderRoute(url: string, route: Route): DarkElement {
  return detectCanRenderRoute(route) ? route.matchRender(url) : null;
}

function getWildcardRoute(routes: Array<Route>) {
  const wildcardRoutes = sort(
    'asc',
    routes.filter(x => x.path.indexOf(WILDCARD) !== -1),
    x => x.level,
  );

  if (wildcardRoutes.length > 0) return wildcardRoutes[0];

  return null;
}

function detectIsMatch(url: string, path: string, matchLength = false): boolean {
  const sUrl = splitPath(url);
  const sPath = splitPath(path);

  if (path === SLASH) {
    if (url === SLASH) return true;
    return false;
  }

  if (matchLength && url > path) return false;

  for (let i = 0; i < sPath.length; i++) {
    const isParam = detectIsParam(sPath[i]);

    if (!isParam && sPath[i] !== sUrl[i]) return false;
  }

  return true;
}

function fromPath(url: string, path: string): string {
  const sUrl = splitPath(url);
  const sPath = splitPath(path);
  const parts: Array<string> = [];

  for (let i = 0; i < sPath.length; i++) {
    const isParam = detectIsParam(sPath[i]);

    parts.push(sUrl[i] || (isParam ? 'null' : sPath[i]));
  }

  const newURL = SLASH + normalaizeEnd(parts.join(SLASH));

  return newURL;
}

function createPath(pathMatch: PathMatchStrategy, prefix: string, path: string): string {
  const prefix$ = pathMatch === 'prefix' ? normalaizeEnd(prefix) : '';

  return normalaizeEnd(prefix$ ? `${prefix$}${path}` : path);
}

function renderRoot(url: string, routes: Array<Route>) {
  const matched = match(url, routes);
  const rendered = renderRoute(url, matched);
  const paramsMap = matched ? getParamsMap(url, matched.cursor) : null;
  const value = {
    url,
    matched,
    rendered,
    paramsMap,
  };

  return value;
}

export { type Route, createRoutes, match, renderRoot, detectIsMatch, fromPath };
