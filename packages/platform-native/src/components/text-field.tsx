import { TextField as NSTextField } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { TextFieldAttributes } from '../jsx';

export type TextFieldProps = {} & TextFieldAttributes;

export type TextFieldRef = NSTextField;

const TextField = forwardRef<TextFieldProps, TextFieldRef>(
  createComponent((props, ref) => {
    return <text-field ref={ref} {...props} />;
  }),
);

export { TextField };
