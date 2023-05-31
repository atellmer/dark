import { type QMainWindow, type QIcon, WindowState } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qMainWindow } from '../factory';
import type { WidgetProps, WithExtendedProps } from '../shared';

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

export { Window };
