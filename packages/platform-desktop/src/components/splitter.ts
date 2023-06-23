import { type QWidget, type QSplitterSignals, QSplitter, Orientation } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps, Container } from '../shared';
import { qSplitter } from '../factory';
import { throwUnsupported } from '../utils';
import { detectIsDialog } from './dialog';

// <BoxLayout>
//   <Splitter>
//     <Text style={`background-color: red;`}>Content 1</Text>
//     <Text style={`background-color: yellow;`}>Content 2</Text>
//     <Text style={`background-color: green;`}>Content 3</Text>
//   </Splitter>
// </BoxLayout>

export type SplitterProps = WithPartialSlotProps<
  {
    orientation?: Orientation;
    collapse?: Array<boolean>;
  } & WidgetProps
>;
export type SplitterRef = QDarkSplitter;
export type SplitterSignals = QSplitterSignals;

const Splitter = forwardRef<SplitterProps, SplitterRef>(
  component((props, ref) => qSplitter({ ref, ...props }), { displayName: 'Splitter' }),
) as ComponentFactory<SplitterProps, SplitterRef>;

class QDarkSplitter extends QSplitter implements Container {
  constructor() {
    super();
    this.setOrientation(Orientation.Horizontal);
  }

  public detectIsContainer() {
    return true;
  }

  public setCollapse(collapse: Array<boolean>) {
    collapse.forEach((x, idx) => this.setCollapsible(idx, x));
  }

  public appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.addWidget(child);
    this.setCollapsible(this.indexOf(child), false);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

export { Splitter, QDarkSplitter };
