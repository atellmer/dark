import { QWidget, FlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qFlexLayout } from '../factory';
import type { WidgetProps, WithExtendedProps } from '../shared';

export type ViewProps = WithExtendedProps<{} & WidgetProps>;
export type ViewRef = QWidget;

const View = forwardRef<ViewProps, ViewRef>(
  component((props, ref) => qFlexLayout({ ref, ...props }), { displayName: 'View' }),
) as ComponentFactory<ViewProps, ViewRef>;

class QFlexLayout extends QWidget {
  flexLayout = new FlexLayout();

  constructor() {
    super();
    this.flexLayout.setFlexNode(this.getFlexNode());
    this.setLayout(this.flexLayout);
  }

  getFlexLayout() {
    return this.flexLayout;
  }
}

export { View, QFlexLayout };
