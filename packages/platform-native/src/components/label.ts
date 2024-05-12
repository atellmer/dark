import type { Label as NSLabel } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type LabelProps = {
  ref?: Ref<LabelRef>;
} & LabelAttributes;
export type LabelRef = NSLabel;

const Label = component<LabelProps>(props => label(props), { displayName: 'Label' }) as ComponentFactory<LabelProps>;

export { Label };
