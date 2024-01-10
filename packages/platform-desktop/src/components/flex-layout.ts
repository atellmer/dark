import { QWidget, FlexLayout as QFlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps, Container } from '../shared';
import { qFlexLayout } from '../factory';
import { detectIsDialog } from './dialog';

// <FlexLayout style={`justify-content: 'center';`}>
//   <Text>Content 1</Text>
//   <Text>Content 2</Text>
//   <Text>Content 3</Text>
// </FlexLayout>

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

  detectIsContainer() {
    return true;
  }

  getFlexLayout() {
    return this.flexLayout;
  }

  appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.updateChild(child);
    this.flexLayout.addWidget(child);
  }

  insertBefore(child: QWidget, sibling: QWidget) {
    if (detectIsDialog(child)) return;
    this.updateChild(child);
    this.flexLayout.insertChildBefore(child, sibling);
  }

  removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.flexLayout.removeWidget(child);
    child.close();
  }

  updateChild(child: QWidget) {
    child.setStyleSheet('flex-grow: 1');
  }
}

export { FlexLayout, QDarkFlexLayout };
