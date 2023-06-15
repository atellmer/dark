import { QWidget, QMenu, type QMenuSignals, type QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qMenu } from '../factory';
import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';
import { QDarkAction } from './action';
import { throwUnsupported } from '../utils';

export type MenuProps = WithExtendedProps<
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
  isContainer = true;

  appendChild(child: QWidget) {
    if (child instanceof QDarkAction) {
      this.addAction(child);
    } else {
      console.warn('Menu supports only Action as its children!');
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

export { Menu, QDarkMenu };
