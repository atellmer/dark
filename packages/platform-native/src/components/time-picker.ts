import { TimePicker as NSTimePicker } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { TimePickerAttributes } from '../jsx';
import { timePicker } from '../factory';

export type TimePickerProps = TimePickerAttributes;
export type TimePickerRef = NSTimePicker;

const TimePicker = forwardRef<TimePickerProps, TimePickerRef>(
  createComponent((props, ref) => {
    return timePicker({ ref, ...props });
  }),
);

export { TimePicker };
