import { QWidget, QScrollArea, type QScrollAreaSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';
import { qScrollArea } from '../factory';
import { throwUnsupported } from '../utils';

export type ScrollAreaProps = WithExtendedProps<
  {
    resizable?: boolean;
  } & WidgetProps
>;
export type ScrollAreaRef = QDarkScrollArea;
export type ScrollAreaSignals = QScrollAreaSignals;

const ScrollArea = forwardRef<ScrollAreaProps, ScrollAreaRef>(
  component((props, ref) => qScrollArea({ ref, ...props }), { displayName: 'ScrollArea' }),
) as ComponentFactory<ScrollAreaProps, ScrollAreaRef>;

class QDarkScrollArea extends QScrollArea implements Container {
  isContainer = true;

  constructor() {
    super();
    this.setResizable(true);
  }

  setResizable(value: boolean) {
    this.setWidgetResizable(value);
  }

  appendChild(child: QWidget) {
    const widget = this.widget();

    if (widget) {
      if (widget instanceof QDarkPlaceholder) {
        widget.close();
      } else {
        console.warn(`ScrollArea can't have more than one child node`);
        return;
      }
    }

    this.setWidget(child);
  }

  removeChild(child: QWidget) {
    child.close();
    this.setWidget(new QDarkPlaceholder());
  }

  insertBefore() {
    throwUnsupported(this);
  }
}

class QDarkPlaceholder extends QWidget {}

export { ScrollArea, QDarkScrollArea };
