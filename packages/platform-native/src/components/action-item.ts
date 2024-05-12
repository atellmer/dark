import type { ActionItem as NSActionItem } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ActionItemAttributes } from '../jsx';
import { actionItem } from '../factory';

export type ActionItemProps = {
  ref?: Ref<ActionItemRef>;
} & ActionItemAttributes;
export type ActionItemRef = NSActionItem;

const ActionItem = component<ActionItemProps>(props => actionItem(props), {
  displayName: 'ActionItem',
}) as ComponentFactory<ActionItemProps>;

export { ActionItem };
