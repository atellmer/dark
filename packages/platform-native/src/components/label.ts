import type { Label as NSLabel } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type LabelProps = LabelAttributes;
export type LabelRef = NSLabel;

const Label = forwardRef<LabelProps, LabelRef>(
  createComponent((props, ref) => label({ ref, ...props }), { displayName: 'Label' }),
) as Component<LabelProps, LabelRef>;

export { Label };
