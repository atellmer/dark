import { type QActionSignals, type QIcon, type QKeySequence, type ShortcutContext, QAction } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qAction } from '../factory';

// const actionEvents = useEvents<ActionSignals>(
//   {
//     triggered: () => {},
//   },
// );
// <Menu title='File'>
//   <Action text='Open' on={actionEvents} />
//   <Action text='Create' on={actionEvents} />
//   <Action text='Save' on={actionEvents} />
// </Menu>

export type ActionProps = WithStandardProps<
  {
    ref?: Ref<ActionRef>;
    text?: string;
    icon?: QIcon;
    disabled?: boolean;
    separator?: boolean;
    shortcut?: QKeySequence;
    shortcutContext?: ShortcutContext;
  } & WidgetProps
>;
export type ActionRef = QDarkAction;
export type ActionSignals = QActionSignals;

const Action = component<ActionProps>(props => qAction(props), {
  displayName: 'Action',
}) as ComponentFactory<ActionProps>;

class QDarkAction extends QAction {
  setDisabled(value: boolean) {
    this.setEnabled(!value);
  }
}

export { Action, QDarkAction };
