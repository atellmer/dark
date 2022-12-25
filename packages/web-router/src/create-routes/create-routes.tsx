import { DarkElement } from '@dark-engine/core';

export type Route = {
  path: string;
  routes?: CreateRoutesConfig;
  render: () => DarkElement;
};

type FlatRoute = Omit<Route, 'routes'>;

type CreateRoutesConfig = {
  schema: Array<Route>;
  fallback?: FlatRoute;
};

type RouteConfig = {
  route: FlatRoute;
  fallback: FlatRoute;
};

export type RoutesMap = Record<string, RouteConfig>;

function createRoutes$(config: CreateRoutesConfig, prefix = '', parentFallback?: Route): RoutesMap {
  const routes: Record<string, RouteConfig> = {};

  for (const route of config.schema) {
    const fullPath = createPath(prefix, route.path);
    const fallback: Route = config.fallback
      ? { ...config.fallback, path: createPath(prefix, config.fallback.path) }
      : null;

    routes[fullPath] = {
      route: {
        path: fullPath,
        render: route.render,
      },
      fallback: fallback || parentFallback,
    };

    if (route.routes) {
      const nestedRoutes = createRoutes$(route.routes, route.path, config.fallback);

      for (const key of Object.keys(nestedRoutes)) {
        routes[key] = nestedRoutes[key];
      }
    }
  }

  return routes;
}

function createPath(prefix: string, path: string) {
  return prefix ? `${prefix}/${path}` : path;
}

const createRoutes = (config: CreateRoutesConfig, prefix = '') => createRoutes$(config, prefix);

export { createRoutes };
