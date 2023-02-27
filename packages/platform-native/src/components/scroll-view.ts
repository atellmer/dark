import type { ScrollView as NSScrollView } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { ScrollViewAttributes } from '../jsx';
import { scrollView } from '../factory';

export type ScrollViewProps = ScrollViewAttributes;
export type ScrollRef = NSScrollView;

const ScrollView = forwardRef<ScrollViewProps, ScrollRef>(
  createComponent((props, ref) => scrollView({ ref, ...props }), { displayName: 'ScrollView' }),
) as ComponentFactory<ScrollViewProps, ScrollRef>;

export { ScrollView };
