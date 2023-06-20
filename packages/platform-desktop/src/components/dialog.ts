import { QDialog, QWidget, FlexLayout, FocusReason, type QDialogSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qDialog } from '../factory';

export type DialogProps = WithSlotProps<
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
  private flexLayout = new FlexLayout();

  constructor() {
    super();
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
  }

  public detectIsContainer() {
    return true;
  }

  public setOpen(value: boolean) {
    value ? this.open() : this.close();
  }

  public getFlexLayout() {
    return this.flexLayout;
  }

  public appendChild(child: QWidget) {
    this.flexLayout.addWidget(child);
  }

  public insertBefore(child: QWidget, sibling: QWidget) {
    this.flexLayout.insertChildBefore(child, sibling);
  }

  public removeChild(child: QWidget) {
    this.flexLayout.removeWidget(child);
    child.close();
  }
}

function detectIsDialog(value: unknown): value is QDialog {
  return value instanceof QDialog || QDialog.isPrototypeOf(value);
}

export { Dialog, QDarkDialog, detectIsDialog };
