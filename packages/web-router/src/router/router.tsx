import {
  type DarkElement,
  h,
  createComponent,
  useMemo,
  detectIsServer,
  useEffect,
  useLayoutEffect,
  useState,
} from '@dark-engine/core';

import { SLASH } from '../constants';
import { createPathname, normalaizeEnd } from '../utils';
import { createRouterHistory } from '../history';
import { type Routes, createRoutes, renderRoot, pathnameFromPath } from '../create-routes';
import {
  type RouterHistoryContextValue,
  type ActiveRouteContextValue,
  RouterHistoryContext,
  ActiveRouteContext,
  useActiveRouteContext,
} from '../context';

export type RouterProps = {
  url?: string; // for server-side rendering
  baseURL?: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ url, baseURL = SLASH, routes: sourceRoutes, slot }) => {
  if (useActiveRouteContext()) {
    throw new Error('[web-router]: Parent active route context detected!');
  }
  const isServer = detectIsServer();
  const [pathname, setPathname] = useState(() => createPathname(url, isServer));
  const routes = useMemo(() => createRoutes(sourceRoutes, normalaizeEnd(baseURL)), []);
  const history = useMemo(() => createRouterHistory(pathname), []);
  const { matched, paramsMap, rendered } = renderRoot(pathname, routes);
  const scope = useMemo(() => ({ pathname }), []);
  const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
  const routerContext = useMemo<ActiveRouteContextValue>(() => ({ pathname, matched, paramsMap }), [pathname]);

  scope.pathname = pathname;

  useLayoutEffect(() => {
    setPathname(createPathname(url, isServer));
  }, [url]);

  useLayoutEffect(() => {
    const unsubscribe = history.subscribe(url => setPathname(url));

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  useEffect(() => {
    if (!matched) return;
    const newPathname = pathnameFromPath(pathname, matched.cursor.fullPath);

    if (pathname !== newPathname) {
      history.replace(newPathname);
    }
  }, [pathname]);

  return (
    <RouterHistoryContext.Provider value={historyContext}>
      <ActiveRouteContext.Provider value={routerContext}>{slot(rendered)}</ActiveRouteContext.Provider>
    </RouterHistoryContext.Provider>
  );
});

export { Router };
