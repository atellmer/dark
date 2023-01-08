import { ScrollView as NSScrollView } from '@nativescript/core';

import { h, createComponent, forwardRef, type DarkElement } from '@dark-engine/core';
import { ScrollViewAttributes } from '../jsx-typings';
import type { TagNativeElement } from '../native-element';

export type ScrollViewProps = {
  slot: DarkElement;
} & ScrollViewAttributes;

export type ScrollRef = TagNativeElement<NSScrollView>;

const ScrollView = forwardRef<ScrollViewProps, ScrollRef>(
  createComponent(({ slot, ...rest }, ref) => {
    return (
      <scroll-view ref={ref} {...rest}>
        {slot}
      </scroll-view>
    );
  }),
);

export { ScrollView };
