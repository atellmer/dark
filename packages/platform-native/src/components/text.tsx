import { Label as NSLabel } from '@nativescript/core';

import { type DarkElement, h, createComponent, forwardRef } from '@dark-engine/core';
import { LabelAttributes } from '../jsx-typings';
import type { TagNativeElement } from '../native-element';

export type TextProps = {
  slot: DarkElement;
} & LabelAttributes;

export type TextRef = TagNativeElement<NSLabel>;

const Text = forwardRef<TextProps, TextRef>(
  createComponent(({ slot, ...rest }, ref) => {
    return (
      <label ref={ref} {...rest}>
        {slot}
      </label>
    );
  }),
);

export { Text };
