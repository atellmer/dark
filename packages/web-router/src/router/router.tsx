import { type DarkElement, h, createComponent, useMemo } from '@dark-engine/core';

import { type RouterContextValue, RouterContext } from '../context';
import { detectIsMatch, createPath, normalaizeEnd } from '../utils';
import type { Routes, FullRoute, FullRoutes } from './types';

type RouterProps = {
  currentPath: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ currentPath, routes, slot }) => {
  const routes$ = useMemo(() => createRoutes(routes), []);
  const context = useMemo<RouterContextValue>(() => ({}), []);
  const currentPath$ = normalaizeEnd(currentPath);
  const matched = match(currentPath$, routes$);
  const rendered = renderRoute(currentPath$, matched);

  console.log('routes$', routes$);
  console.log('matched', matched);

  return <RouterContext.Provider value={context}>{slot(rendered)}</RouterContext.Provider>;
});

function createRoutes(routes: Routes, prefix = '/', parent: FullRoute = null): FullRoutes {
  const routes$: FullRoutes = [];

  for (const route of routes) {
    const { pathMatch = 'prefix' } = route;
    const fullPath = createPath(pathMatch, prefix, route.path);
    const children = route.children || [];
    const fullRoute: FullRoute = {
      ...route,
      fullPath,
      parent,
      children: [],
      matchRender: null,
    };
    const childRoutes = createRoutes(children, fullPath, fullRoute);

    if (parent) {
      parent.children.push(fullRoute);
    }

    if (fullRoute.redirectTo) {
      fullRoute.redirectTo = createPath(pathMatch, prefix, fullRoute.redirectTo);
    }

    routes$.push(fullRoute);
    routes$.push(...childRoutes);
  }

  for (const route of routes$) {
    route.matchRender = (path: string) => {
      if (route.redirectTo || route.parent?.redirectTo) return null;
      const childRoutes = route.children || [];
      const matched = match(path, childRoutes);
      const rendered = renderRoute(path, matched);

      return route.render(rendered);
    };
  }

  return routes$;
}

function match(currentPath: string, routes: FullRoutes): FullRoute {
  const route = routes.find(x => detectIsMatch(currentPath, x.fullPath)) || null;

  if (route?.redirectTo) {
    return match(route.redirectTo, routes);
  }

  return detectCanRenderRoute(route) ? route : null;
}

function detectCanRenderRoute(route: FullRoute) {
  return route?.render && !route.redirectTo;
}

function renderRoute(path: string, fullRoute: FullRoute): DarkElement {
  return detectCanRenderRoute(fullRoute) ? fullRoute.matchRender(path) : null;
}

export { Router };
