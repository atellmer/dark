import { type RoutesMap, type RouteConfig, type SplitFlatRoute } from '../create-routes';
import { SLASH, PARAMETER } from '../constants';

function match(path: string, routesMap: RoutesMap) {
  const splittedPath = path.split(SLASH).filter(Boolean);
  const configs = Object.keys(routesMap).map(key => routesMap[key]);
  const fallbackPath = getFallbackPath(path, configs);
  const paramsMap: Record<string, Array<string>> = {};
  let filteredConfigs = configs.filter(x => x.route.split.length <= splittedPath.length);

  for (let i = 0; i < splittedPath.length; i++) {
    filteredConfigs = filteredConfigs.filter(x => {
      const part = splittedPath[i];
      const value = x.route.split[i];
      const isParam = detectIsParam(value);

      if (isParam) {
        if (!paramsMap[x.route.fullPath]) {
          paramsMap[x.route.fullPath] = [];
        }
        paramsMap[x.route.fullPath].push(part);
      }

      return !value || isParam || value === part;
    });
  }

  const sortedConfigs = sort('desc', filteredConfigs, x => x.route.fullPath.length);
  const [firstConfig] = sortedConfigs;
  const matched = firstConfig
    ? firstConfig.route.split.length === splittedPath.length
      ? firstConfig.route.fullPath
      : fallbackPath
    : fallbackPath;
  const params = firstConfig ? getParams(firstConfig.route, paramsMap) : [];

  console.log('matched', matched);

  return { path: matched, params };
}

function getParams(route: SplitFlatRoute, paramsMap: Record<string, Array<string>>) {
  const splitted = route.path.split('').filter(x => x === PARAMETER);
  const source = paramsMap[route.fullPath] || [];
  const params = source.splice(source.length - splitted.length, splitted.length);

  return params;
}

function getFallbackPath(path: string, routes: Array<RouteConfig>) {
  const source = routes.map(x => x.fallback).filter(Boolean);
  const uniqSource = uniq(source, x => x.path);
  const fallbacks = sort(
    'desc',
    uniqSource.filter(x => comparePathes(x.prefix, path)),
    x => x.path.length,
  );
  const fallbackPath = fallbacks[0]?.fullPath || SLASH;

  return fallbackPath;
}

function comparePathes(a: string, b: string) {
  const splittedA = a.split(SLASH).filter(Boolean);
  const splittedB = b.split(SLASH).filter(Boolean);

  for (let i = 0; i < splittedA.length; i++) {
    const isParam = detectIsParam(splittedA[i]);

    if (!isParam && splittedA[i] !== splittedB[i]) {
      return false;
    }
  }

  return true;
}

function sort<T>(type: 'asc' | 'desc', list: Array<T>, selector: (x: T) => number) {
  const asc = (a: T, b: T) => selector(a) - selector(b);
  const desc = (a: T, b: T) => selector(b) - selector(a);
  const compare = type === 'asc' ? asc : desc;

  return list.sort(compare);
}

function uniq<T>(list: Array<T>, selector: (x: T) => string | number) {
  const map: Record<string, boolean> = {};
  const uniq: Array<T> = [];

  for (const item of list) {
    const key = selector(item);

    if (!map[key]) {
      uniq.push(item);
      map[key] = true;
    }
  }

  return uniq;
}

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const createPath = (prefix: string, path: string) => (prefix ? `${prefix}${SLASH}${path}` : path);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

export { match, getFallbackPath, comparePathes, sort, detectIsParam, createPath, splitPath };
