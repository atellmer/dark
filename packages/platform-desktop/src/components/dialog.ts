import { type QDialogSignals, QDialog, QWidget, FlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qDialog } from '../factory';

// <Dialog open={open}>
//   <Text>content...</Text>
// </Dialog>

export type DialogProps = WithSlotProps<
  {
    open: boolean;
  } & WidgetProps
>;
export type DialogRef = QDarkDialog;
export type DialogSignals = QDialogSignals;

const Dialog = forwardRef<DialogProps, DialogRef>(
  component((props, ref) => qDialog({ ref, ...props }), { displayName: 'Dialog' }),
) as ComponentFactory<DialogProps, DialogRef>;

class QDarkDialog extends QDialog implements Container {
  private flexLayout = new FlexLayout();

  constructor() {
    super();
    this.setMinimumWidth(10);
    this.setMinimumHeight(10);
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
  }

  detectIsContainer() {
    return true;
  }

  setOpen(value: boolean) {
    value ? this.open() : this.close();
  }

  getFlexLayout() {
    return this.flexLayout;
  }

  appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.flexLayout.addWidget(child);
  }

  insertBefore(child: QWidget, sibling: QWidget) {
    if (detectIsDialog(child)) return;
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
