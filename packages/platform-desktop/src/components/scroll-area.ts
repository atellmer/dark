import { QWidget, QScrollArea, type QScrollAreaSignals, type ScrollBarPolicy } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qScrollArea } from '../factory';
import { throwUnsupported } from '../utils';

export type ScrollAreaProps = WithExtendedProps<
  {
    resizable?: boolean;
    horizontalScrollBarPolicy?: ScrollBarPolicy;
    verticalScrollBarPolicy?: ScrollBarPolicy;
  } & WidgetProps
>;
export type ScrollAreaRef = QDarkScrollArea;
export type ScrollAreaSignals = QScrollAreaSignals;

const ScrollArea = forwardRef<ScrollAreaProps, ScrollAreaRef>(
  component((props, ref) => qScrollArea({ ref, ...props }), { displayName: 'ScrollArea' }),
) as ComponentFactory<ScrollAreaProps, ScrollAreaRef>;

class QDarkScrollArea extends QScrollArea implements Container {
  constructor() {
    super();
    this.setResizable(true);
  }

  public detectIsContainer() {
    return true;
  }

  public setResizable(value: boolean) {
    this.setWidgetResizable(value);
  }

  public appendChild(child: QWidget) {
    const widget = this.widget();

    if (widget) {
      if (widget instanceof QDarkPlaceholder) {
        widget.close();
      } else {
        console.warn(`ScrollArea can't have more than one child node`);
        throwUnsupported(this);
      }
    }

    this.setWidget(child);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild(child: QWidget) {
    child.close();
    this.setWidget(new QDarkPlaceholder());
  }
}

class QDarkPlaceholder extends QWidget {}

export { ScrollArea, QDarkScrollArea };
