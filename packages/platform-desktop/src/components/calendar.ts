import { type QCalendarWidgetSignals, QCalendarWidget, DayOfWeek } from '@nodegui/nodegui';
import {
  HorizontalHeaderFormat,
  SelectionMode,
  VerticalHeaderFormat,
} from '@nodegui/nodegui/dist/lib/QtWidgets/QCalendarWidget';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qCalendar } from '../factory';

// const calendarEvents = useEvents<CalendarSignals>(
//   {
//     clicked: (e: SyntheticEvent<QDate>) => console.log(e.value),
//   },
// );
// <Calendar on={calendarEvents} />

export type CalendarProps = WithStandardProps<
  {
    ref?: Ref<CalendarRef>;
    gridHidden?: boolean;
    navigationBarHidden?: boolean;
    firstDayOfWeek?: DayOfWeek;
    horizontalHeaderFormat?: HorizontalHeaderFormat;
    verticalHeaderFormat?: VerticalHeaderFormat;
    selectionMode?: SelectionMode;
  } & WidgetProps
>;
export type CalendarRef = QDarkCalendar;
export type CalendarSignals = QCalendarWidgetSignals;

const Calendar = component<CalendarProps>(props => qCalendar(props), {
  displayName: 'Calendar',
}) as ComponentFactory<CalendarProps>;

class QDarkCalendar extends QCalendarWidget {
  constructor() {
    super();
    this.setGridVisible(true);
    this.setNavigationBarVisible(true);
  }

  setGridHidden(value: boolean) {
    this.setGridVisible(!value);
  }

  setNavigationBarHidden(value: boolean) {
    this.setNavigationBarVisible(!value);
  }
}

export { Calendar, QDarkCalendar };
