import { Button as NSButton } from '@nativescript/core';

import { type DarkElement, h, createComponent, forwardRef } from '@dark-engine/core';
import { ButtonAttributes } from '../jsx';

export type ButtonProps = {
  slot: DarkElement;
} & ButtonAttributes;

export type ButtonRef = NSButton;

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
