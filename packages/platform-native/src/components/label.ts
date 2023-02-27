import type { Label as NSLabel } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type LabelProps = LabelAttributes;
export type LabelRef = NSLabel;

const Label = forwardRef<LabelProps, LabelRef>(
  createComponent((props, ref) => label({ ref, ...props }), { displayName: 'Label' }),
) as ComponentFactory<LabelProps, LabelRef>;

export { Label };
