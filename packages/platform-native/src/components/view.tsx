import { StackLayout } from '@nativescript/core';

import { h, createComponent, forwardRef, type DarkElement } from '@dark-engine/core';
import { StackLayoutAttributes } from '../jsx-typings';
import type { TagNativeElement } from '../native-element';

export type ViewProps = {
  slot: DarkElement;
} & StackLayoutAttributes;

export type ViewRef = TagNativeElement<StackLayout>;

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
