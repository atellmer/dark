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
  const parentContext = useActiveRouteContext();

  if (parentContext) {
    throw new Error('[web-router]: Parent router context detected!');
  }

  const createPathname = (pathname: string) =>
    normalaizeEnd(detectIsServer() ? pathname : pathname || location.pathname);
  const [pathname, setPathname] = useState(() => createPathname(_pathname));
  const routes = useMemo(() => createRoutes(_routes), []);
  const history = useMemo(() => createRouterHistory(pathname), []);
  const { matched, paramsMap, rendered } = renderRoot(pathname, routes);
  const historyContextValue = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
  const routerContextValue = useMemo<ActiveRouteContextValue>(() => ({ matched, paramsMap }), [pathname]);

  useLayoutEffect(() => {
    setPathname(createPathname(_pathname));
  }, [_pathname]);

  useEffect(() => {
    const unsubscribe = history.subscribe((url: string) => {
      setPathname(url);
    });

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  return (
    <RouterHistoryContext.Provider value={historyContextValue}>
      <ActiveRouteContext.Provider value={routerContextValue}>{slot(rendered)}</ActiveRouteContext.Provider>
    </RouterHistoryContext.Provider>
  );
});

export { Router };
