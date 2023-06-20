import { QWidget, QBoxLayout, Direction } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qBoxLayout } from '../factory';
import { detectIsDialog } from './dialog';

export type BoxLayoutProps = WithSlotProps<
  {
    direction?: Direction;
  } & WidgetProps
>;
export type BoxLayoutRef = QDarkBoxLayout;

const BoxLayout = forwardRef<BoxLayoutProps, BoxLayoutRef>(
  component((props, ref) => qBoxLayout({ ref, ...props }), { displayName: 'BoxLayout' }),
) as ComponentFactory<BoxLayoutProps, BoxLayoutRef>;

class QDarkBoxLayout extends QWidget implements Container {
  private boxLayout = new QBoxLayout(Direction.LeftToRight);

  constructor() {
    super();
    this.setLayout(this.boxLayout);
  }

  public detectIsContainer() {
    return true;
  }

  public getBoxLayout() {
    return this.boxLayout;
  }

  public setDirection(direction: Direction) {
    this.boxLayout.setDirection(direction);
  }

  public appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.boxLayout.addWidget(child);
  }

  public insertBefore(child: QWidget, _: QWidget, idx: number) {
    if (detectIsDialog(child)) return;
    this.boxLayout.insertWidget(idx, child);
  }

  public removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.boxLayout.removeWidget(child);
    child.close();
  }
}

export { BoxLayout, QDarkBoxLayout };
