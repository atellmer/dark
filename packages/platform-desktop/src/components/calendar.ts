import { type QCalendarWidgetSignals, QCalendarWidget, DayOfWeek } from '@nodegui/nodegui';
import {
  HorizontalHeaderFormat,
  SelectionMode,
  VerticalHeaderFormat,
} from '@nodegui/nodegui/dist/lib/QtWidgets/QCalendarWidget';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

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

const Calendar = forwardRef<CalendarProps, CalendarRef>(
  component((props, ref) => qCalendar({ ref, ...props }), { displayName: 'Calendar' }),
) as ComponentFactory<CalendarProps, CalendarRef>;

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
