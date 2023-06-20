import { QTimeEdit, type QTime, type QDateTimeEditSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qTimeEdit } from '../factory';

export type TimeEditProps = WithStandardProps<
  {
    time: QTime;
    displayFormat?: string;
  } & WidgetProps
>;
export type TimeEditRef = QDarkTimeEdit;
export type TimeEditSignals = QDateTimeEditSignals;

const TimeEdit = forwardRef<TimeEditProps, TimeEditRef>(
  component((props, ref) => qTimeEdit({ ref, ...props }), { displayName: 'TimeEdit' }),
) as ComponentFactory<TimeEditProps, TimeEditRef>;

class QDarkTimeEdit extends QTimeEdit {}

export { TimeEdit, QDarkTimeEdit };
