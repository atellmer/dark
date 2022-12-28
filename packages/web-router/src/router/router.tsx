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

import { normalaizeEnd } from '../utils';
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
  pathname?: string;
  search?: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ pathname: sourcePathname, routes: sourceRoutes, slot }) => {
  if (useActiveRouteContext()) {
    throw new Error('[web-router]: Parent active route context detected!');
  }
  const isServer = detectIsServer();
  const [pathname, setPathname] = useState(() => createPathname(sourcePathname, isServer));
  const routes = useMemo(() => createRoutes(sourceRoutes), []);
  const history = useMemo(() => createRouterHistory(pathname), []);
  const { matched, paramsMap, rendered } = renderRoot(pathname, routes);
  const scope = useMemo(() => ({ pathname }), []);
  const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
  const routerContext = useMemo<ActiveRouteContextValue>(() => ({ pathname, matched, paramsMap }), [pathname]);

  scope.pathname = pathname;

  useLayoutEffect(() => {
    setPathname(createPathname(sourcePathname, isServer));
  }, [sourcePathname]);

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

function createPathname(sourcePathname: string, isServer: boolean) {
  const pathname = normalaizeEnd(isServer ? sourcePathname : sourcePathname || location.pathname);

  return pathname;
}

export { Router };
