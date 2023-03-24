import type { ActionItem as NSActionItem } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { ActionItemAttributes } from '../jsx';
import { actionItem } from '../factory';

export type ActionItemProps = ActionItemAttributes;
export type ActionItemRef = NSActionItem;

const ActionItem = forwardRef<ActionItemProps, ActionItemRef>(
  component((props, ref) => actionItem({ ref, ...props }), { displayName: 'ActionItem' }),
) as ComponentFactory<ActionItemProps, ActionItemRef>;

export { ActionItem };
