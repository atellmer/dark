import type { Label as NSLabel } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type TextProps = {
  ref?: Ref<TextRef>;
} & LabelAttributes;
export type TextRef = NSLabel;

const Text = component<TextProps>(props => label(props), { displayName: ':Text' }) as ComponentFactory<TextProps>;

export { Text };
