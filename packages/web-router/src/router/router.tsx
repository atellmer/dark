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
import { type Routes, createRoutes, renderRoot, fromPath } from '../create-routes';
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

const Router = createComponent<RouterProps>(({ pathname: sourcePathname, routes: sourceRoutes, slot }) => {
  if (useActiveRouteContext()) {
    throw new Error('[web-router]: Parent active route context detected!');
  }
  const isServer = detectIsServer();
  const [url, setURL] = useState(() => createURL(sourcePathname, isServer));
  const routes = useMemo(() => createRoutes(sourceRoutes), []);
  const history = useMemo(() => createRouterHistory(url), []);
  const { matched, paramsMap, rendered } = renderRoot(url, routes);
  const scope = useMemo(() => ({ url }), []);
  const historyContextValue = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
  const routerContextValue = useMemo<ActiveRouteContextValue>(() => ({ url, matched, paramsMap }), [url]);

  scope.url = url;

  useLayoutEffect(() => {
    setURL(createURL(sourcePathname, isServer));
  }, [sourcePathname]);

  useEffect(() => {
    const unsubscribe = history.subscribe((url: string) => setURL(url));

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  useEffect(() => {
    if (!matched) return;
    const path = matched.cursor.fullPath;
    const newURL = fromPath(url, path);

    if (url !== newURL) {
      history.replace(newURL);
    }
  }, [url]);

  return (
    <RouterHistoryContext.Provider value={historyContextValue}>
      <ActiveRouteContext.Provider value={routerContextValue}>{slot(rendered)}</ActiveRouteContext.Provider>
    </RouterHistoryContext.Provider>
  );
});

function createURL(pathname: string, isServer: boolean) {
  const url = normalaizeEnd(isServer ? pathname : pathname || location.pathname);

  return url;
}

export { Router };
