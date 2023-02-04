import type { TextField as NSTextField } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { TextFieldAttributes } from '../jsx';
import { textField } from '../factory';

export type TextFieldProps = TextFieldAttributes;
export type TextFieldRef = NSTextField;

const TextField = forwardRef<TextFieldProps, TextFieldRef>(
  createComponent((props, ref) => {
    return textField({ ref, ...props });
  }),
);

export { TextField };
