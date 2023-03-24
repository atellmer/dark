import type { TextField as NSTextField } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { TextFieldAttributes } from '../jsx';
import { textField } from '../factory';

export type TextFieldProps = TextFieldAttributes;
export type TextFieldRef = NSTextField;

const TextField = forwardRef<TextFieldProps, TextFieldRef>(
  component((props, ref) => textField({ ref, ...props }), { displayName: 'TextField' }),
) as ComponentFactory<TextFieldProps, TextFieldRef>;

export { TextField };
