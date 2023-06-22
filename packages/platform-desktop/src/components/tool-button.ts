import {
  type QWidget,
  type QIcon,
  type QSize,
  type QToolButtonSignals,
  type ToolButtonStyle,
  type ToolButtonPopupMode,
  type ArrowType,
  QToolButton,
} from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps, Container } from '../shared';
import { qToolButton } from '../factory';
import { throwUnsupported } from '../utils';
import { detectIsMenu } from './menu';

export type ToolButtonProps = WithPartialSlotProps<
  {
    text?: string;
    icon?: QIcon;
    iconSize?: QSize;
    toolButtonStyle?: ToolButtonStyle;
    popupMode?: ToolButtonPopupMode;
    arrowType?: ArrowType;
    autoRaise?: boolean;
  } & WidgetProps
>;
export type ToolButtonRef = QDarkToolButton;
export type ToolButtonSignals = QToolButtonSignals;

const ToolButton = forwardRef<ToolButtonProps, ToolButtonRef>(
  component((props, ref) => qToolButton({ ref, ...props }), { displayName: 'ToolButton' }),
) as ComponentFactory<ToolButtonProps, ToolButtonRef>;

class QDarkToolButton extends QToolButton implements Container {
  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (!detectIsMenu(child)) return;
    this.setMenu(child);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

export { ToolButton, QDarkToolButton };
