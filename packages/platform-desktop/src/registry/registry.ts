import type { QWidget } from '@nodegui/nodegui';
import { ROOT } from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';

export const enum NSViewFlag {
  LAYOUT_VIEW = 'LAYOUT_VIEW',
  NO_CHILDREN = 'NO_CHILDREN',
}

export type NGElement = QWidget;

export type NGElementMeta = {
  flag?: NSViewFlag;
  isRoot?: boolean;
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

export { getElementFactory, registerElement };
