import { type DarkJSX } from '../jsx';
import { factory } from './factory';

export const canvas = factory<DarkJSX.NonStrictElements['canvas']>('canvas');
