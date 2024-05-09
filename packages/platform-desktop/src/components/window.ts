import { type QIcon, type QMainWindowSignals, QMainWindow, QWidget, WindowState } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qMainWindow } from '../factory';
import { detectIsMenuBar } from './menu-bar';
import { detectIsStatusBar } from './status-bar';
import { detectIsSystemTrayIcon } from './system-tray-icon';
import { throwUnsupported } from '../utils';

// <Window windowTitle='App' windowIcon={winIcon} width={400} height={400} styleSheet={style.root}>
//   <BoxLayout direction={Direction.TopToBottom}>
//     <Text>Content 1</Text>
//     <Text>Content 2</Text>
//   </BoxLayout>
// </Window>

export type WindowProps = WithSlotProps<
  {
    ref?: Ref<WindowRef>;
    windowTitle?: string;
    windowOpacity?: number;
    windowIcon?: QIcon;
    windowRole?: string;
    windowState?: WindowState;
  } & WidgetProps
>;
export type WindowRef = QDarkMainWindow;
export type MainWindowSignals = QMainWindowSignals;

const Window = component<WindowProps>(props => qMainWindow(props), {
  displayName: 'Window',
}) as ComponentFactory<WindowProps>;

class QDarkMainWindow extends QMainWindow implements Container {
  constructor() {
    super();
    this.show();
  }

  detectIsContainer() {
    return true;
  }

  appendChild(child: QWidget) {
    if (detectIsSystemTrayIcon(child)) return;
    if (detectIsMenuBar(child)) {
      this.setMenuBar(child);
    } else if (detectIsStatusBar(child)) {
      this.setStatusBar(child);
    } else {
      this.setCentralWidget(child);
    }
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild(child: QWidget) {
    child.close();
  }
}

export { Window, QDarkMainWindow };
