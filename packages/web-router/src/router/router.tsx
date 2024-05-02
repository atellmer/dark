import {
  type DarkElement,
  type MutableRef,
  component,
  useMemo,
  useLayoutEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  nextTick,
  detectIsString,
  useTransition,
} from '@dark-engine/core';

import { type Routes, createRoutes, resolveRoute, merge, detectIsWildcard } from '../create-routes';
import { type RouterLocation, createRouterLocation } from '../location';
import { SLASH_MARK, PROTOCOL_MARK } from '../constants';
import { normalizePath, join, parseURL } from '../utils';
import { createRouterHistory } from '../history';
import {
  type RouterHistoryContextValue,
  type ActiveRouteContextValue,
  RouterHistoryContext,
  ActiveRouteContext,
  useActiveRouteContext,
} from '../context';

export type RouterProps = {
  routes: Routes;
  url?: string; // for server-side rendering
  baseURL?: string;
  mode?: 'concurrent'; // experimental
  slot: (slot: DarkElement, isPending: boolean) => DarkElement;
};

export type RouterRef = {
  navigateTo: (url: string) => void;
  location: RouterLocation;
};

const Router = forwardRef<RouterProps, RouterRef>(
  component(
    ({ url: fullURL, baseURL = SLASH_MARK, routes: sourceRoutes, mode, slot }, ref) => {
      if (useActiveRouteContext()) throw new Error(`[web-router]: the parent active route's context detected!`);
      const sourceURL = fullURL || window.location.href;
      const [isPending, startTransition] = useTransition();
      const [location, setLocation] = useState(() => createRouterLocation(sourceURL));
      const history = useMemo(() => createRouterHistory(sourceURL), []);
      const routes = useMemo(() => createRoutes(sourceRoutes, normalizePath(baseURL)), []);
      const { protocol, host, pathname: url, search, hash } = location;
      const { route, slot: $slot, params } = useMemo(() => resolveRoute(url, routes), [url]);
      const scope = useMemo(() => ({ location }), []);
      const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
      const routerContext = useMemo<ActiveRouteContextValue>(() => ({ location, route, params }), [location]);
      const isConcurrent = mode === 'concurrent';

      scope.location = location;

      useLayoutEffect(() => {
        if (!detectIsString(fullURL)) return;
        if (sourceURL !== scope.location.url) {
          setLocation(createRouterLocation(sourceURL));
        }
      }, [sourceURL]);

      useLayoutEffect(() => {
        const unsubscribe = history.subscribe(candidateURL => {
          const { pathname: url1, search: search1, hash: hash1 } = scope.location;
          const { pathname: url2, search: search2, hash: hash2 } = parseURL(candidateURL);
          const { route: nextRoute } = resolveRoute(url2, routes);
          const prevURL = join(url1, search1, hash1);
          const nextURL = merge(url2, nextRoute, search2, hash2);
          const isDifferent = candidateURL !== nextURL;

          if (isDifferent || prevURL !== nextURL) {
            const href = join(protocol, PROTOCOL_MARK, host, nextURL);
            const location = createRouterLocation(href);

            isConcurrent ? startTransition(() => setLocation(location)) : setLocation(location);
            isDifferent && !detectIsWildcard(nextRoute) && history.replace(nextURL);
          }
        });

        return () => {
          unsubscribe();
          history.dispose();
        };
      }, []);

      // !
      useLayoutEffect(() => {
        if (detectIsWildcard(route)) return;
        const prevURL = join(url, search, hash);
        const nextURL = merge(url, route, search, hash);

        if (prevURL !== nextURL) {
          history.replace(nextURL);
        }
      }, []);

      useImperativeHandle(ref as MutableRef<RouterRef>, () => ({
        navigateTo: (url: string) => nextTick(() => history.push(url)),
        location,
      }));

      return (
        <RouterHistoryContext.Provider value={historyContext}>
          <ActiveRouteContext.Provider value={routerContext}>{slot($slot, isPending)}</ActiveRouteContext.Provider>
        </RouterHistoryContext.Provider>
      );
    },
    { displayName: 'Router' },
  ),
);

export { Router };
