import { type DarkElement, type ComponentFactory, type SlotProps, keyBy, detectIsString } from '@dark-engine/core';

import { pipe, splitBySlash, normalizePath, trimSlashes, detectIsParam, getParamName, sort } from '../utils';
import { SLASH_MARK, WILDCARD_MARK, ROOT_MARK } from '../constants';
import { CurrentPathContext } from '../context';
import type { Routes, RouteDescriptor, PathMatchStrategy, Params } from './types';

type RouteConstructorOptions = {
  prefix: string;
  parent: Route;
} & RouteDescriptor;

class Route {
  path = '';
  pathMatch?: PathMatchStrategy;
  parent: Route = null;
  children: Array<Route> = [];
  level: number = null;
  marker = '';
  redirectTo: {
    path: string;
    route: Route;
  };
  component: RouteConstructorOptions['component'] | null;

  constructor(options: RouteConstructorOptions) {
    const { prefix, path, redirectTo, pathMatch = 'prefix', children = [], parent, component } = options;
    const rootPath = createRootPath(path);
    const prefixedPath = createPrefixedPath(pathMatch, prefix, rootPath);

    this.path = prefixedPath;
    this.pathMatch = pathMatch;
    this.parent = parent;
    this.children = createRoutes(children, prefixedPath, this);
    this.level = parent ? parent.level + 1 : 0;
    this.marker = rootPath;
    this.redirectTo = detectIsString(redirectTo)
      ? {
          path: createPrefixedPath(pathMatch, prefix, createRootPath(redirectTo)),
          route: null,
        }
      : null;
    this.component = component || null;
  }

  private getRoute(): Route {
    return this;
  }

  getPath() {
    return this.path.replaceAll(new RegExp(`${ROOT_MARK}${SLASH_MARK}?`, 'g'), '');
  }

  render(): DarkElement {
    let slot = null;
    let nextRoute = this.getRoute();

    while (nextRoute) {
      const value = nextRoute.getPath();
      const component = nextRoute.component as ComponentFactory<SlotProps>;

      slot = CurrentPathContext.Provider({ value, slot: [component({ slot })] });
      nextRoute = nextRoute.parent;
    }

    return slot;
  }
}

function createRoutes(routes: Routes, prefix = SLASH_MARK, parent: Route = null): Array<Route> {
  const $routes: Array<Route> = [];

  for (const route of routes) {
    const $route = new Route({ ...route, prefix, parent });

    $routes.push($route, ...$route.children);
  }

  if (!parent) {
    const map = keyBy($routes, x => x.path, true) as Record<string, Route>;

    for (const $route of $routes) {
      if ($route.redirectTo) {
        $route.redirectTo.route = map[$route.redirectTo.path] || null;
      }
    }
  }

  return $routes;
}

function resolve(path: string, routes: Array<Route>): Route {
  const route = pipe<Route>(
    match(path, routes),
    redirect(),
    wildcard(path, routes),
    redirect(),
    root(),
    redirect(),
    canRender(),
  )();

  return route;
}

function match(path: string, routes: Array<Route>) {
  return (): Route => {
    const [route] = pipe<Array<Route>>(
      (routes: Array<Route>) => routes.filter(x => detectIsMatchByFirstStrategy(path, x.path)),
      (routes: Array<Route>) => routes.filter(x => detectIsMatchBySecondStrategy(path, x.path)),
    )(routes);

    return pick(route);
  };
}

function redirect() {
  return (route: Route): Route => {
    if (route?.redirectTo) return redirect()(route.redirectTo.route);
    if (route?.parent?.redirectTo) return redirect()(route.parent.redirectTo.route);

    return pick(route);
  };
}

function wildcard(path: string, routes: Array<Route>) {
  return ($route: Route): Route => {
    if ($route) return $route;
    const [route] = pipe<Array<Route>>(
      (routes: Array<Route>) => routes.filter(x => x.marker === WILDCARD_MARK),
      (routes: Array<Route>) => routes.filter(x => detectIsMatchAsWildcard(path, x.path)) || null,
      (routes: Array<Route>) => sort('desc', routes, x => x.level),
    )(routes);

    return pick(route);
  };
}

function root() {
  return (route: Route): Route => {
    const root = route?.children.find(x => x.marker === ROOT_MARK) || route;

    return pick(root);
  };
}

function canRender() {
  return (route: Route): Route => {
    if (route?.component) return route;

    if (process.env.NODE_ENV !== 'test') {
      throw new Error('[web-router]: the route was not found or it has no component!');
    }

    return null;
  };
}

const pick = (route: Route): Route | null => route || null;

function detectIsMatchByFirstStrategy(urlPath: string, routePath: string): boolean {
  const matcher = createMatcher({
    space: (_, b) => b,
    skip: ({ isRoot, isParam }) => isRoot || isParam,
  });

  return matcher(urlPath, routePath);
}

function detectIsMatchBySecondStrategy(urlPath: string, routePath: string): boolean {
  const matcher = createMatcher({
    space: a => a,
    skip: ({ isParam }) => isParam,
  });

  return matcher(urlPath, routePath);
}

function detectIsMatchAsWildcard(urlPath: string, routePath: string): boolean {
  const matcher = createMatcher({
    space: (_, b) => b,
    skip: ({ isRoot, isParam, isWildcard }) => isRoot || isParam || isWildcard,
  });

  return matcher(urlPath, routePath);
}

type CreateMatcherOptions = {
  space: (a: Array<string>, b: Array<string>) => Array<string>;
  skip: (options: SkipOptions) => boolean;
};

type SkipOptions = {
  isRoot: boolean;
  isWildcard: boolean;
  isParam: boolean;
};

function createMatcher(options: CreateMatcherOptions) {
  const { space, skip } = options;
  return (urlPath: string, routePath: string) => {
    const sUrlPath = splitBySlash(urlPath);
    const sRoutePath = splitBySlash(routePath);

    for (let i = 0; i < space(sUrlPath, sRoutePath).length; i++) {
      const segment = sRoutePath[i];
      const isRoot = segment === ROOT_MARK;
      const isWildcard = segment === WILDCARD_MARK;
      const isParam = detectIsParam(segment);

      if (segment !== sUrlPath[i] && !skip({ isRoot, isWildcard, isParam })) return false;
    }

    return true;
  };
}

function mergePathes(urlPath: string, routePath: string) {
  const sUrl = splitBySlash(urlPath);
  const sRoute = splitBySlash(routePath);
  const parts: Array<string> = [];

  for (let i = 0; i < sRoute.length; i++) {
    const isParam = detectIsParam(sRoute[i]);

    if (isParam) {
      const param = sUrl[i] || 'null';

      parts.push(param);
    } else {
      parts.push(sRoute[i]);
    }
  }

  let path = normalizePath(parts.join(SLASH_MARK));

  if (path[0] !== SLASH_MARK) {
    path = SLASH_MARK + path;
  }

  return path;
}

const createRootPath = (path: string) => (path === SLASH_MARK || path === '' ? ROOT_MARK : path);

function createPrefixedPath(pathMatch: PathMatchStrategy, prefix: string, path: string) {
  const $prefix = pathMatch === 'prefix' ? normalizePath(prefix) + SLASH_MARK : '';

  return trimSlashes(normalizePath($prefix ? `${$prefix}${path}` : path));
}

function getParamsMap(path: string, route: Route): Params {
  const sPathname = splitBySlash(path);
  const sPath = splitBySlash(route.path);
  const map = new Map();

  for (let i = 0; i < sPath.length; i++) {
    if (detectIsParam(sPath[i])) {
      map.set(getParamName(sPath[i]), sPathname[i]);
    }
  }

  return map;
}

function resolveRoute(path: string, routes: Array<Route>) {
  const activeRoute = resolve(path, routes);
  const slot = activeRoute ? activeRoute.render() : null;
  const params = activeRoute ? getParamsMap(path, activeRoute) : null;
  const value = { activeRoute, slot, params };

  return value;
}

export { type Route, createRoutes, resolve, resolveRoute, mergePathes };
