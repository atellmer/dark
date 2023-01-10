import { Label as NSLabel } from '@nativescript/core';

import { type DarkElement, h, createComponent, forwardRef } from '@dark-engine/core';
import { LabelAttributes } from '../jsx';

export type TextProps = {
  slot: DarkElement;
} & LabelAttributes;

export type TextRef = NSLabel;

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
