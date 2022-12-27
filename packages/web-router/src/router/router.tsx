import { type DarkElement, h, createComponent, useMemo, detectIsServer } from '@dark-engine/core';

import { type Routes, createRoutes, match, renderRoot } from '../create-routes';
import { type RouterContextValue, RouterContext } from '../context';
import { normalaizeEnd } from '../utils';

type RouterProps = {
  pathname?: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ pathname, routes, slot }) => {
  const routes$ = useMemo(() => createRoutes(routes), []);
  const context = useMemo<RouterContextValue>(() => ({}), []);
  const pathname$ = normalaizeEnd(detectIsServer() ? pathname : pathname || location.pathname);
  const { matched, rendered } = renderRoot(pathname$, routes$);

  return <RouterContext.Provider value={context}>{slot(rendered)}</RouterContext.Provider>;
});

export { Router };
