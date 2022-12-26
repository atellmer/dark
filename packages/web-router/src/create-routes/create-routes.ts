import { type DarkElement } from '@dark-engine/core';

import { detectIsMatch, createPath } from '../utils';
import type { Routes, FullRoute, FullRoutes } from './types';
import { SLASH, WILDCARD } from '../constants';

function createRoutes(routes: Routes, prefix = SLASH, parent: FullRoute = null): FullRoutes {
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
      const childRoutes = route.children || [];
      let path$ = path;
      let rendered = null;

      if (childRoutes.length > 0) {
        if (path === route.fullPath) {
          path$ = childRoutes[0].fullPath;
        }

        const matched = match(path$, childRoutes);

        rendered = renderRoute(path$, matched);
      }

      return route.render(rendered);
    };
  }

  return routes$;
}

function match(path: string, routes: FullRoutes): FullRoute {
  const route = routes.find(x => detectIsMatch(path, x.fullPath)) || null;

  if (route?.redirectTo) return match(route.redirectTo, routes);

  if (detectCanRenderRoute(route)) return route;

  const wildcardRoute = getWildcardRoute(routes);

  if (wildcardRoute?.redirectTo) return match(wildcardRoute.redirectTo, routes);

  if (detectCanRenderRoute(wildcardRoute)) return wildcardRoute;

  return null;
}

function detectCanRenderRoute(route: FullRoute) {
  return route?.render && !route.redirectTo;
}

function renderRoute(path: string, route: FullRoute): DarkElement {
  return detectCanRenderRoute(route) ? route.matchRender(path) : null;
}

function getWildcardRoute(routes: FullRoutes) {
  const wildcardRoutes = routes.filter(x => x.path === WILDCARD);

  if (wildcardRoutes.length === 1) return wildcardRoutes[0];

  const rootWildcard = wildcardRoutes.find(x => x.fullPath === `${SLASH}${WILDCARD}${SLASH}`);

  if (rootWildcard) return rootWildcard;

  return null;
}

export { createRoutes, match, renderRoute };
