import { QLineEdit, EchoMode, type QLineEditSignals } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qLineEdit } from '../factory';

// const lineEditEvents = useEvents<LineEditSignals>(
//   {
//     textChanged: (e: SyntheticEvent<string>) => console.log(e.value),
//   },
// );
// <LineEdit on={lineEditEvents} />

export type LineEditProps = WithStandardProps<
  {
    ref?: Ref<LineEditRef>;
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

const LineEdit = component<LineEditProps>(props => qLineEdit(props), {
  displayName: 'LineEdit',
}) as ComponentFactory<LineEditProps>;

class QDarkLineEdit extends QLineEdit {
  setPlaceholder(value: string) {
    this.setPlaceholderText(value);
  }
}

export { LineEdit, QDarkLineEdit };
