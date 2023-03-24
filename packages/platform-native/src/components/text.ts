import type { Label as NSLabel } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { LabelAttributes } from '../jsx';
import { label } from '../factory';

export type TextProps = LabelAttributes;
export type TextRef = NSLabel;

const Text = forwardRef<TextProps, TextRef>(
  component((props, ref) => label({ ref, ...props }), { displayName: ':Text' }),
) as ComponentFactory<TextProps, TextRef>;

export { Text };
