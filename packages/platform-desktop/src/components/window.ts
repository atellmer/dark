import { QMainWindow, QWidget, WindowState, type QIcon, type QMainWindowSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qMainWindow } from '../factory';
import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';
import { QDarkMenuBar } from './menu-bar';
import { throwUnsupported } from '../utils';

export type WindowProps = WithExtendedProps<
  {
    windowTitle: string;
    windowOpacity?: number;
    windowIcon?: QIcon;
    windowState?: WindowState;
  } & WidgetProps
>;
export type WindowRef = QDarkMainWindow;
export type MainWindowSignals = QMainWindowSignals;

const Window = forwardRef<WindowProps, WindowRef>(
  component((props, ref) => qMainWindow({ ref, ...props }), { displayName: 'Window' }),
) as ComponentFactory<WindowProps, WindowRef>;

class QDarkMainWindow extends QMainWindow implements Container {
  isContainer = true;

  constructor() {
    super();
    this.show();
  }

  appendChild(child: QWidget) {
    if (child instanceof QDarkMenuBar) {
      this.setMenuBar(child);
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
