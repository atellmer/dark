import { QDialog, QWidget, FlexLayout, FocusReason } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qDialog } from '../factory';
import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';

export type DialogProps = WithExtendedProps<
  {
    open: boolean;
    modal?: boolean;
    focus?: FocusReason;
    enableSizeGrip?: boolean;
  } & WidgetProps
>;
export type DialogRef = QDialog;

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
    child.show();
  }

  insertBefore(child: QWidget, sibling: QWidget) {
    this.flexLayout.insertChildBefore(child, sibling);
    child.show();
  }

  removeChild(child: QWidget) {
    this.flexLayout.removeWidget(child);
    child.close();
  }
}

export { Dialog, QDarkDialog };
