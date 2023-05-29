import { type QMainWindow, type QIcon, WindowState } from '@nodegui/nodegui';
import { type DarkElement, type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qMainWindow } from '../factory';
import { type WidgetProps } from '../shared';

export type WindowProps = {
  windowTitle: string;
  windowOpacity?: number;
  windowIcon?: QIcon;
  windowState?: WindowState;
  slot: DarkElement;
} & WidgetProps;

export type WindowRef = QMainWindow;

const Window = forwardRef<WindowProps, WindowRef>(
  component((props, ref) => qMainWindow({ ref, ...props })),
) as ComponentFactory<WindowProps, WindowRef>;

export { Window };
