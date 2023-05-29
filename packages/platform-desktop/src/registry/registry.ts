import type { QWidget, QMainWindow } from '@nodegui/nodegui';
import { ROOT } from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';

export const enum NGViewFlag {
  LAYOUT_VIEW = 'LAYOUT_VIEW',
  NO_CHILDREN = 'NO_CHILDREN',
}

export type NGElement = QWidget;

export type NGElementMeta = {
  flag?: NGViewFlag;
  isRoot?: boolean;
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
    const content = childElement.getNativeView();

    window.setCentralWidget(content);
  },
});
registerElement('q:label', () => require('@nodegui/nodegui/dist/lib/QtWidgets/QLabel').QLabel);

export { getElementFactory, registerElement };
