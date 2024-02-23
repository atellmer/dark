import { type DarkJSX } from '../jsx';
import { factory } from './factory';

export const div = factory<DarkJSX.AttributesOf<DarkJSX.HTMLTags['div']>>('div');
