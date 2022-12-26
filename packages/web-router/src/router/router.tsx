import { type DarkElement, h, createComponent, useMemo } from '@dark-engine/core';

import { type Routes, createRoutes, match, renderRoot } from '../create-routes';
import { type RouterContextValue, RouterContext } from '../context';
import { normalaizeEnd } from '../utils';

type RouterProps = {
  currentPath: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ currentPath, routes, slot }) => {
  const routes$ = useMemo(() => createRoutes(routes), []);
  const context = useMemo<RouterContextValue>(() => ({}), []);
  const currentPath$ = normalaizeEnd(currentPath);
  const [matched, rendered] = renderRoot(currentPath$, routes$);

  return <RouterContext.Provider value={context}>{slot(rendered)}</RouterContext.Provider>;
});

export { Router };
