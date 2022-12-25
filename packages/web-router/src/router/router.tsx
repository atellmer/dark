import { type DarkElement, h, createComponent, useMemo, useState } from '@dark-engine/core';

import { type RouterContextValue, RouterContext } from '../context';
import { type RoutesMap } from '../create-routes';

type RouterProps = {
  routes: RoutesMap;
  slot: (options: RouterSlotOptions) => DarkElement;
};

type RouterSlotOptions = {
  slot: DarkElement;
};

const Router = createComponent<RouterProps>(({ routes, slot }) => {
  const currentPath = '/home/tabs/settings';
  const [path, setPath] = useState(() => match(currentPath, routes));
  const context = useMemo<RouterContextValue>(() => ({}), []);

  return (
    <RouterContext.Provider value={context}>
      {slot({
        slot: null,
      })}
    </RouterContext.Provider>
  );
});

function match(path: string, routesMap: RoutesMap): string {
  const splittedPath = path.split('/').filter(Boolean);
  const routes = Object.keys(routesMap).map(key => routesMap[key]);
  const fallbackPathes = routes.map(x => x.fallback.path);
  const [fallbackPath] = sort('asc', fallbackPathes, x => x.length);
  let filteredRoutes = routes.filter(x => x.route.split.length <= splittedPath.length);

  for (let i = 0; i < splittedPath.length; i++) {
    filteredRoutes = filteredRoutes.filter(x => !x.route.split[i] || x.route.split[i] === splittedPath[i]);
  }

  const [firstRoute] = sort('desc', filteredRoutes, x => x.route.path.length);
  const matchedPath = firstRoute
    ? firstRoute.route.split.length === splittedPath.length
      ? firstRoute.route.path
      : firstRoute.fallback
      ? firstRoute.fallback.path
      : fallbackPath || ''
    : fallbackPath || '';

  console.log('matchedPath', matchedPath);

  return matchedPath;
}

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

export { Router };
