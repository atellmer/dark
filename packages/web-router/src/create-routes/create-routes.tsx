import type { SplitFlatRoute, RouteConfig, RoutesConfig, RoutesMap } from './types';

function createRoutes$(config: RoutesConfig, prefix = '', parentFallback?: SplitFlatRoute): RoutesMap {
  const routes: Record<string, RouteConfig> = {};

  for (const route of config.schema) {
    const routePath = createPath(prefix, route.path);
    const fallbackPath = config.fallback ? createPath(prefix, config.fallback.path) : '';
    const fallback: SplitFlatRoute = config.fallback
      ? {
          ...config.fallback,
          path: fallbackPath,
          split: splitPath(fallbackPath),
        }
      : null;

    routes[routePath] = {
      route: {
        path: routePath,
        split: splitPath(routePath),
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
