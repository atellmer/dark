import type { DatePicker as NSDatePicker } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { DatePickerAttributes } from '../jsx';
import { datePicker } from '../factory';

export type DatePickerProps = DatePickerAttributes;
export type DatePickerRef = NSDatePicker;

const DatePicker = forwardRef<DatePickerProps, DatePickerRef>(
  component((props, ref) => datePicker({ ref, ...props }), { displayName: 'DatePicker' }),
) as ComponentFactory<DatePickerProps, DatePickerRef>;

export { DatePicker };
