import { type QMenuSignals, type QIcon, QWidget, QMenu } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qMenu } from '../factory';
import { QDarkAction } from './action';
import { throwUnsupported } from '../utils';

// <Menu title='File'>
//   <Action text='Open' />
//   <Action text='Create' />
//   <Action text='Save' />
// </Menu>

export type MenuProps = WithSlotProps<
  {
    title?: string;
    icon?: QIcon;
  } & WidgetProps
>;
export type MenuRef = QDarkMenu;
export type MenuSignals = QMenuSignals;

const Menu = forwardRef<MenuProps, MenuRef>(
  component((props, ref) => qMenu({ ref, ...props }), { displayName: 'Menu' }),
) as ComponentFactory<MenuProps, MenuRef>;

class QDarkMenu extends QMenu implements Container {
  detectIsContainer() {
    return true;
  }

  appendChild(child: QWidget) {
    if (child instanceof QDarkAction) {
      this.addAction(child);
    } else {
      console.warn('Menu supports only Action as its children!');
      throwUnsupported(this);
    }
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild(child: QWidget) {
    if (child instanceof QDarkAction) {
      this.removeAction(child);
    }
  }
}

function detectIsMenu(value: unknown): value is QDarkMenu {
  return value instanceof QDarkMenu;
}

export { Menu, QDarkMenu, detectIsMenu };
