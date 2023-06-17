import { QDialog, QWidget, FlexLayout, FocusReason, type QDialogSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qDialog } from '../factory';

export type DialogProps = WithExtendedProps<
  {
    open: boolean;
    modal?: boolean;
    focus?: FocusReason;
    enableSizeGrip?: boolean;
  } & WidgetProps
>;
export type DialogRef = QDarkDialog;
export type DialogSignals = QDialogSignals;

const Dialog = forwardRef<DialogProps, DialogRef>(
  component((props, ref) => qDialog({ ref, ...props }), { displayName: 'Dialog' }),
) as ComponentFactory<DialogProps, DialogRef>;

class QDarkDialog extends QDialog implements Container {
  isContainer = true;
  flexLayout = new FlexLayout();

  constructor() {
    super();
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
  }

  setOpen(value: boolean) {
    value ? this.open() : this.close();
  }

  getFlexLayout() {
    return this.flexLayout;
  }

  appendChild(child: QWidget) {
    this.flexLayout.addWidget(child);
  }

  insertBefore(child: QWidget, sibling: QWidget) {
    this.flexLayout.insertChildBefore(child, sibling);
  }

  removeChild(child: QWidget) {
    this.flexLayout.removeWidget(child);
    child.close();
  }
}

function detectIsDialog(value: unknown): value is QDialog {
  return value instanceof QDialog || QDialog.isPrototypeOf(value);
}

export { Dialog, QDarkDialog, detectIsDialog };
