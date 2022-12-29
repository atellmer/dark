import { type DarkElement, type Component, type StandardComponentProps, type SlotProps } from '@dark-engine/core';

import { SLASH, WILDCARD } from '../constants';
import { splitPath, normalaizePathname, detectIsParam, getParamName, sort } from '../utils';
import { CurrentPathContext } from '../context';
import type { Routes, RouteDescriptor, PathMatchStrategy, ParamsMap } from './types';

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

  public matchRender(pathname: string): DarkElement {
    const component = this.component as Component<StandardComponentProps & SlotProps>;
    const matched = match(pathname, this.children);

    this.setCursor(matched);

    return CurrentPathContext.Provider({
      value: this.fullPath,
      slot: [component({ slot: renderRoute(pathname, matched) })],
    });
  }
}

const getParamsMap = (pathname: string, route: Route): ParamsMap => {
  const sPathname = splitPath(pathname);
  const sPath = splitPath(route.fullPath);
  const map = new Map();

  for (let i = 0; i < sPath.length; i++) {
    if (detectIsParam(sPath[i])) {
      map.set(getParamName(sPath[i]), sPathname[i]);
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

function match(pathname: string, routes: Array<Route>): Route {
  const route = matchRoute(pathname, routes);

  if (route?.redirectTo) return redirect(route.fullPath, route.redirectTo, routes);

  if (detectCanRenderRoute(route)) return route;

  const wildcard = getWildcardRoute(routes);

  if (wildcard?.redirectTo) return redirect(wildcard.fullPath, wildcard.redirectTo, routes);

  if (detectCanRenderRoute(wildcard)) return wildcard;

  return null;
}

function matchRoute(pathname: string, routes: Array<Route>) {
  const forwardRoute = routes.find(x => detectIsMatch(pathname, normalaizePathname(x.path), true)) || null;

  if (forwardRoute) return forwardRoute;

  const route = routes.find(x => detectIsMatch(pathname, x.fullPath)) || null;

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

function renderRoute(pathname: string, route: Route): DarkElement {
  return detectCanRenderRoute(route) ? route.matchRender(pathname) : null;
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

function detectIsMatch(pathname: string, path: string, matchLength = false): boolean {
  const sPathname = splitPath(pathname);
  const sPath = splitPath(path);

  if (path === SLASH) {
    if (pathname === SLASH) return true;
    return false;
  }

  if (matchLength && pathname > path) return false;

  for (let i = 0; i < sPath.length; i++) {
    const isParam = detectIsParam(sPath[i]);

    if (!isParam && sPath[i] !== sPathname[i]) return false;
  }

  return true;
}

function pathnameFromPath(pathname: string, path: string): string {
  const sPathname = splitPath(pathname);
  const sPath = splitPath(path);
  const parts: Array<string> = [];

  for (let i = 0; i < sPath.length; i++) {
    const isParam = detectIsParam(sPath[i]);

    if (isParam) {
      const param = sPathname[i] || 'null';

      parts.push(param);
    } else {
      parts.push(sPath[i]);
    }
  }

  let newPathname = normalaizePathname(parts.join(SLASH));

  if (newPathname[0] !== SLASH) {
    newPathname = SLASH + newPathname;
  }

  return newPathname;
}

function createPath(pathMatch: PathMatchStrategy, prefix: string, path: string): string {
  const prefix$ = pathMatch === 'prefix' ? normalaizePathname(prefix) : '';

  return normalaizePathname(prefix$ ? `${prefix$}${path}` : path);
}

function renderRoot(pathname: string, routes: Array<Route>) {
  const matched = match(pathname, routes);
  const rendered = renderRoute(pathname, matched);
  const paramsMap = matched ? getParamsMap(pathname, matched.cursor) : null;
  const value = {
    pathname,
    matched,
    rendered,
    paramsMap,
  };

  return value;
}

export { type Route, createRoutes, match, renderRoot, detectIsMatch, pathnameFromPath };
