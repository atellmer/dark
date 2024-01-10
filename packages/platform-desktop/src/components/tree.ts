import { type QTreeWidgetSignals, QWidget, QTreeWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qTree } from '../factory';
import { detectIsTreeItem } from './tree-item';
import { throwUnsupported } from '../utils';

// <Tree headerLabels={['Column 1', 'Column 2', '3']}>
//   <TreeItem value={['Item 1', 'Value 1']} />
//   <TreeItem value={['Item 2', 'Value 2']}>
//     <TreeItem value={['Item 2:1', 'Value 2:1']} />
//     <TreeItem value={['Item 2:2', 'Value 2:2']} />
//   </TreeItem>
//   <TreeItem value={['Item 3', 'Value 3']} />
// </Tree>

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
  detectIsContainer() {
    return true;
  }

  setColWidth(value: Array<number>) {
    value.forEach((x, idx) => this.setColumnWidth(idx, x));
  }

  appendChild(child: QWidget) {
    if (!detectIsTreeItem(child)) return;
    this.addTopLevelItem(child);
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild() {
    throwUnsupported(this);
  }
}

export { Tree, QDarkTree };
