import {
  type DarkElement,
  type MutableRef,
  h,
  createComponent,
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from '@dark-engine/core';

import { SLASH, PROTOCOL_MARK } from '../constants';
import { normalaizePathname } from '../utils';
import { createRouterHistory } from '../history';
import { type RouterLocation, createRouterLocation } from '../location';
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

export type RouterRef = {
  navigateTo: (pathname: string) => void;
  location: RouterLocation;
};

const Router = forwardRef<RouterProps, RouterRef>(
  createComponent(({ url, baseURL = SLASH, routes: sourceRoutes, slot }, ref) => {
    if (useActiveRouteContext()) {
      throw new Error('[web-router]: Parent active route context detected!');
    }
    const sourceURL = url || window.location.href;
    const [location, setLocation] = useState(() => createRouterLocation(sourceURL));
    const history = useMemo(() => createRouterHistory(sourceURL), []);
    const routes = useMemo(() => createRoutes(sourceRoutes, normalaizePathname(baseURL)), []);
    const { protocol, host, pathname, search } = location;
    const { matched, params, rendered } = renderRoot(pathname, routes);
    const scope = useMemo(() => ({ location }), []);
    const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
    const routerContext = useMemo<ActiveRouteContextValue>(() => ({ location, matched, params }), [pathname, search]);

    scope.location = location;

    useLayoutEffect(() => {
      if (sourceURL !== scope.location.url) {
        setLocation(createRouterLocation(sourceURL));
      }
    }, [sourceURL]);

    useLayoutEffect(() => {
      const unsubscribe = history.subscribe(spathname => {
        const url = `${protocol}${PROTOCOL_MARK}${host}${spathname}`;

        setLocation(createRouterLocation(url));
      });

      return () => {
        unsubscribe();
        history.dispose();
      };
    }, []);

    useEffect(() => {
      if (!matched) return;
      const spathname = pathname + search;
      const newSpathname = pathnameFromPath(pathname, matched.cursor.fullPath) + search;

      if (spathname !== newSpathname) {
        history.replace(newSpathname);
      }
    }, [pathname, search]);

    useImperativeHandle(ref as MutableRef<RouterRef>, () => ({
      navigateTo: (pathname: string) => history.push(pathname),
      location,
    }));

    return (
      <RouterHistoryContext.Provider value={historyContext}>
        <ActiveRouteContext.Provider value={routerContext}>{slot(rendered)}</ActiveRouteContext.Provider>
      </RouterHistoryContext.Provider>
    );
  }),
);

export { Router };
