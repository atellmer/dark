import type { Placeholder as NSPlaceholder } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { PlaceholderAttributes } from '../jsx';
import { placeholder } from '../factory';

export type PlaceholderProps = PlaceholderAttributes;
export type PlaceholderRef = NSPlaceholder;

const Placeholder = forwardRef<PlaceholderProps, PlaceholderRef>(
  createComponent((props, ref) => {
    return placeholder({ ref, ...props });
  }),
) as Component<PlaceholderProps, PlaceholderRef>;

export { Placeholder };
