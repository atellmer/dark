import { Placeholder as NSPlaceholder } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { PlaceholderAttributes } from '../jsx';
import { placeholder } from '../factory';

export type PlaceholderProps = PlaceholderAttributes;
export type PlaceholderRef = NSPlaceholder;

const Placeholder = forwardRef<PlaceholderProps, PlaceholderRef>(
  createComponent((props, ref) => {
    return placeholder({ ref, ...props });
  }),
);

export { Placeholder };