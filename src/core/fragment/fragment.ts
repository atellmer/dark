import { createComponent } from '../component';

const Fragment = createComponent(({ slot }) => slot || null);

export {
  Fragment,
};
