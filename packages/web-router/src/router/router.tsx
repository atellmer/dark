import {
  type DarkElement,
  type Ref,
  atom,
  component,
  useMemo,
  useLayoutEffect,
  useState,
  useImperativeHandle,
  nextTick,
  detectIsString,
  startTransition,
  $$scope,
} from '@dark-engine/core';

import { type Routes, createRoutes, resolveRoute, merge, detectIsWildcard } from '../create-routes';
import { type RouterLocation, createRouterLocation } from '../location';
import { normalizePath, join, parseURL, illegal } from '../utils';
import { SLASH_MARK, PROTOCOL_MARK } from '../constants';
import { createRouterHistory } from '../history';
import {
  type RouterHistoryContextValue,
  type ActiveRouteContextValue,
  RouterHistoryContext,
  ActiveRouteContext,
  useActiveRouteContext,
  PendingContext,
} from '../context';

export type RouterProps = {
  ref?: Ref<RouterRef>;
  routes: Routes;
  url?: string; // for server-side rendering
  baseURL?: string;
  mode?: 'concurrent'; // experimental
  slot: (slot: DarkElement) => DarkElement;
};

export type RouterRef = {
  navigateTo: (url: string) => void;
  location: RouterLocation;
};

const Router = component<RouterProps>(
  ({ ref, url: fullURL, baseURL = SLASH_MARK, routes: sourceRoutes, mode, slot }) => {
    if (useActiveRouteContext()) illegal(`The parent active route's context detected!`);
    const sourceURL = fullURL || window.location.href;
    const $scope = $$scope();
    const [location, setLocation] = useState(() => createRouterLocation(sourceURL));
    const history = useMemo(() => createRouterHistory(sourceURL), []);
    const routes = useMemo(() => createRoutes(sourceRoutes, normalizePath(baseURL)), []);
    const { protocol, host, pathname: url, search, hash } = location;
    const { route, slot: content, params } = useMemo(() => resolveRoute(url, routes), [url]);
    const scope = useMemo(() => ({ location, pending$: atom(false) }), []);
    const historyContext = useMemo<RouterHistoryContextValue>(() => ({ history }), []);
    const routerContext = useMemo<ActiveRouteContextValue>(() => ({ location, route, params }), [location]);
    const isConcurrent = mode === 'concurrent';
    const { pending$ } = scope;

    const set = (location: RouterLocation) => {
      if (isConcurrent) {
        startTransition(() => pending$.set(true));
        $scope.setOnTransitionEnd(() => {
          if (scope.location === location) {
            startTransition(() => pending$.set(false));
          }
        });
        startTransition(() => setLocation(location));
        $scope.setOnTransitionEnd(null);
      } else {
        setLocation(location);
      }
    };

    useLayoutEffect(() => {
      if (!detectIsString(fullURL)) return;
      if (sourceURL !== scope.location.url) {
        const location = createRouterLocation(sourceURL);

        scope.location = location; // !
        set(location);
      }
    }, [sourceURL]);

    useLayoutEffect(() => {
      const unsubscribe = history.subscribe('change', candidateURL => {
        const { pathname: url1, search: search1, hash: hash1 } = scope.location;
        const { pathname: url2, search: search2, hash: hash2 } = parseURL(candidateURL);
        const { route: nextRoute } = resolveRoute(url2, routes);
        const prevURL = join(url1, search1, hash1);
        const nextURL = merge(url2, nextRoute, search2, hash2);
        const isDifferent = candidateURL !== nextURL;

        if (isDifferent || prevURL !== nextURL) {
          const href = join(protocol, PROTOCOL_MARK, host, nextURL);
          const location = createRouterLocation(href);

          scope.location = location; // !
          set(location);
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

    useImperativeHandle(ref, () => ({
      navigateTo: (url: string) => nextTick(() => history.push(url)),
      location,
    }));

    return (
      <RouterHistoryContext.Provider value={historyContext}>
        <ActiveRouteContext.Provider value={routerContext}>
          <PendingContext.Provider value={pending$}>{slot(content)}</PendingContext.Provider>
        </ActiveRouteContext.Provider>
      </RouterHistoryContext.Provider>
    );
  },
  { displayName: 'Router' },
);

export { Router };
