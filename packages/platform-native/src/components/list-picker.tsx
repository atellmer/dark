import { ListPicker as NSListPicker } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { ListPickerAttributes } from '../jsx';
import type { TagNativeElement } from '../native-element';

export type ListPickerProps = {} & ListPickerAttributes;

export type ListPickerRef = TagNativeElement<NSListPicker>;

const ListPicker = forwardRef<ListPickerProps, ListPickerRef>(
  createComponent((props, ref) => {
    return <list-picker ref={ref} {...props} />;
  }),
);

export { ListPicker };
