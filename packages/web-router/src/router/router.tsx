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
} from '@dark-engine/core';

import { SLASH_MARK, PROTOCOL_MARK, WILDCARD_MARK } from '../constants';
import { normalizePath, join, parseURL } from '../utils';
import { createRouterHistory } from '../history';
import { type RouterLocation, createRouterLocation } from '../location';
import { type Routes, type Route, createRoutes, resolveRoute, mergePaths } from '../create-routes';
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
  slot: (slot: DarkElement) => DarkElement;
};

export type RouterRef = {
  navigateTo: (url: string) => void;
  location: RouterLocation;
};

const Router = forwardRef<RouterProps, RouterRef>(
  component(
    ({ url: fullURL, baseURL = SLASH_MARK, routes: sourceRoutes, slot }, ref) => {
      if (useActiveRouteContext()) throw new Error(`[web-router]: the parent active route's context detected!`);
      const sourceURL = fullURL || window.location.href;
      const [location, setLocation] = useState(() => createRouterLocation(sourceURL));
      const history = useMemo(() => createRouterHistory(sourceURL), []);
      const routes = useMemo(() => createRoutes(sourceRoutes, normalizePath(baseURL)), []);
      const { protocol, host, pathname: url, search, hash } = location;
      const { activeRoute, slot: $slot, params } = useMemo(() => resolveRoute(url, routes), [url]);
      const scope = useMemo(() => ({ location, fromOwnEffect: false }), []);
      const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
      const routerContext = useMemo<ActiveRouteContextValue>(() => ({ location, activeRoute, params }), [location]);

      scope.location = location;

      useLayoutEffect(() => {
        if (!detectIsString(fullURL)) return;
        if (sourceURL !== scope.location.url) {
          setLocation(createRouterLocation(sourceURL));
        }
      }, [sourceURL]);

      useLayoutEffect(() => {
        const unsubscribe = history.subscribe(url => {
          const { pathname: url1, search: search1, hash: hash1 } = scope.location;
          const { pathname: url2, search: search2, hash: hash2 } = parseURL(url);
          const { activeRoute } = resolveRoute(url2, routes);
          const prevURL = join(url1, search1, hash1);
          const nextURL = merge(url2, activeRoute, search2, hash2);

          if (url !== nextURL || prevURL !== nextURL) {
            const href = join(protocol, PROTOCOL_MARK, host, nextURL);

            setLocation(createRouterLocation(href));
            !scope.fromOwnEffect && activeRoute.marker !== WILDCARD_MARK && history.replace(nextURL);
          }

          scope.fromOwnEffect = false;
        });

        return () => {
          unsubscribe();
          history.dispose();
        };
      }, []);

      // !
      useLayoutEffect(() => {
        if (activeRoute.marker === WILDCARD_MARK) return;
        const prevURL = join(url, search, hash);
        const nextURL = merge(url, activeRoute, search, hash);

        if (prevURL !== nextURL) {
          scope.fromOwnEffect = true;
          history.replace(nextURL);
        }
      }, []);

      useImperativeHandle(ref as MutableRef<RouterRef>, () => ({
        navigateTo: (url: string) => nextTick(() => history.push(url)),
        location,
      }));

      return (
        <RouterHistoryContext.Provider value={historyContext}>
          <ActiveRouteContext.Provider value={routerContext}>{slot($slot)}</ActiveRouteContext.Provider>
        </RouterHistoryContext.Provider>
      );
    },
    { displayName: 'Router' },
  ),
);

const merge = (url: string, route: Route, s: string, h: string) => join(mergePaths(url, route.getPath()), s, h);

export { Router };
