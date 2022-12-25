import { type DarkElement, h, createComponent, useMemo, keyBy } from '@dark-engine/core';

import { type RouterContextValue, RouterContext } from '../context';
import { type RoutesMap, type RouteConfig } from '../create-routes';

type RouterProps = {
  routes: RoutesMap;
  slot: (options: RouterSlotOptions) => DarkElement;
};

type RouterSlotOptions = {
  slot: DarkElement;
};

const Router = createComponent<RouterProps>(({ routes, slot }) => {
  const currentPath = '/home/tabs/profile/1/nested/2/';
  const { path, params } = useMemo(() => match(currentPath, routes), [currentPath]);
  const context = useMemo<RouterContextValue>(() => ({}), []);

  return (
    <RouterContext.Provider value={context}>
      {slot({
        slot: null,
      })}
    </RouterContext.Provider>
  );
});

function match(path: string, routesMap: RoutesMap) {
  const splittedPath = path.split('/').filter(Boolean);
  const routes = Object.keys(routesMap).map(key => routesMap[key]);
  const fallbackPath = getNearestFallbackPath(path, routes);
  let filteredRoutes = routes.filter(x => x.route.split.length <= splittedPath.length);

  const params: Array<string> = [];

  for (let i = 0; i < splittedPath.length; i++) {
    filteredRoutes = filteredRoutes.filter(x => {
      const part = splittedPath[i];
      const value = x.route.split[i];
      const isParam = detectIsParam(value);

      if (isParam) {
        params.push(part);
      }

      return !value || isParam || value === part;
    });
  }

  const sortedRoutes = sort('desc', filteredRoutes, x => x.route.fullPath.length);
  const [firstRoute] = sortedRoutes;
  const matched = firstRoute
    ? firstRoute.route.split.length === splittedPath.length
      ? firstRoute.route.fullPath
      : fallbackPath
    : fallbackPath;

  console.log('params', params);
  console.log('matched', matched);

  return { path: matched, params };
}

function getNearestFallbackPath(path: string, routes: Array<RouteConfig>) {
  const fallbacks = sort(
    'desc',
    uniq(routes.map(x => x.fallback).filter(Boolean), x => x.path).filter(x => comparePathes(x.prefix, path)),
    x => x.path.length,
  );
  const fallbackPath = fallbacks[0]?.fullPath || '/';

  return fallbackPath;
}

function comparePathes(a: string, b: string) {
  const splittedA = a.split('/').filter(Boolean);
  const splittedB = b.split('/').filter(Boolean);

  for (let i = 0; i < splittedA.length; i++) {
    if (splittedA[i] !== splittedB[i]) {
      return false;
    }
  }

  return true;
}

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

function uniq<T>(list: Array<T>, selector: (x: T) => string | number) {
  const map: Record<string, boolean> = {};
  const uniq: Array<T> = [];

  for (const item of list) {
    const key = selector(item);

    if (!map[key]) {
      uniq.push(item);
      map[key] = true;
    }
  }

  return uniq;
}

function detectIsParam(value: string) {
  return value && value.startsWith(':');
}

export { Router };
