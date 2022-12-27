import {
  h,
  createComponent,
  useMemo,
  detectIsServer,
  useEffect,
  useLayoutEffect,
  useState,
  type DarkElement,
} from '@dark-engine/core';

import { normalaizeEnd } from '../utils';
import { createRouterHistory } from '../history';
import { type Routes, createRoutes, renderRoot } from '../create-routes';
import {
  type RouterHistoryContextValue,
  type ActiveRouteContextValue,
  RouterHistoryContext,
  ActiveRouteContext,
  useActiveRouteContext,
} from '../context';

export type RouterProps = {
  pathname?: string;
  routes: Routes;
  slot: (slot: DarkElement) => DarkElement;
};

const Router = createComponent<RouterProps>(({ pathname: _pathname, routes: _routes, slot }) => {
  if (useActiveRouteContext()) {
    throw new Error('[web-router]: Parent active route context detected!');
  }

  const createPathname = (pathname: string) =>
    normalaizeEnd(detectIsServer() ? pathname : pathname || location.pathname);
  const [pathname, setPathname] = useState(() => createPathname(_pathname));
  const routes = useMemo(() => createRoutes(_routes), []);
  const history = useMemo(() => createRouterHistory(pathname), []);
  const { matched, paramsMap, rendered } = renderRoot(pathname, routes);
  const scope = useMemo(() => ({ pathname }), []);
  const historyContextValue = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
  const routerContextValue = useMemo<ActiveRouteContextValue>(() => ({ pathname, matched, paramsMap }), [pathname]);

  scope.pathname = pathname;

  useLayoutEffect(() => {
    setPathname(createPathname(_pathname));
  }, [_pathname]);

  useEffect(() => {
    const unsubscribe = history.subscribe((url: string) => setPathname(url));

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  useEffect(() => {
    if (!matched) return;
    const path = matched.cursor.fullPath;

    if (pathname !== path) {
      history.replace(path);
    }
  }, [pathname]);

  return (
    <RouterHistoryContext.Provider value={historyContextValue}>
      <ActiveRouteContext.Provider value={routerContextValue}>{slot(rendered)}</ActiveRouteContext.Provider>
    </RouterHistoryContext.Provider>
  );
});

export { Router };
