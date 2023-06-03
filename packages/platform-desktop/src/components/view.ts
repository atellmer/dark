import { QWidget, FlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qFlexLayout } from '../factory';
import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';

export type ViewProps = WithExtendedProps<{} & WidgetProps>;
export type ViewRef = QWidget;

const View = forwardRef<ViewProps, ViewRef>(
  component((props, ref) => qFlexLayout({ ref, ...props }), { displayName: 'View' }),
) as ComponentFactory<ViewProps, ViewRef>;

class QDarkFlexLayout extends QWidget implements Container {
  isContainer = true;
  flexLayout = new FlexLayout();

  constructor() {
    super();
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
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

export { View, QDarkFlexLayout };
