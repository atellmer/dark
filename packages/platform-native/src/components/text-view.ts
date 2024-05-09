import type { TextView as NSTextView } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { TextViewAttributes } from '../jsx';
import { textView } from '../factory';

export type TextViewProps = {
  ref?: Ref<TextViewRef>;
} & TextViewAttributes;
export type TextViewRef = NSTextView;

const TextView = component<TextViewProps>(props => textView(props), {
  displayName: 'TextView',
}) as ComponentFactory<TextViewProps>;

export { TextView };
