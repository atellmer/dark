import { type DarkElement } from '@dark-engine/core';

import { SLASH, WILDCARD } from '../constants';
import { splitPath, normalaizeEnd, detectIsParam, sort } from '../utils';
import type { Routes, RouteDescriptor, PathMatchStrategy } from './types';

type RouteConstructorOptions = {
  prefix: string;
  path: string;
  redirectTo?: string;
  pathMatch?: PathMatchStrategy;
  children?: Array<RouteDescriptor>;
  parent: Route;
  render?: (slot?: DarkElement) => DarkElement;
};

class Route {
  public path = '';
  public fullPath = '';
  public pathMatch?: PathMatchStrategy;
  public redirectTo?: string;
  public parent: Route = null;
  public children: Array<Route> = [];
  public cursor: Route = null;
  public level: number = null;
  public render?: (slot?: DarkElement) => DarkElement;
  private static param: string;

  constructor(options: RouteConstructorOptions) {
    const { prefix, path, redirectTo, pathMatch = 'prefix', children = [], parent, render } = options;
    const fullPath = createPath(pathMatch, prefix, path);

    this.level = parent ? parent.level + 1 : 0;
    this.cursor = this;
    this.path = path;
    this.pathMatch = pathMatch;
    this.parent = parent;
    this.fullPath = fullPath;
    this.children = createRoutes(children, fullPath, this);

    if (render) {
      this.render = render;
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

  public matchRender(path: string): DarkElement {
    const matched = match(path, this.children);

    this.setCursor(matched);
    Route.setParam(getParam(path, this));

    const rendered = renderRoute(path, matched);

    return this.render(rendered);
  }

  public static getParam(): string {
    return Route.param;
  }

  public static setParam(param: string) {
    Route.param = param;
  }
}

const getParam = (url: string, route: Route): string => {
  const path = route.fullPath;
  const prefix = route.parent?.fullPath || '';
  const splittedUrl = splitPath(url);
  const splittedPath = splitPath(path);
  const prevParamsCount = splitPath(prefix).filter(x => detectIsParam(x)).length;
  const params: Array<string> = [];

  for (let i = 0; i < splittedPath.length; i++) {
    if (detectIsParam(splittedPath[i])) {
      params.push(splittedUrl[i]);
    }
  }

  const [param = null] = params.splice(prevParamsCount, 1);

  return param;
};

function createRoutes(routes: Routes, prefix = SLASH, parent: Route = null): Array<Route> {
  const routes$: Array<Route> = [];

  for (const route of routes) {
    const route$ = new Route({ ...route, prefix, parent });

    routes$.push(route$, ...route$.children);
  }

  return routes$;
}

function match(path: string, routes: Array<Route>): Route {
  const route = matchRoute(path, routes);

  if (route?.redirectTo) return redirect(route.fullPath, route.redirectTo, routes);

  if (detectCanRenderRoute(route)) return route;

  const wildcard = getWildcardRoute(routes);

  if (wildcard?.redirectTo) return redirect(wildcard.fullPath, wildcard.redirectTo, routes);

  if (detectCanRenderRoute(wildcard)) return wildcard;

  return null;
}

function matchRoute(path: string, routes: Array<Route>) {
  const forwardRoute = routes.find(x => detectIsMatch(path, normalaizeEnd(x.path), true)) || null;

  if (forwardRoute) return forwardRoute;

  const route = routes.find(x => detectIsMatch(path, x.fullPath)) || null;

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
  return route?.render && !route.redirectTo;
}

function renderRoute(path: string, route: Route): DarkElement {
  return detectCanRenderRoute(route) ? route.matchRender(path) : null;
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
  const splittedUrl = splitPath(url);
  const splittedPath = splitPath(path);

  if (path === SLASH) {
    if (url === SLASH) return true;
    return false;
  }

  if (matchLength && url > path) return false;

  for (let i = 0; i < splittedPath.length; i++) {
    const isParam = detectIsParam(splittedPath[i]);

    if (!isParam && splittedPath[i] !== splittedUrl[i]) return false;
  }

  return true;
}

function createPath(pathMatch: PathMatchStrategy, prefix: string, path: string): string {
  const prefix$ = pathMatch === 'prefix' ? normalaizeEnd(prefix) : '';

  return normalaizeEnd(prefix$ ? `${prefix$}${path}` : path);
}

function renderRoot(path: string, routes: Array<Route>): [Route, DarkElement] {
  const matched = match(path, routes);
  const rendered = renderRoute(path, matched);

  // console.log('path', path);
  // console.log('routes', routes);
  // console.log('matched', matched);

  return [matched, rendered];
}

export { createRoutes, match, renderRoot };
