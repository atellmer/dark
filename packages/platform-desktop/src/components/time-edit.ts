import { type QTime, type QDateTimeEditSignals, QTimeEdit } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qTimeEdit } from '../factory';

// const time = new QTime(12, 10, 10);
// const timeEditEvents = useEventSystem<TimeEditSignals>(
//   {
//     timeChanged: (time: QTime) => {},
//   },
//   [],
// );
// <DateEdit time={time} displayFormat='hh:mm:ss' on={timeEditEvents} />
// https://doc.qt.io/qt-6/qtime.html

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
