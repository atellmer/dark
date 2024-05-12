import { type QStackedWidgetSignals, QWidget, QStackedWidget } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qStack } from '../factory';
import { detectIsDialog } from './dialog';
import { throwUnsupported } from '../utils';

// <Stack currentIndex={0}>
//   <Text>Slide 1</Text>
//   <Text>Slide 2</Text>
//   <Text>Slide 3</Text>
// </Stack>

export type StackProps = WithSlotProps<
  {
    ref?: Ref<StackRef>;
    currentIndex: number;
  } & WidgetProps
>;
export type StackRef = QDarkStack;
export type StackSignals = QStackedWidgetSignals;

const Stack = component<StackProps>(props => qStack(props), { displayName: 'Stack' }) as ComponentFactory<StackProps>;

class QDarkStack extends QStackedWidget implements Container {
  detectIsContainer() {
    return true;
  }

  appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.addWidget(child);
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.removeWidget(child);
    child.close();
  }
}

export { Stack, QDarkStack };
