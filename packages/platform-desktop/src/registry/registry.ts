import { QWidget, type QMainWindow, type QLayout } from '@nodegui/nodegui';
import { ROOT } from '@dark-engine/core';

import { type TagNativeElement, type AttributeValue } from '../native-element';
import { QFlexLayout } from '../components/view';
import { QImage } from '../components/image';

export const enum NGViewFlag {
  NO_CHILDREN = 'NO_CHILDREN',
}

export type NGElement = QWidget | QLayout;

export type NGElementMeta = {
  flag?: NGViewFlag;
  isRoot?: boolean;
  attrSetter?: (element: TagNativeElement, name: string, value: AttributeValue) => void;
  setup?: (element: TagNativeElement) => void;
  add?: (childElement: TagNativeElement, parentElement: TagNativeElement, idx?: number) => void;
  remove?: (childElement: TagNativeElement, parentElement: TagNativeElement) => void;
};

type NGElementFactory = {
  create?: () => NGElement;
  meta?: NGElementMeta;
};

const viewMap: Record<string, NGElementFactory> = {};

function registerElement(name: string, getType: () => new () => NGElement, meta: NGElementMeta = {}) {
  viewMap[name] = {
    create: () => {
      const type = getType();

      return type ? new type() : null;
    },
    meta,
  };
}

function getElementFactory(name: string): NGElementFactory {
  const factory = viewMap[name] || null;

  if (!factory) {
    throw new Error(`[Dark]: Element with name ${name} is not registered!`);
  }

  return factory;
}

registerElement(ROOT, () => null, { isRoot: true });
registerElement('q:main-window', () => require('@nodegui/nodegui/dist/lib/QtWidgets/QMainWindow').QMainWindow, {
  setup(element) {
    const window = element.getNativeView() as QMainWindow;

    window.show();
  },
  add(childElement, parentElement) {
    const window = parentElement.getNativeView() as QMainWindow;
    const content = childElement.getNativeView() as QWidget;

    window.setCentralWidget(content);
  },
});
registerElement('q:push-button', () => require('@nodegui/nodegui/dist/lib/QtWidgets/QPushButton').QPushButton);
registerElement('q:label', () => require('@nodegui/nodegui/dist/lib/QtWidgets/QLabel').QLabel);
registerElement('q:flex-layout', () => QFlexLayout);
registerElement('q:image', () => QImage, { flag: NGViewFlag.NO_CHILDREN });

export { getElementFactory, registerElement };
