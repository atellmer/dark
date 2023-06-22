import { QWidget, QStackedWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qStack } from '../factory';
import { detectIsDialog } from './dialog';
import { throwUnsupported } from '../utils';

export type StackProps = WithSlotProps<
  {
    currentIndex: number;
  } & WidgetProps
>;
export type StackRef = QDarkStack;

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
