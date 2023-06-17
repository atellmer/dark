import { QMainWindow, QWidget, WindowState, type QIcon, type QMainWindowSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qMainWindow } from '../factory';
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
  constructor() {
    super();
    this.show();
  }

  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (child instanceof QDarkMenuBar) {
      this.setMenuBar(child);
    } else {
      this.setCentralWidget(child);
    }
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild(child: QWidget) {
    child.close();
  }
}

export { Window, QDarkMainWindow };
