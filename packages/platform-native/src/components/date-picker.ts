import type { DatePicker as NSDatePicker } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { DatePickerAttributes } from '../jsx';
import { datePicker } from '../factory';

export type DatePickerProps = DatePickerAttributes;
export type DatePickerRef = NSDatePicker;

const DatePicker = forwardRef<DatePickerProps, DatePickerRef>(
  createComponent((props, ref) => {
    return datePicker({ ref, ...props });
  }),
) as Component<DatePickerProps, DatePickerRef>;

export { DatePicker };
