import { type HTMLTags } from '../jsx';
import { factory } from './factory';

export const h1 = factory<HTMLTags['h1']>('h1');
