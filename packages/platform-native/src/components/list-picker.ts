import { ListPicker as NSListPicker } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { ListPickerAttributes } from '../jsx';
import { factory } from '../factory';

export type ListPickerProps = ListPickerAttributes;
export type ListPickerRef = NSListPicker;

const listPicker = factory('list-picker');

const ListPicker = forwardRef<ListPickerProps, ListPickerRef>(
  createComponent((props, ref) => {
    return listPicker({ ref, ...props });
  }),
);

export { ListPicker };
