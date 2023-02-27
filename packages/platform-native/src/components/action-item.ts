import type { ActionItem as NSActionItem } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { ActionItemAttributes } from '../jsx';
import { actionItem } from '../factory';

export type ActionItemProps = ActionItemAttributes;
export type ActionItemRef = NSActionItem;

const ActionItem = forwardRef<ActionItemProps, ActionItemRef>(
  createComponent((props, ref) => actionItem({ ref, ...props }), { displayName: 'ActionItem' }),
) as ComponentFactory<ActionItemProps, ActionItemRef>;

export { ActionItem };
