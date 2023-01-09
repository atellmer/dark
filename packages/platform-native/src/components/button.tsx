import { Button as NSButton } from '@nativescript/core';

import { type DarkElement, h, createComponent, forwardRef } from '@dark-engine/core';
import { ButtonAttributes } from '../jsx';
import type { TagNativeElement } from '../native-element';

export type ButtonProps = {
  slot: DarkElement;
} & ButtonAttributes;

export type ButtonRef = TagNativeElement<NSButton>;

const Button = forwardRef<ButtonProps, ButtonRef>(
  createComponent(({ slot, ...rest }, ref) => {
    return (
      <button ref={ref} {...rest}>
        {slot}
      </button>
    );
  }),
);

export { Button };
