import type { StackLayout as NSStackLayout } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { StackLayoutAttributes } from '../jsx';
import { stackLayout } from '../factory';

export type StackLayoutProps = StackLayoutAttributes;
export type StackLayoutRef = NSStackLayout;

const StackLayout = forwardRef<StackLayoutProps, StackLayoutRef>(
  createComponent(
    (props, ref) => {
      return stackLayout({ ref, ...props });
    },
    { displayName: 'StackLayout' },
  ),
) as Component<StackLayoutProps, StackLayoutRef>;

export { StackLayout };
