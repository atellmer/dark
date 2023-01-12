import { Label as NSLabel } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type LabelProps = LabelAttributes;
export type LabelRef = NSLabel;

const Label = forwardRef<LabelProps, LabelRef>(
  createComponent((props, ref) => {
    return label({ ref, ...props });
  }),
);

export { Label };
