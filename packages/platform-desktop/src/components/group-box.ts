import { type QWidget, QGroupBox, QBoxLayout, Direction } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qGroupBox } from '../factory';
import { detectIsDialog } from './dialog';

export type GroupBoxProps = WithSlotProps<
  {
    title?: string;
    flat?: boolean;
    direction?: Direction;
  } & WidgetProps
>;
export type GroupBoxRef = QDarkGroupBox;

const GroupBox = forwardRef<GroupBoxProps, GroupBoxRef>(
  component((props, ref) => qGroupBox({ ref, ...props }), { displayName: 'GroupBox' }),
) as ComponentFactory<GroupBoxProps, GroupBoxRef>;

class QDarkGroupBox extends QGroupBox implements Container {
  private boxLayout = new QBoxLayout(Direction.TopToBottom);

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

export { GroupBox, QDarkGroupBox };
