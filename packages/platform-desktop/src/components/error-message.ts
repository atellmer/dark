import { QErrorMessage, type QErrorMessageSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qErrorMessage } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type ErrorMessageProps = WithStandardProps<
  {
    open: boolean;
    message: string;
  } & WidgetProps
>;
export type ErrorMessageRef = QErrorMessage;
export type ErrorMessageSignals = QErrorMessageSignals;

const ErrorMessage = forwardRef<ErrorMessageProps, ErrorMessageRef>(
  component((props, ref) => qErrorMessage({ ref, ...props }), { displayName: 'ErrorMessage' }),
) as ComponentFactory<ErrorMessageProps, ErrorMessageRef>;

class QDarkErrorMessage extends QErrorMessage {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }

  setMessage(value: string) {
    this.showMessage(value);
  }
}

export { ErrorMessage, QDarkErrorMessage };
