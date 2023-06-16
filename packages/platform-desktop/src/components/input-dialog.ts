import {
  QInputDialog,
  type QInputDialogSignals,
  type InputMode,
  type InputDialogOptions,
  type EchoMode,
} from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qInputDialog } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type InputDialogProps = WithStandardProps<
  {
    open: boolean;
    inputMode?: InputMode;
    doubleDecimals?: number;
    doubleMaximum?: number;
    doubleMinimum?: number;
    doubleStep?: number;
    doubleValue?: number;
    intMaximum?: number;
    intMinimum?: number;
    labelText?: string;
    okButtonText?: string;
    cancelButtonText?: string;
    options?: InputDialogOptions;
    comboBoxEditable?: boolean;
    textEchoMode?: EchoMode;
    textValue?: string;
  } & WidgetProps
>;
export type InputDialogRef = QDarkInputDialog;
export type InputDialogSignals = QInputDialogSignals;

const InputDialog = forwardRef<InputDialogProps, InputDialogRef>(
  component((props, ref) => qInputDialog({ ref, ...props }), { displayName: 'InputDialog' }),
) as ComponentFactory<InputDialogProps, InputDialogRef>;

class QDarkInputDialog extends QInputDialog {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { InputDialog, QDarkInputDialog };
