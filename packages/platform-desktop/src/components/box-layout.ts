import { QWidget, QBoxLayout, Direction } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qBoxLayout } from '../factory';
import { detectIsDialog } from './dialog';

export type BoxLayoutProps = WithExtendedProps<
  {
    direction?: Direction;
  } & WidgetProps
>;
export type BoxLayoutRef = QDarkBoxLayout;

const BoxLayout = forwardRef<BoxLayoutProps, BoxLayoutRef>(
  component((props, ref) => qBoxLayout({ ref, ...props }), { displayName: 'BoxLayout' }),
) as ComponentFactory<BoxLayoutProps, BoxLayoutRef>;

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
    if (detectIsDialog(child)) return;
    this.boxLayout.addWidget(child);
  }

  insertBefore(child: QWidget, _: QWidget, idx: number) {
    if (detectIsDialog(child)) return;
    this.boxLayout.insertWidget(idx, child);
  }

  removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.boxLayout.removeWidget(child);
    child.close();
  }
}

export { BoxLayout, QDarkBoxLayout };
