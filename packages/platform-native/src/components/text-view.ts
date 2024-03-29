import type { TextView as NSTextView } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { TextViewAttributes } from '../jsx';
import { textView } from '../factory';

export type TextViewProps = TextViewAttributes;
export type TextViewRef = NSTextView;

const TextView = forwardRef<TextViewProps, TextViewRef>(
  component((props, ref) => textView({ ref, ...props }), { displayName: 'TextView' }),
) as ComponentFactory<TextViewProps, TextViewRef>;

export { TextView };
