import { type QDate, type QDateTimeEditSignals, QDateEdit } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

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
    ref?: Ref<DateEditRef>;
    date: QDate;
    displayFormat?: string;
  } & WidgetProps
>;
export type DateEditRef = QDarkDateEdit;
export type DateEditSignals = QDateTimeEditSignals;

const DateEdit = component<DateEditProps>(props => qDateEdit(props), {
  displayName: 'DateEdit',
}) as ComponentFactory<DateEditProps>;

class QDarkDateEdit extends QDateEdit {}

export { DateEdit, QDarkDateEdit };
