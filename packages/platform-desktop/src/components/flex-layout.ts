import { QWidget, FlexLayout as QFlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps, Container } from '../shared';
import { qFlexLayout } from '../factory';
import { detectIsDialog } from './dialog';

export type FlexLayoutProps = WithPartialSlotProps<{} & WidgetProps>;
export type FlexLayoutRef = QDarkFlexLayout;

const FlexLayout = forwardRef<FlexLayoutProps, FlexLayoutRef>(
  component((props, ref) => qFlexLayout({ ref, ...props }), { displayName: 'FlexLayout' }),
) as ComponentFactory<FlexLayoutProps, FlexLayoutRef>;

class QDarkFlexLayout extends QWidget implements Container {
  private flexLayout = new QFlexLayout();

  constructor() {
    super();
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
  }

  public detectIsContainer() {
    return true;
  }

  public getFlexLayout() {
    return this.flexLayout;
  }

  public appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.flexLayout.addWidget(child);
  }

  public insertBefore(child: QWidget, sibling: QWidget) {
    if (detectIsDialog(child)) return;
    this.flexLayout.insertChildBefore(child, sibling);
  }

  public removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.flexLayout.removeWidget(child);
    child.close();
  }
}

export { FlexLayout, QDarkFlexLayout };
