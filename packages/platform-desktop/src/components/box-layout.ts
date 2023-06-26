import { QWidget, QBoxLayout, Direction } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qBoxLayout } from '../factory';
import { detectIsDialog } from './dialog';
import { runAtTheEndOfCommit } from '../dom';

// <BoxLayout direction={Direction.LeftToRight}>
//   <Text>Content 1</Text>
//   <Text>Content 2</Text>
//   <Text>Content 3</Text>
// </BoxLayout>

export type BoxLayoutProps = WithSlotProps<
  {
    direction: Direction;
    spacing?: number;
    stretch?: Array<number>;
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

  public setDirection(value: Direction) {
    this.boxLayout.setDirection(value);
  }

  public setSpacing(value: number) {
    runAtTheEndOfCommit(() => this.boxLayout.setSpacing(value));
  }

  public setStretch(value: Array<number>) {
    runAtTheEndOfCommit(() => value.forEach((x, idx) => this.boxLayout.setStretch(idx, x)));
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
