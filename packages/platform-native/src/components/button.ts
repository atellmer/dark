import type { Button as NSButton } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { ButtonAttributes } from '../jsx';
import { button } from '../factory';

export type ButtonProps = ButtonAttributes;
export type ButtonRef = NSButton;

const Button = forwardRef<ButtonProps, ButtonRef>(
  createComponent((props, ref) => {
    return button({ ref, ...props });
  }),
) as Component<ButtonProps, ButtonRef>;

export { Button };
