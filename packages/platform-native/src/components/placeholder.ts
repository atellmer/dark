import type { Placeholder as NSPlaceholder } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { PlaceholderAttributes } from '../jsx';
import { placeholder } from '../factory';

export type PlaceholderProps = PlaceholderAttributes;
export type PlaceholderRef = NSPlaceholder;

const Placeholder = forwardRef<PlaceholderProps, PlaceholderRef>(
  component((props, ref) => placeholder({ ref, ...props }), { displayName: 'Placeholder' }),
) as ComponentFactory<PlaceholderProps, PlaceholderRef>;

export { Placeholder };
