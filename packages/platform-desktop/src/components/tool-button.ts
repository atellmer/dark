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
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps, Container } from '../shared';
import { qToolButton } from '../factory';
import { throwUnsupported } from '../utils';
import { detectIsMenu } from './menu';

// <ToolButton text='Click me' popupMode={ToolButtonPopupMode.MenuButtonPopup}>
//   <Menu title='File'>
//     <Action text='Open' />
//     <Action text='Create' />
//     <Action text='Save' />
//   </Menu>
// </ToolButton>

export type ToolButtonProps = WithPartialSlotProps<
  {
    ref?: Ref<ToolButtonRef>;
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

const ToolButton = component<ToolButtonProps>(props => qToolButton(props), {
  displayName: 'ToolButton',
}) as ComponentFactory<ToolButtonProps>;

class QDarkToolButton extends QToolButton implements Container {
  detectIsContainer() {
    return true;
  }

  appendChild(child: QWidget) {
    if (!detectIsMenu(child)) return;
    this.setMenu(child);
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild() {
    throwUnsupported(this);
  }
}

export { ToolButton, QDarkToolButton };
