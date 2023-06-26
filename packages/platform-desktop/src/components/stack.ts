import { type QStackedWidgetSignals, QWidget, QStackedWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

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
    currentIndex: number;
  } & WidgetProps
>;
export type StackRef = QDarkStack;
export type StackSignals = QStackedWidgetSignals;

const Stack = forwardRef<StackProps, StackRef>(
  component((props, ref) => qStack({ ref, ...props }), { displayName: 'Stack' }),
) as ComponentFactory<StackProps, StackRef>;

class QDarkStack extends QStackedWidget implements Container {
  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.addWidget(child);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.removeWidget(child);
    child.close();
  }
}

export { Stack, QDarkStack };
