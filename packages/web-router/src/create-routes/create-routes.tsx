import type { SplitFlatRoute, RouteConfig, RoutesConfig, RoutesMap } from './types';

function createRoutes$(config: RoutesConfig, prefix = '', parentFallback?: SplitFlatRoute): RoutesMap {
  const routes: Record<string, RouteConfig> = {};

  for (const route of config.schema) {
    const routeFullPath = createPath(prefix, route.path);
    const fallbackFullPath = config.fallback ? createPath(prefix, config.fallback.path) : '';
    const fallback: SplitFlatRoute = config.fallback
      ? {
          ...config.fallback,
          prefix,
          path: config.fallback ? config.fallback.path : '',
          fullPath: fallbackFullPath,
          split: splitPath(fallbackFullPath),
        }
      : null;

    routes[routeFullPath] = {
      route: {
        prefix,
        path: route.path,
        fullPath: routeFullPath,
        split: splitPath(routeFullPath),
        render: route.render,
      },
      fallback: fallback || parentFallback || null,
    };

    if (route.routes) {
      const nestedRoutes = createRoutes$(route.routes, route.path, fallback);

      for (const key of Object.keys(nestedRoutes)) {
        routes[key] = nestedRoutes[key];
      }
    }
  }

  return routes;
}

const createPath = (prefix: string, path: string) => (prefix ? `${prefix}/${path}` : path);

const splitPath = (path: string) => path.split('/').filter(Boolean);

const createRoutes = (config: RoutesConfig, prefix = '') => createRoutes$(config, prefix);

export { createRoutes };
