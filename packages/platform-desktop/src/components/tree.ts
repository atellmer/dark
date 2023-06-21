import { QWidget, QTreeWidget, type QTreeWidgetSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qTree } from '../factory';
import { detectIsTreeItem } from './tree-item';
import { throwUnsupported } from '../utils';

export type TreeProps = WithSlotProps<
  {
    headerLabels: Array<string>;
    sortingEnabled?: boolean;
    colWidth?: Array<number>;
  } & WidgetProps
>;
export type TreeRef = QDarkTree;
export type TreeSignals = QTreeWidgetSignals;

const Tree = forwardRef<TreeProps, TreeRef>(
  component((props, ref) => qTree({ ref, ...props }), { displayName: 'Tree' }),
) as ComponentFactory<TreeProps, TreeRef>;

class QDarkTree extends QTreeWidget implements Container {
  public detectIsContainer() {
    return true;
  }

  public setColWidth(value: Array<number>) {
    value.forEach((x, idx) => this.setColumnWidth(idx, x));
  }

  public appendChild(child: QWidget) {
    if (!detectIsTreeItem(child)) return;
    this.addTopLevelItem(child);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

export { Tree, QDarkTree };
