import { ROOT } from '@dark-engine/core';

import { type QElement } from '../shared';

type QElementFactory = {
  create?: () => QElement;
};

const viewMap: Record<string, QElementFactory> = {};

function registerElement(name: string, getType: () => new () => QElement) {
  viewMap[name] = {
    create: () => {
      const type = getType();

      return type ? new type() : null;
    },
  };
}

function getElementFactory(name: string): QElementFactory {
  const factory = viewMap[name] || null;

  if (!factory) {
    throw new Error(`[Dark]: Element with name ${name} is not registered!`);
  }

  return factory;
}

registerElement(ROOT, () => null);
registerElement('q:push-button', () => require('@nodegui/nodegui/dist/lib/QtWidgets/QPushButton').QPushButton);
registerElement('q:label', () => require('@nodegui/nodegui/dist/lib/QtWidgets/QLabel').QLabel);
registerElement('q:main-window', () => require('../components/window').QDarkMainWindow);
registerElement('q:flex-layout', () => require('../components/view').QDarkFlexLayout);
registerElement('q:image', () => require('../components/image').QDarkImage);
registerElement('q:animated-image', () => require('../components/animated-image').QAnimatedImage);
registerElement('q:scroll-area', () => require('../components/scroll-area').QDarkScrollArea);

export { getElementFactory, registerElement };
