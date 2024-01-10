import {
  type QWidget,
  type QGroupBoxSignals,
  type AlignmentFlag,
  QGroupBox,
  QBoxLayout,
  Direction,
} from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qGroupBox } from '../factory';
import { detectIsDialog } from './dialog';

// <GroupBox title='Controls'>
//   <RadioButton text='Option 1' />
//   <RadioButton text='Option 2' />
//   <RadioButton text='Option 3' />
// </GroupBox>

export type GroupBoxProps = WithSlotProps<
  {
    title?: string;
    flat?: boolean;
    direction?: Direction;
    alignment?: AlignmentFlag;
  } & WidgetProps
>;
export type GroupBoxRef = QDarkGroupBox;
export type GroupBoxSignals = QGroupBoxSignals;

const GroupBox = forwardRef<GroupBoxProps, GroupBoxRef>(
  component((props, ref) => qGroupBox({ ref, ...props }), { displayName: 'GroupBox' }),
) as ComponentFactory<GroupBoxProps, GroupBoxRef>;

class QDarkGroupBox extends QGroupBox implements Container {
  private boxLayout = new QBoxLayout(Direction.TopToBottom);

  constructor() {
    super();
    this.setLayout(this.boxLayout);
  }

  detectIsContainer() {
    return true;
  }

  getBoxLayout() {
    return this.boxLayout;
  }

  setDirection(value: Direction) {
    this.boxLayout.setDirection(value);
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

export { GroupBox, QDarkGroupBox };
