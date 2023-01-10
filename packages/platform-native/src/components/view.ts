import { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { FlexboxLayoutAttributes } from '../jsx';
import { factory } from '../factory';

export type ViewProps = FlexboxLayoutAttributes;
export type ViewRef = NSFlexboxLayout;

const flexboxLayout = factory('flexbox-layout');

const View = forwardRef<ViewProps, ViewRef>(
  createComponent((props, ref) => {
    return flexboxLayout({
      ref,
      flexDirection: 'column',
      ...props,
    });
  }),
);

export { View };
