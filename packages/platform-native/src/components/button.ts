import type { Button as NSButton } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { ButtonAttributes } from '../jsx';
import { button } from '../factory';

export type ButtonProps = ButtonAttributes;
export type ButtonRef = NSButton;

const Button = forwardRef<ButtonProps, ButtonRef>(
  createComponent((props, ref) => button({ ref, ...props }), { displayName: 'Button' }),
) as Component<ButtonProps, ButtonRef>;

export { Button };
