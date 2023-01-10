import { Button as NSButton } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { ButtonAttributes } from '../jsx';
import { factory } from '../factory';

export type ButtonProps = ButtonAttributes;
export type ButtonRef = NSButton;

const button = factory('button');

const Button = forwardRef<ButtonProps, ButtonRef>(
  createComponent((props, ref) => {
    return button({ ref, ...props });
  }),
);

export { Button };
