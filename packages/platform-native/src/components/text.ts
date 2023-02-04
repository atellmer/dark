import type { Label as NSLabel } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type TextProps = LabelAttributes;
export type TextRef = NSLabel;

const Text = forwardRef<TextProps, TextRef>(
  createComponent((props, ref) => {
    return label({ ref, ...props });
  }),
) as Component<TextProps, TextRef>;

export { Text };
