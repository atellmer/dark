import { QAction, type QActionSignals, type QIcon, type QKeySequence, type ShortcutContext } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qAction } from '../factory';

export type ActionProps = WithStandardProps<
  {
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

const Action = forwardRef<ActionProps, ActionRef>(
  component((props, ref) => qAction({ ref, ...props }), { displayName: 'Action' }),
) as ComponentFactory<ActionProps, ActionRef>;

class QDarkAction extends QAction {
  public setDisabled(value: boolean) {
    this.setEnabled(!value);
  }
}

export { Action, QDarkAction };
