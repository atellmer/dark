import { type QPushButton, type QIcon, type QSize } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qPushButton } from '../factory';
import { type WidgetProps } from '../shared';

export type ButtonProps = {
  text?: string;
  icon?: QIcon;
  iconSize?: QSize;
  flat?: boolean;
} & WidgetProps;

export type ButtonRef = QPushButton;

const Button = forwardRef<ButtonProps, ButtonRef>(
  component((props, ref) => qPushButton({ ref, ...props })),
) as ComponentFactory<ButtonProps, ButtonRef>;

export { Button };
