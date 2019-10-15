import { createComponent } from '../component';

const $$fragment = Symbol('fragment');
const Fragment = createComponent(({ slot }) => slot || null, { elementToken: $$fragment });
const isFragment = (o) => o && o.elementToken === $$fragment;

export {
  Fragment,
  isFragment,
};
