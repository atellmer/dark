import { type QErrorMessageSignals, QErrorMessage } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qErrorMessage } from '../factory';

// <ErrorMessage open={open} message='Oh no!' />

export type ErrorMessageProps = WithStandardProps<
  {
    ref?: Ref<ErrorMessageRef>;
    open: boolean;
    message: string;
  } & WidgetProps
>;
export type ErrorMessageRef = QErrorMessage;
export type ErrorMessageSignals = QErrorMessageSignals;

const ErrorMessage = component<ErrorMessageProps>(props => qErrorMessage(props), {
  displayName: 'ErrorMessage',
}) as ComponentFactory<ErrorMessageProps>;

class QDarkErrorMessage extends QErrorMessage {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }

  setMessage(value: string) {
    this.showMessage(value);
  }
}

export { ErrorMessage, QDarkErrorMessage };
