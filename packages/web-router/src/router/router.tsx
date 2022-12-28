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

const Router = createComponent<RouterProps>(({ pathname: sourceURL, routes: sourceRoutes, slot }) => {
  if (useActiveRouteContext()) {
    throw new Error('[web-router]: Parent active route context detected!');
  }
  const isServer = detectIsServer();
  const [url, setURL] = useState(() => createURL(sourceURL, isServer));
  const routes = useMemo(() => createRoutes(sourceRoutes), []);
  const history = useMemo(() => createRouterHistory(url), []);
  const { matched, paramsMap, rendered } = renderRoot(url, routes);
  const scope = useMemo(() => ({ url }), []);
  const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
  const routerContext = useMemo<ActiveRouteContextValue>(() => ({ url, matched, paramsMap }), [url]);

  scope.url = url;

  useLayoutEffect(() => {
    setURL(createURL(sourceURL, isServer));
  }, [sourceURL]);

  useLayoutEffect(() => {
    const unsubscribe = history.subscribe(url => setURL(url));

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  useEffect(() => {
    if (!matched) return;
    const newURL = fromPath(url, matched.cursor.fullPath);

    if (url !== newURL) {
      history.replace(newURL);
    }
  }, [url]);

  return (
    <RouterHistoryContext.Provider value={historyContext}>
      <ActiveRouteContext.Provider value={routerContext}>{slot(rendered)}</ActiveRouteContext.Provider>
    </RouterHistoryContext.Provider>
  );
});

function createURL(url: string, isServer: boolean) {
  const url$ = normalaizeEnd(isServer ? url : url || location.pathname);

  return url$;
}

export { Router };
