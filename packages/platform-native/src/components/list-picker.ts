import type { ListPicker as NSListPicker } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { ListPickerAttributes } from '../jsx';
import { listPicker } from '../factory';

export type ListPickerProps = ListPickerAttributes;
export type ListPickerRef = NSListPicker;

const ListPicker = forwardRef<ListPickerProps, ListPickerRef>(
  createComponent((props, ref) => listPicker({ ref, ...props }), { displayName: 'ListPicker' }),
) as Component<ListPickerProps, ListPickerRef>;

export { ListPicker };
