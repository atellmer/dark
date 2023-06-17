import { QWidget, FlexLayout as QFlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qFlexLayout } from '../factory';
import { detectIsDialog } from './dialog';

export type FlexLayoutProps = WithExtendedProps<{} & WidgetProps>;
export type FlexLayoutRef = QDarkFlexLayout;

const FlexLayout = forwardRef<FlexLayoutProps, FlexLayoutRef>(
  component((props, ref) => qFlexLayout({ ref, ...props }), { displayName: 'FlexLayout' }),
) as ComponentFactory<FlexLayoutProps, FlexLayoutRef>;

class QDarkFlexLayout extends QWidget implements Container {
  isContainer = true;
  flexLayout = new QFlexLayout();

  constructor() {
    super();
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
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
    if (detectIsDialog(child)) return;
    this.flexLayout.removeWidget(child);
    child.close();
  }
}

export { FlexLayout, QDarkFlexLayout };
