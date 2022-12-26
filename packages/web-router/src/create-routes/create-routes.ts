import { type DarkElement } from '@dark-engine/core';

import { SLASH, WILDCARD } from '../constants';
import { splitPath, normalaizeEnd, detectIsParam } from '../utils';
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
  public render?: (slot?: DarkElement) => DarkElement;
  public static param: string;

  constructor(options: RouteConstructorOptions) {
    const { prefix, path, redirectTo, pathMatch = 'prefix', children = [], parent, render } = options;
    const fullPath = createPath(pathMatch, prefix, path);

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
    this.cursor = cursor;

    if (this.parent) {
      this.parent.setCursor(cursor);
    }
  }

  public matchRender(path: string): DarkElement {
    const childRoutes = this.children || [];
    let path$ = path;
    let rendered = null;

    Route.param = getParam(path, this);

    console.log('param', Route.param);
    console.log('render', this);

    if (childRoutes.length > 0) {
      if (path === this.fullPath) {
        path$ = childRoutes[0].fullPath;
      }

      const matched = match(path$, childRoutes);
      const cursor = matched || this.cursor;

      this.setCursor(cursor);
      rendered = renderRoute(path$, matched);
    }

    return this.render(rendered);
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
    const fullRoute = new Route({ ...route, prefix, parent });

    routes$.push(fullRoute, ...fullRoute.children);
  }

  return routes$;
}

function match(path: string, routes: Array<Route>): Route {
  const route = routes.find(x => detectIsMatch(path, x.fullPath)) || null;

  if (route?.redirectTo) return match(route.redirectTo, routes);

  if (detectCanRenderRoute(route)) return route;

  const wildcardRoute = getWildcardRoute(routes);

  if (wildcardRoute?.redirectTo) return match(wildcardRoute.redirectTo, routes);

  if (detectCanRenderRoute(wildcardRoute)) return wildcardRoute;

  return null;
}

function detectCanRenderRoute(route: Route): boolean {
  return route?.render && !route.redirectTo;
}

function renderRoute(path: string, route: Route): DarkElement {
  return detectCanRenderRoute(route) ? route.matchRender(path) : null;
}

function getWildcardRoute(routes: Array<Route>) {
  const wildcardRoutes = routes.filter(x => x.path === WILDCARD);

  if (wildcardRoutes.length === 1) return wildcardRoutes[0];

  const rootWildcard = wildcardRoutes.find(x => x.fullPath === `${SLASH}${WILDCARD}${SLASH}`);

  if (rootWildcard) return rootWildcard;

  return null;
}

function detectIsMatch(currentPath: string, fullPath: string): boolean {
  const splittedA = splitPath(fullPath);
  const splittedB = splitPath(currentPath);

  if (fullPath === SLASH) {
    if (currentPath === SLASH) return true;
    return false;
  }

  for (let i = 0; i < splittedA.length; i++) {
    const isParam = detectIsParam(splittedA[i]);

    if (!isParam && splittedA[i] !== splittedB[i]) return false;
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

  console.log('path', path);
  // console.log('routes', routes);
  // console.log('matched', matched);

  return [matched, rendered];
}

export { createRoutes, match, renderRoot };
