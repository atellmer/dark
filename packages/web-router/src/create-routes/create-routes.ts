import { type DarkElement, type ComponentFactory, type SlotProps, keyBy, detectIsString } from '@dark-engine/core';

import { pipe, splitBySlash, normalizePath, trimSlashes, detectIsParam, getParamName, sort, join } from '../utils';
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
    this.marker = rootPath === '' ? ROOT_MARK : rootPath;
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
    return this.path;
  }

  render(): DarkElement {
    let slot = null;
    let nextRoute = this.getRoute();

    while (nextRoute) {
      const value = nextRoute.getPath();
      const factory = nextRoute.component as ComponentFactory<SlotProps>;
      const component = factory({ slot });

      component.displayName = `Route(${nextRoute.getPath()})`;
      slot = CurrentPathContext.Provider({ value, slot: [component] });
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

function resolve(url: string, routes: Array<Route>): Route | null {
  const $match = match(url, routes);
  const $wildcard = wildcard(url, routes);
  const route = pipe<Route>($match, redirect, $wildcard, redirect, root, redirect, canRender)();

  return route;
}

function match(url: string, routes: Array<Route>) {
  return () => {
    const [route] = routes.filter(x => detectIsMatch(url, x.path));

    return pick(route);
  };
}

function redirect(route: Route) {
  if (route?.redirectTo) return redirect(route.redirectTo.route);
  if (route?.parent?.redirectTo) return redirect(route.parent.redirectTo.route);

  return pick(route);
}

function wildcard(path: string, routes: Array<Route>) {
  return (route: Route) => {
    if (route) return route;
    const [$route] = pipe<Array<Route>>(
      (routes: Array<Route>) => routes.filter(x => x.marker === WILDCARD_MARK),
      (routes: Array<Route>) => routes.filter(x => detectIsMatchAsWildcard(path, x.path)) || null,
      (routes: Array<Route>) => sort('desc', routes, x => x.level),
    )(routes);

    return pick($route);
  };
}

function root(route: Route) {
  const $route = route?.children.find(x => x.marker === ROOT_MARK);

  if ($route?.children.length > 0) return root($route);

  return pick($route || route);
}

function canRender(route: Route) {
  if (route?.component) return route;
  throw new Error('[web-router]: the route was not found or it has no component!');
}

const pick = (route: Route): Route | null => route || null;

function detectIsMatch(url: string, path: string) {
  const matcher = createMatcher({
    space: (a, b) => Math.max(a.length, b.length),
    skip: ({ isParam }) => isParam,
  });

  return matcher(url, path);
}

function detectIsMatchAsWildcard(url: string, path: string) {
  const matcher = createMatcher({
    space: (_, b) => b.length,
    skip: ({ isParam, isWildcard }) => isParam || isWildcard,
  });

  return matcher(url, path);
}

type CreateMatcherOptions = {
  space: (a: Array<string>, b: Array<string>) => number;
  skip: (options: SkipOptions) => boolean;
};

type SkipOptions = {
  isWildcard: boolean;
  isParam: boolean;
};

function createMatcher(options: CreateMatcherOptions) {
  const { space, skip } = options;

  return (url: string, path: string) => {
    const [a, b] = split(url, path);

    for (let i = 0; i < space(a, b); i++) {
      const segment = b[i];
      const isWildcard = segment === WILDCARD_MARK;
      const isParam = detectIsParam(segment);

      if (segment !== a[i] && !skip({ isWildcard, isParam })) return false;
    }

    return true;
  };
}

function mergePaths(url: string, path: string) {
  const [a, b] = split(url, path);
  const parts: Array<string> = [];

  for (let i = 0; i < b.length; i++) {
    const isParam = detectIsParam(b[i]);

    if (isParam) {
      const param = a[i] || 'null';

      parts.push(param);
    } else {
      parts.push(b[i]);
    }
  }

  let $path = normalizePath(parts.join(SLASH_MARK));

  if ($path[0] !== SLASH_MARK) {
    $path = join(SLASH_MARK, $path);
  }

  return $path;
}

function createPrefixedPath(pathMatch: PathMatchStrategy, prefix: string, path: string) {
  const $prefix = pathMatch === 'prefix' ? normalizePath(prefix) + SLASH_MARK : '';

  return trimSlashes(normalizePath($prefix ? `${$prefix}${path}` : path));
}

function getParamsMap(url: string, route: Route): Params {
  const [a, b] = split(url, route.path);
  const map = new Map();

  for (let i = 0; i < b.length; i++) {
    if (detectIsParam(b[i])) {
      map.set(getParamName(b[i]), a[i]);
    }
  }

  return map;
}

type ResolveRouteValue = {
  route: Route;
  slot: DarkElement;
  params: Params;
};

function resolveRoute(url: string, routes: Array<Route>) {
  const route = resolve(url, routes);
  const slot = route.render();
  const params = getParamsMap(url, route);
  const value: ResolveRouteValue = { route, slot, params };

  return value;
}

const createRootPath = (path: string) => (path === SLASH_MARK ? '' : path);

const split = (url: string, path: string) => [splitBySlash(url), splitBySlash(path)];

const merge = (url: string, route: Route, s: string, h: string) => join(mergePaths(url, route.getPath()), s, h);

const detectIsWildcard = (route: Route) => route.marker === WILDCARD_MARK;

export { type Route, createRoutes, resolve, resolveRoute, mergePaths, merge, detectIsWildcard };
