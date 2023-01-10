import { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';

import { type DarkElement, h, createComponent, forwardRef } from '@dark-engine/core';
import { FlexboxLayoutAttributes } from '../jsx';

export type ViewProps = {
  slot: DarkElement;
} & FlexboxLayoutAttributes;

export type ViewRef = NSFlexboxLayout;

const View = forwardRef<ViewProps, ViewRef>(
  createComponent(({ slot, ...rest }, ref) => {
    return (
      <flexbox-layout ref={ref} flexDirection='column' {...rest}>
        {slot}
      </flexbox-layout>
    );
  }),
);

export { View };
