import type { Placeholder as NSPlaceholder } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { PlaceholderAttributes } from '../jsx';
import { placeholder } from '../factory';

export type PlaceholderProps = {
  ref?: Ref<PlaceholderRef>;
} & PlaceholderAttributes;
export type PlaceholderRef = NSPlaceholder;

const Placeholder = component<PlaceholderProps>(props => placeholder(props), {
  displayName: 'Placeholder',
}) as ComponentFactory<PlaceholderProps>;

export { Placeholder };
