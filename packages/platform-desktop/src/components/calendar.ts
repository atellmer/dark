import { QCalendarWidget, DayOfWeek } from '@nodegui/nodegui';
import {
  HorizontalHeaderFormat,
  SelectionMode,
  VerticalHeaderFormat,
} from '@nodegui/nodegui/dist/lib/QtWidgets/QCalendarWidget';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qCalendar } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

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
