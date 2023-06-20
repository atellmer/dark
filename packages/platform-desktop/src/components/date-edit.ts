import { QDateEdit, type QDate, type QDateTimeEditSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDateEdit } from '../factory';

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
