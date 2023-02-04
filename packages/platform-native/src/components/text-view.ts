import type { TextView as NSTextView } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { TextViewAttributes } from '../jsx';
import { textView } from '../factory';

export type TextViewProps = TextViewAttributes;
export type TextViewRef = NSTextView;

const TextView = forwardRef<TextViewProps, TextViewRef>(
  createComponent((props, ref) => {
    return textView({ ref, ...props });
  }),
) as Component<TextViewProps, TextViewRef>;

export { TextView };
