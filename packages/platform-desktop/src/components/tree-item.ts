import { type QIcon, QWidget, QTreeWidgetItem } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WithPartialSlotProps, Container } from '../shared';
import { qTreeItem } from '../factory';
import { throwUnsupported } from '../utils';

// <Tree headerLabels={['Column 1', 'Column 2', '3']}>
//   <TreeItem value={['Item 1', 'Value 1']} />
//   <TreeItem value={['Item 2', 'Value 2']}>
//     <TreeItem value={['Item 2:1', 'Value 2:1']} />
//     <TreeItem value={['Item 2:2', 'Value 2:2']} />
//   </TreeItem>
//   <TreeItem value={['Item 3', 'Value 3']} />
// </Tree>

export type TreeItemProps = WithPartialSlotProps<{
  value: Array<string>;
  icon?: QIcon;
  expanded?: boolean;
}>;
export type TreeItemRef = QDarkTreeItem;

const TreeItem = forwardRef<TreeItemProps, TreeItemRef>(
  component((props, ref) => qTreeItem({ ref, ...props }), { displayName: 'TreeItem' }),
) as ComponentFactory<TreeItemProps, TreeItemRef>;

class QDarkTreeItem extends QTreeWidgetItem implements Container {
  detectIsContainer() {
    return true;
  }

  setValue(value: Array<string>) {
    value.forEach((x, idx) => this.setText(idx, x));
  }

  appendChild(child: QWidget) {
    if (!detectIsTreeItem(child)) return;
    this.addChild(child);
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild() {
    throwUnsupported(this);
  }
}

function detectIsTreeItem(value: unknown): value is QDarkTreeItem {
  return value instanceof QDarkTreeItem;
}

export { TreeItem, QDarkTreeItem, detectIsTreeItem };
