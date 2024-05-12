import { type QIcon, type QSize, type QPushButtonSignals, QPushButton } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qPushButton } from '../factory';

// const buttonEvents = useEvents<PushButtonSignals>(
//   {
//     clicked: () => {},
//   },
// );
// <PushButton text='click me' on={buttonEvents} />

export type PushButtonProps = WithStandardProps<
  {
    ref?: Ref<PushButtonRef>;
    text?: string;
    icon?: QIcon;
    iconSize?: QSize;
    flat?: boolean;
  } & WidgetProps
>;
export type PushButtonRef = QDarkPushButton;
export type PushButtonSignals = QPushButtonSignals;

const PushButton = component<PushButtonProps>(props => qPushButton(props), {
  displayName: 'PushButton',
}) as ComponentFactory<PushButtonProps>;

class QDarkPushButton extends QPushButton {}

export { PushButton, QDarkPushButton };
