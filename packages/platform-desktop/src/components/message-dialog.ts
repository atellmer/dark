import { type QMessageBoxSignals, QMessageBox, QPushButton, ButtonRole } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qMessageDialog } from '../factory';

// <MessageDialog open={open} text='Some message...' />

export type MessageDialogProps = WithStandardProps<
  {
    ref?: Ref<MessageDialogRef>;
    open: boolean;
    text: string;
    informativeText?: string;
    detailedText?: string;
    buttonText?: string;
  } & WidgetProps
>;
export type MessageDialogRef = QDarkMessageDialog;
export type MessageDialogSignals = QMessageBoxSignals;

const MessageDialog = component<MessageDialogProps>(props => qMessageDialog(props), {
  displayName: 'MessageDialog',
}) as ComponentFactory<MessageDialogProps>;

class QDarkMessageDialog extends QMessageBox {
  private button = new QPushButton();

  constructor() {
    super();
    this.button.setText('OK');
    this.addButton(this.button, ButtonRole.AcceptRole);
  }

  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }

  setButtonText(value: string) {
    this.button.setText(value);
  }
}

export { MessageDialog, QDarkMessageDialog };
