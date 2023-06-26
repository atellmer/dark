import { QDateTimeEdit, type QTime, type QDate, type QDateTimeEditSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDateTimeEdit } from '../factory';

// const date = new QDate(2032, 7, 1);
// const time = new QTime(12, 10, 10);
// const dateTimeEditEvents = useEventSystem<DateEditSignals>(
//   {
//     dateTimeChanged: (e: SyntheticEvent<QDateTime>) => console.log(e.value),
//     dateChanged: (e: SyntheticEvent<QDate>) => console.log(e.value),
//     timeChanged: (e: SyntheticEvent<QTime>) => console.log(e.value),
//   },
//   [],
// );
// <DateEdit date={date} time={time} displayFormat='dd.MM.yyyy hh:mm:ss' on={dateTimeEditEvents} />
// https://doc.qt.io/qt-6/qdate.html
// https://doc.qt.io/qt-6/qtime.html

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
