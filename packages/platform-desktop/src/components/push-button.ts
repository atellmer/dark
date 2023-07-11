import { type QIcon, type QSize, type QPushButtonSignals, QPushButton } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

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
    text?: string;
    icon?: QIcon;
    iconSize?: QSize;
    flat?: boolean;
  } & WidgetProps
>;
export type PushButtonRef = QDarkPushButton;
export type PushButtonSignals = QPushButtonSignals;

const PushButton = forwardRef<PushButtonProps, PushButtonRef>(
  component((props, ref) => qPushButton({ ref, ...props }), { displayName: 'PushButton' }),
) as ComponentFactory<PushButtonProps, PushButtonRef>;

class QDarkPushButton extends QPushButton {}

export { PushButton, QDarkPushButton };
