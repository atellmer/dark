import type { ScrollView as NSScrollView } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { ScrollViewAttributes } from '../jsx';
import { scrollView } from '../factory';

export type ScrollViewProps = ScrollViewAttributes;
export type ScrollRef = NSScrollView;

const ScrollView = forwardRef<ScrollViewProps, ScrollRef>(
  createComponent((props, ref) => {
    return scrollView({ ref, ...props });
  }),
) as Component<ScrollViewProps, ScrollRef>;

export { ScrollView };
