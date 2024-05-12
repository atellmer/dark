import { type QWidget, type QStatusBarSignals, QStatusBar } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qStatusBar } from '../factory';
import { detectIsDialog } from './dialog';

// <Window windowTitle='App'>
//   <StatusBar>
//     <Text>Some status</Text>
//   </StatusBar>
// </Window>

export type StatusBarProps = WithSlotProps<
  {
    ref?: Ref<StatusBarRef>;
    sizeGripEnabled?: boolean;
  } & WidgetProps
>;
export type StatusBarRef = QDarkStatusBar;
export type StatusBarSignals = QStatusBarSignals;

const StatusBar = component<StatusBarProps>(props => qStatusBar(props), {
  displayName: 'StatusBar',
}) as ComponentFactory<StatusBarProps>;

class QDarkStatusBar extends QStatusBar implements Container {
  constructor() {
    super();
    this.setSizeGripEnabled(false);
  }

  detectIsContainer() {
    return true;
  }

  appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.addWidget(child);
  }

  insertBefore(child: QWidget, _: QWidget, idx: number) {
    if (detectIsDialog(child)) return;
    this.insertWidget(idx, child);
  }

  removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.removeWidget(child);
    child.close();
  }
}

function detectIsStatusBar(value: unknown): value is QDarkStatusBar {
  return value instanceof QDarkStatusBar;
}

export { StatusBar, QDarkStatusBar, detectIsStatusBar };
