import { QListWidgetItem, QIcon, CheckState, ItemFlag } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qListItem } from '../factory';

// <List>
//   <ListItem text='Item 1' />
//   <ListItem text='Item 2' />
//   <ListItem text='Item 3' />
// </List>

export type ListItemProps = WithStandardProps<
  {
    text?: string;
    icon?: QIcon;
    checkState?: CheckState;
    flags?: ItemFlag;
    selected?: boolean;
    toolTip?: boolean;
  } & WidgetProps
>;
export type ListItemRef = QListWidgetItem;

const ListItem = forwardRef<ListItemProps, ListItemRef>(
  component((props, ref) => qListItem({ ref, ...props }), { displayName: 'ListItem' }),
) as ComponentFactory<ListItemProps, ListItemRef>;

class QDarkListItem extends QListWidgetItem {}

export { ListItem, QDarkListItem };
