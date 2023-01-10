import { TextField as NSTextField } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { TextFieldAttributes } from '../jsx';
import { factory } from '../factory';

export type TextFieldProps = TextFieldAttributes;
export type TextFieldRef = NSTextField;

const textField = factory('text-field');

const TextField = forwardRef<TextFieldProps, TextFieldRef>(
  createComponent((props, ref) => {
    return textField({ ref, ...props });
  }),
);

export { TextField };
