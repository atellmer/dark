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
  const fullRoutes: FullRoutes = [];

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

    fullRoutes.push(fullRoute);
    fullRoutes.push(...childRoutes);
  }

  for (const route of fullRoutes) {
    route.matchRender = (path: string) => {
      const childRoutes = route.children || [];
      const matched = match(path, childRoutes, fullRoutes);
      const rendered = matched ? renderRoute(matched.fullPath, matched) : null;

      return route.render(rendered);
    };
  }

  return fullRoutes;
}

function match(currentPath: string, routes: FullRoutes, space: FullRoutes = routes): FullRoute {
  const fullRoute = routes.find(x => detectIsMatch(currentPath, x.fullPath));

  return performRoute(currentPath, fullRoute, routes, space);
}

function performRoute(path: string, route: FullRoute, routes: FullRoutes, space: FullRoutes = routes): FullRoute {
  return detectCanRenderRoute(route) ? route : checkRedirects(path, space);
}

function gettRedirectTarget(path: string, fullRoutes: FullRoutes): FullRoute {
  const [redirect] = fullRoutes.filter(x => x.redirectTo && x.fullPath === path);

  return redirect ? fullRoutes.find(x => x.fullPath === redirect.redirectTo) || null : null;
}

function checkRedirects(path: string, space: FullRoutes): FullRoute {
  const target = gettRedirectTarget(path, space);

  return target ? performRoute(target.fullPath, target, space) : null;
}

function renderRoute(path: string, fullRoute: FullRoute): DarkElement {
  return detectCanRenderRoute(fullRoute) ? fullRoute.matchRender(path) : null;
}

function detectCanRenderRoute(route: FullRoute) {
  return route?.render && !route.redirectTo;
}

export { Router };
