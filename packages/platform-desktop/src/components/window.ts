import { type QMainWindow } from '@nodegui/nodegui';
import { type DarkElement, type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qMainWindow } from '../factory';
import { type Size } from '../shared';

export type WindowProps = {
  windowTitle: string;
  minSize?: Size;
  maxSize?: Size;
  slot: DarkElement;
};

export type WindowRef = QMainWindow;

const Window = forwardRef<WindowProps, WindowRef>(
  component((props, ref) => {
    return qMainWindow({ ref, ...props });
  }),
) as ComponentFactory<WindowProps, WindowRef>;

export { Window };
