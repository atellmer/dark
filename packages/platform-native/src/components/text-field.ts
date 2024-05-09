import type { TextField as NSTextField } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { TextFieldAttributes } from '../jsx';
import { textField } from '../factory';

export type TextFieldProps = {
  ref?: Ref<TextFieldRef>;
} & TextFieldAttributes;
export type TextFieldRef = NSTextField;

const TextField = component<TextFieldProps>(props => textField(props), {
  displayName: 'TextField',
}) as ComponentFactory<TextFieldProps>;

export { TextField };
