import { StackLayout as NSStackLayout } from '@nativescript/core';

import { h, createComponent, forwardRef, type DarkElement, type Ref } from '@dark-engine/core';
import { StackLayoutAttributes } from '../jsx-typings';
import type { TagNativeElement } from '../native-element';

export type ViewProps = {
  slot: DarkElement;
} & StackLayoutAttributes;

export type ViewRef = TagNativeElement<NSStackLayout>;

const View = forwardRef<ViewProps, ViewRef>(
  createComponent(({ slot, ...rest }, ref) => {
    return (
      <stack-layout ref={ref} {...rest}>
        {slot}
      </stack-layout>
    );
  }),
);

export { View };
