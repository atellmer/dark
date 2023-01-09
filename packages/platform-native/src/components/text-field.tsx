import { TextField as NSTextField } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { TextFieldAttributes } from '../jsx';
import type { TagNativeElement } from '../native-element';

export type TextFieldProps = {} & TextFieldAttributes;

export type TextFieldRef = TagNativeElement<NSTextField>;

const TextField = forwardRef<TextFieldProps, TextFieldRef>(
  createComponent((props, ref) => {
    return <text-field ref={ref} {...props} />;
  }),
);

export { TextField };
