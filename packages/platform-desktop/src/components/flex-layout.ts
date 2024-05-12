import { QWidget, FlexLayout as QFlexLayout } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps, Container } from '../shared';
import { qFlexLayout } from '../factory';
import { detectIsDialog } from './dialog';

// <FlexLayout style={`justify-content: 'center';`}>
//   <Text>Content 1</Text>
//   <Text>Content 2</Text>
//   <Text>Content 3</Text>
// </FlexLayout>

export type FlexLayoutProps = WithPartialSlotProps<
  {
    ref?: Ref<FlexLayoutRef>;
  } & WidgetProps
>;
export type FlexLayoutRef = QDarkFlexLayout;

const FlexLayout = component<FlexLayoutProps>(props => qFlexLayout(props), {
  displayName: 'FlexLayout',
}) as ComponentFactory<FlexLayoutProps>;

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
