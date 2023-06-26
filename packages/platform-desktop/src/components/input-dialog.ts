import {
  type QInputDialogSignals,
  type InputMode,
  type InputDialogOptions,
  type EchoMode,
  QInputDialog,
} from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qInputDialog } from '../factory';

// const inputDialogEvents = useEventSystem<InputDialogSignals>(
//   {
//     textValueChanged: (e: SyntheticEvent<string>) => console.log(e.value),
//   },
//   [],
// );
// <InputDialog open={open} inputMode={InputMode.TextInput} on={inputDialogEvents} />

export type InputDialogProps = WithStandardProps<
  {
    open: boolean;
    inputMode: InputMode;
    doubleDecimals?: number;
    doubleMaximum?: number;
    doubleMinimum?: number;
    doubleStep?: number;
    doubleValue?: number;
    intMaximum?: number;
    intMinimum?: number;
    intStep?: number;
    intValue?: number;
    labelText?: string;
    okButtonText?: string;
    cancelButtonText?: string;
    options?: InputDialogOptions;
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
  public setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { InputDialog, QDarkInputDialog };
