import { type QDate, type QDateTimeEditSignals, QDateEdit } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDateEdit } from '../factory';

// const date = new QDate(2032, 7, 1);
// const dateEditEvents = useEvents<DateEditSignals>(
//   {
//     dateChanged: (e: SyntheticEvent<QDate) => console.log(e.value),
//   },
// );
// <DateEdit date={date} displayFormat='dd.MM.yyyy' on={dateEditEvents} />
// https://doc.qt.io/qt-6/qdate.html

export type DateEditProps = WithStandardProps<
  {
    date: QDate;
    displayFormat?: string;
  } & WidgetProps
>;
export type DateEditRef = QDarkDateEdit;
export type DateEditSignals = QDateTimeEditSignals;

const DateEdit = forwardRef<DateEditProps, DateEditRef>(
  component((props, ref) => qDateEdit({ ref, ...props }), { displayName: 'DateEdit' }),
) as ComponentFactory<DateEditProps, DateEditRef>;

class QDarkDateEdit extends QDateEdit {}

export { DateEdit, QDarkDateEdit };
