import { QListWidgetItem, QIcon, CheckState, ItemFlag } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qListItem } from '../factory';

// <List>
//   <ListItem text='Item 1' />
//   <ListItem text='Item 2' />
//   <ListItem text='Item 3' />
// </List>

export type ListItemProps = WithStandardProps<
  {
    ref?: Ref<ListItemRef>;
    text?: string;
    icon?: QIcon;
    checkState?: CheckState;
    flags?: ItemFlag;
    selected?: boolean;
    toolTip?: boolean;
  } & WidgetProps
>;
export type ListItemRef = QListWidgetItem;

const ListItem = component<ListItemProps>(props => qListItem(props), {
  displayName: 'ListItem',
}) as ComponentFactory<ListItemProps>;

class QDarkListItem extends QListWidgetItem {}

export { ListItem, QDarkListItem };
