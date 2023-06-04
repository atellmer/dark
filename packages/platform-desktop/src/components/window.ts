import { type QIcon, QMainWindow, QWidget, WindowState } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qMainWindow } from '../factory';
import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';

export type WindowProps = WithExtendedProps<
  {
    windowTitle: string;
    windowOpacity?: number;
    windowIcon?: QIcon;
    windowState?: WindowState;
  } & WidgetProps
>;
export type WindowRef = QMainWindow;

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
    this.setCentralWidget(child);
  }

  insertBefore() {}

  removeChild() {}
}

export { Window, QDarkMainWindow };
