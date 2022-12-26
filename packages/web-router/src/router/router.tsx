import { type DarkElement, h, createComponent, useMemo } from '@dark-engine/core';

import { type RouterContextValue, RouterContext } from '../context';
import type { Routes, FullRoute, FullRoutes } from './types';

type RouterProps = {
  currentPath: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ currentPath, routes, slot }) => {
  const fullRoutes = useMemo(() => createFullRoutes(routes), []);
  const context = useMemo<RouterContextValue>(() => ({}), []);
  const content = fullRoutes[1].matchRender(currentPath);

  console.log('fullRoutes', fullRoutes);

  return <RouterContext.Provider value={context}>{slot(content)}</RouterContext.Provider>;
});

function createFullRoutes(routes: Routes, prefix = '/', parent: FullRoute = null): FullRoutes {
  const fullRoutes: FullRoutes = [];

  for (const route of routes) {
    const isFullPathMatch = route.pathMatch === 'full';
    const fullPath = isFullPathMatch ? route.path : `${prefix}${route.path}/`;
    const children = route.children || [];
    const fullRoute: FullRoute = {
      ...route,
      fullPath,
      parent,
      matchRender: null,
    };
    const childRoutes = createFullRoutes(children, fullPath, fullRoute);
    const firstLevelChildRoutes = childRoutes.filter(x => x.parent === fullRoute);

    fullRoute.matchRender = (currentPath: string) => {
      const slot = firstLevelChildRoutes.map(x => x.matchRender(currentPath)).filter(Boolean);
      const isMath = match(currentPath, fullRoute.fullPath);

      return isMath ? route.render(slot) : null;
    };

    fullRoutes.push(fullRoute);
    fullRoutes.push(...childRoutes);
  }

  return fullRoutes;
}

function match(currentPath: string, fullPath: string) {
  return (currentPath + '/').indexOf(fullPath) !== -1;
}

export { Router };
