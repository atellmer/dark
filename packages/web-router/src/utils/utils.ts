import { SLASH, PARAMETER } from '../constants';

const detectIsParam = (value: string) => value && value.startsWith(PARAMETER);

const splitPath = (path: string) => path.split(SLASH).filter(Boolean);

const normalaizeEnd = (path: string) => (path.endsWith(SLASH) ? path : path + SLASH);

export { detectIsParam, splitPath, normalaizeEnd };
