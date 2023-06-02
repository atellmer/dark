import { QScrollArea, QWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps } from '../shared';
import { qScrollArea } from '../factory';

export type ScrollAreaProps = WithExtendedProps<
  {
    resizable?: boolean;
  } & WidgetProps
>;
export type ScrollAreaRef = QScrollArea;

const ScrollArea = forwardRef<ScrollAreaProps, ScrollAreaRef>(
  component((props, ref) => qScrollArea({ ref, ...props }), { displayName: 'ScrollArea' }),
) as ComponentFactory<ScrollAreaProps, ScrollAreaRef>;

class QDarkScrollArea extends QScrollArea {
  constructor() {
    super();
    this.setResizable(true);
  }

  setResizable(value: boolean) {
    this.setWidgetResizable(value);
  }
}

class QDarkPlaceholder extends QWidget {
  constructor() {
    super();
  }
}

export { ScrollArea, QDarkScrollArea, QDarkPlaceholder };
