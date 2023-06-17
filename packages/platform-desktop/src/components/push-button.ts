import { QPushButton, type QIcon, type QSize, type QPushButtonSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qPushButton } from '../factory';

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
