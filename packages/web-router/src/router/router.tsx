import {
  type DarkElement,
  type MutableRef,
  component,
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  nextTick,
} from '@dark-engine/core';

import { SLASH_MARK, PROTOCOL_MARK, WILDCARD_MARK } from '../constants';
import { normalizePath, join } from '../utils';
import { createRouterHistory } from '../history';
import { type RouterLocation, createRouterLocation } from '../location';
import { type Routes, createRoutes, resolveRoute, mergePathes } from '../create-routes';
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
    ({ url, baseURL = SLASH_MARK, routes: sourceRoutes, slot }, ref) => {
      if (useActiveRouteContext()) throw new Error(`[web-router]: the parent active route's context detected!`);
      const sourceURL = url || window.location.href;
      const [location, setLocation] = useState(() => createRouterLocation(sourceURL));
      const history = useMemo(() => createRouterHistory(sourceURL), []);
      const routes = useMemo(() => createRoutes(sourceRoutes, normalizePath(baseURL)), []);
      const { protocol, host, pathname: path, search, hash } = location;
      const { activeRoute, slot: $slot, params } = resolveRoute(path, routes);
      const scope = useMemo(() => ({ location }), []);
      const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
      const routerContext = useMemo<ActiveRouteContextValue>(
        () => ({ location, activeRoute, params }),
        [path, search, hash],
      );

      scope.location = location;

      useLayoutEffect(() => {
        if (sourceURL !== scope.location.url) {
          setLocation(createRouterLocation(sourceURL));
        }
      }, [sourceURL]);

      useLayoutEffect(() => {
        const unsubscribe = history.subscribe(url => {
          const href = join(protocol, PROTOCOL_MARK, host, url);

          setLocation(createRouterLocation(href));
        });

        return () => {
          unsubscribe();
          history.dispose();
        };
      }, []);

      useEffect(() => {
        if (!activeRoute || activeRoute.marker === WILDCARD_MARK) return;
        const url = join(path, search, hash);
        const $url = join(mergePathes(path, activeRoute.getPath()), search, hash);

        if (url !== $url) {
          history.replace($url);
        }
      }, [path, search, hash]);

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

export { Router };
