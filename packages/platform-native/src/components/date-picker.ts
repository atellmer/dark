import type { DatePicker as NSDatePicker } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { DatePickerAttributes } from '../jsx';
import { datePicker } from '../factory';

export type DatePickerProps = {
  ref?: Ref<DatePickerRef>;
} & DatePickerAttributes;
export type DatePickerRef = NSDatePicker;

const DatePicker = component<DatePickerProps>(props => datePicker(props), {
  displayName: 'DatePicker',
}) as ComponentFactory<DatePickerProps>;

export { DatePicker };
