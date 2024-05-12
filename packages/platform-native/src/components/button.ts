import type { Button as NSButton } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ButtonAttributes } from '../jsx';
import { button } from '../factory';

export type ButtonProps = {
  ref?: Ref<ButtonRef>;
} & ButtonAttributes;
export type ButtonRef = NSButton;

const Button = component<ButtonProps>(props => button(props), {
  displayName: 'Button',
}) as ComponentFactory<ButtonProps>;

export { Button };
