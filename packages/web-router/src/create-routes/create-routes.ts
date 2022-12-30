import { type DarkElement, type Component, type SlotProps, keyBy, detectIsString } from '@dark-engine/core';

import { SLASH, WILDCARD, ROOT } from '../constants';
import { pipe, splitPath, normalaizePathname, detectIsParam, getParamName, sort } from '../utils';
import { CurrentPathContext } from '../context';
import type { Routes, RouteDescriptor, PathMatchStrategy, Params } from './types';

type RouteConstructorOptions = {
  prefix: string;
  parent: Route;
} & RouteDescriptor;

class Route {
  public path = '';
  public pathMatch?: PathMatchStrategy;
  public parent: Route = null;
  public children: Array<Route> = [];
  public level: number = null;
  public marker = '';
  public redirectTo: {
    path: string;
    route: Route;
  };
  public component: RouteConstructorOptions['component'] | null;

  constructor(options: RouteConstructorOptions) {
    const { prefix, path, redirectTo, pathMatch = 'prefix', children = [], parent, component } = options;
    const rootPath = createRootPath(path);
    const path$ = createPath(pathMatch, prefix, rootPath);

    this.path = path$;
    this.pathMatch = pathMatch;
    this.parent = parent;
    this.children = createRoutes(children, path$, this);
    this.level = parent ? parent.level + 1 : 0;
    this.marker = rootPath;
    this.redirectTo = detectIsString(redirectTo)
      ? {
          path: createPath(pathMatch, prefix, createRootPath(redirectTo)),
          route: null,
        }
      : null;
    this.component = component || null;
  }

  private getRoute(): Route {
    return this;
  }

  public getPath() {
    return this.path.replaceAll(ROOT + SLASH, '');
  }

  public render(): DarkElement {
    let slot = null;
    let nextRoute = this.getRoute();

    while (nextRoute) {
      const value = nextRoute.getPath();
      const component = nextRoute.component as Component<SlotProps>;

      slot = CurrentPathContext.Provider({ value, slot: [component({ slot })] });
      nextRoute = nextRoute.parent;
    }

    return slot;
  }
}

function createRoutes(routes: Routes, prefix = SLASH, parent: Route = null): Array<Route> {
  const routes$: Array<Route> = [];

  for (const route of routes) {
    const route$ = new Route({ ...route, prefix, parent });

    routes$.push(route$, ...route$.children);
  }

  if (!parent) {
    const map = keyBy(routes$, x => x.path, true) as Record<string, Route>;

    for (const route$ of routes$) {
      if (route$.redirectTo) {
        route$.redirectTo.route = map[route$.redirectTo.path] || null;
      }
    }
  }

  return routes$;
}

function resolve(pathname: string, routes: Array<Route>): Route {
  const route = pipe<Route>(
    match(pathname, routes),
    redirect(),
    wildcard(pathname, routes),
    redirect(),
    root(),
    redirect(),
    canRender(),
  )();

  return route;
}

function match(pathname: string, routes: Array<Route>) {
  return (): Route => {
    const [route] = pipe<Array<Route>>(
      (routes: Array<Route>) => routes.filter(x => detectIsMatchByFirstStrategy(pathname, x.path)),
      (routes: Array<Route>) => routes.filter(x => detectIsMatchBySecondStrategy(pathname, x.path)),
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

function wildcard(pathname: string, routes: Array<Route>) {
  return (route$: Route): Route => {
    if (route$) return route$;
    const [route] = pipe<Array<Route>>(
      (routes: Array<Route>) => routes.filter(x => x.marker === WILDCARD),
      (routes: Array<Route>) => routes.filter(x => detectIsMatchAsWildcard(pathname, x.path)) || null,
      (routes: Array<Route>) => sort('desc', routes, x => x.level),
    )(routes);

    return pick(route);
  };
}

function root() {
  return (route: Route): Route => {
    const root = route?.children.find(x => x.marker === ROOT) || route;

    return pick(root);
  };
}

function canRender() {
  return (route: Route): Route => {
    if (route?.component) return route;

    if (process.env.NODE_ENV !== 'test') {
      throw new Error('[web-router]: Route not found or it has no component!');
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
    const sUrlPath = splitPath(urlPath);
    const sRoutePath = splitPath(routePath);

    for (let i = 0; i < space(sUrlPath, sRoutePath).length; i++) {
      const segment = sRoutePath[i];
      const isRoot = segment === ROOT;
      const isWildcard = segment === WILDCARD;
      const isParam = detectIsParam(segment);

      if (segment !== sUrlPath[i] && !skip({ isRoot, isWildcard, isParam })) return false;
    }

    return true;
  };
}

function createPathname(urlPath: string, routePath: string): string {
  const sUrlPath = splitPath(urlPath);
  const sRoutePath = splitPath(routePath);
  const parts: Array<string> = [];

  for (let i = 0; i < sRoutePath.length; i++) {
    const isParam = detectIsParam(sRoutePath[i]);

    if (isParam) {
      const param = sUrlPath[i] || 'null';

      parts.push(param);
    } else {
      parts.push(sRoutePath[i]);
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

function createRootPath(path: string): string {
  return path === SLASH || path === '' ? ROOT : path;
}

const getParamsMap = (pathname: string, route: Route): Params => {
  const sPathname = splitPath(pathname);
  const sPath = splitPath(route.path);
  const map = new Map();

  for (let i = 0; i < sPath.length; i++) {
    if (detectIsParam(sPath[i])) {
      map.set(getParamName(sPath[i]), sPathname[i]);
    }
  }

  return map;
};

function resolveRoute(pathname: string, routes: Array<Route>) {
  const activeRoute = resolve(pathname, routes);
  const slot = activeRoute ? activeRoute.render() : null;
  const params = activeRoute ? getParamsMap(pathname, activeRoute) : null;
  const value = { activeRoute, slot, params };

  return value;
}

export { type Route, createRoutes, resolve, resolveRoute, createPathname };
