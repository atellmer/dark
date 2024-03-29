import { type QMessageBoxSignals, QMessageBox, QPushButton, ButtonRole } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qMessageDialog } from '../factory';

// <MessageDialog open={open} text='Some message...' />

export type MessageDialogProps = WithStandardProps<
  {
    open: boolean;
    text: string;
    informativeText?: string;
    detailedText?: string;
    buttonText?: string;
  } & WidgetProps
>;
export type MessageDialogRef = QDarkMessageDialog;
export type MessageDialogSignals = QMessageBoxSignals;

const MessageDialog = forwardRef<MessageDialogProps, MessageDialogRef>(
  component((props, ref) => qMessageDialog({ ref, ...props }), { displayName: 'MessageDialog' }),
) as ComponentFactory<MessageDialogProps, MessageDialogRef>;

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
