import { QLineEdit, EchoMode, type QLineEditSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qLineEdit } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type LineEditProps = WithStandardProps<
  {
    text?: string;
    placeholder?: string;
    inputMask?: string;
    readOnly?: boolean;
    echoMode?: EchoMode;
    maxLength?: number;
    clearButtonEnabled?: boolean;
  } & WidgetProps
>;
export type LineEditRef = QDarkLineEdit;
export type LineEditSignals = QLineEditSignals;

const LineEdit = forwardRef<LineEditProps, LineEditRef>(
  component((props, ref) => qLineEdit({ ref, ...props }), { displayName: 'LineEdit' }),
) as ComponentFactory<LineEditProps, LineEditRef>;

class QDarkLineEdit extends QLineEdit {
  setPlaceholder(value: string) {
    this.setPlaceholderText(value);
  }
}

export { LineEdit, QDarkLineEdit };
