import { SLASH, PARAMETER } from '../constants';
import { type PathMatchStrategy } from '../create-routes';

function detectIsMatch(currentPath: string, fullPath: string): boolean {
  const splittedA = splitPath(fullPath);
  const splittedB = splitPath(currentPath);

  if (fullPath === SLASH) {
    if (currentPath === SLASH) return true;
    return false;
  }

  for (let i = 0; i < splittedA.length; i++) {
    const isParam = detectIsParam(splittedA[i]);

    if (!isParam && splittedA[i] !== splittedB[i]) return false;
  }

  return true;
}

function createPath(pathMatch: PathMatchStrategy, prefix: string, path: string) {
  const prefix$ = pathMatch === 'prefix' ? normalaizeEnd(prefix) : '';

  return normalaizeEnd(prefix$ ? `${prefix$}${path}` : path);
}

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

const normalaizeEnd = (path: string) => (path.endsWith(SLASH) ? path : path + SLASH);

export { detectIsMatch, detectIsParam, createPath, splitPath, normalaizeEnd };
