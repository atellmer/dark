import { Label as NSLabel } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type TextProps = LabelAttributes;
export type TextRef = NSLabel;

const Text = forwardRef<TextProps, TextRef>(
  createComponent((props, ref) => {
    return label({ ref, ...props });
  }),
);

export { Text };
