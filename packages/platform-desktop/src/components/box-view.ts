import { QWidget, QBoxLayout, QDialog, Direction } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qBoxLayout } from '../factory';
import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';

export type BoxViewProps = WithExtendedProps<
  {
    direction?: Direction;
  } & WidgetProps
>;
export type BoxViewRef = QWidget;

const BoxView = forwardRef<BoxViewProps, BoxViewRef>(
  component((props, ref) => qBoxLayout({ ref, ...props }), { displayName: 'BoxView' }),
) as ComponentFactory<BoxViewProps, BoxViewRef>;

class QDarkBoxLayout extends QWidget implements Container {
  isContainer = true;
  boxLayout = new QBoxLayout(Direction.LeftToRight);

  constructor() {
    super();
    this.setLayout(this.boxLayout);
  }

  getBoxLayout() {
    return this.boxLayout;
  }

  setDirection(direction: Direction) {
    this.boxLayout.setDirection(direction);
  }

  appendChild(child: QWidget) {
    if (child instanceof QDialog) return;
    this.boxLayout.addWidget(child);
    child.show();
  }

  insertBefore(child: QWidget, _: QWidget, idx: number) {
    if (child instanceof QDialog) return;
    this.boxLayout.insertWidget(idx, child);
    child.show();
  }

  removeChild(child: QWidget) {
    this.boxLayout.removeWidget(child);
    child.close();
  }
}

export { BoxView, QDarkBoxLayout };
