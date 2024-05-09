import { type QTime, type QDateTimeEditSignals, QTimeEdit } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qTimeEdit } from '../factory';

// const time = new QTime(12, 10, 10);
// const timeEditEvents = useEvents<TimeEditSignals>(
//   {
//     timeChanged: (time: QTime) => {},
//   },
// );
// <DateEdit time={time} displayFormat='hh:mm:ss' on={timeEditEvents} />
// https://doc.qt.io/qt-6/qtime.html

export type TimeEditProps = WithStandardProps<
  {
    ref?: Ref<TimeEditRef>;
    time: QTime;
    displayFormat?: string;
  } & WidgetProps
>;
export type TimeEditRef = QDarkTimeEdit;
export type TimeEditSignals = QDateTimeEditSignals;

const TimeEdit = component<TimeEditProps>(props => qTimeEdit(props), {
  displayName: 'TimeEdit',
}) as ComponentFactory<TimeEditProps>;

class QDarkTimeEdit extends QTimeEdit {}

export { TimeEdit, QDarkTimeEdit };
