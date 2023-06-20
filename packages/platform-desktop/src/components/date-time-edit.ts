import { QDateTimeEdit, type QTime, type QDate, type QDateTimeEditSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDateTimeEdit } from '../factory';

export type DateTimeEditProps = WithStandardProps<
  {
    date: QDate;
    time: QTime;
    displayFormat?: string;
  } & WidgetProps
>;
export type DateTimeEditRef = QDarkDateTimeEdit;
export type DateTimeEditSignals = QDateTimeEditSignals;

const DateTimeEdit = forwardRef<DateTimeEditProps, DateTimeEditRef>(
  component((props, ref) => qDateTimeEdit({ ref, ...props }), { displayName: 'DateTimeEdit' }),
) as ComponentFactory<DateTimeEditProps, DateTimeEditRef>;

class QDarkDateTimeEdit extends QDateTimeEdit {}

export { DateTimeEdit, QDarkDateTimeEdit };
