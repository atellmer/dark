import { ScrollView as NSScrollView } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { ScrollViewAttributes } from '../jsx';
import { factory } from '../factory';

export type ScrollViewProps = ScrollViewAttributes;
export type ScrollRef = NSScrollView;

const scrollView = factory('scroll-view');

const ScrollView = forwardRef<ScrollViewProps, ScrollRef>(
  createComponent((props, ref) => {
    return scrollView({ ref, ...props });
  }),
);

export { ScrollView };
