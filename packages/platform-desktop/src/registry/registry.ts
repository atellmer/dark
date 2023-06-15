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
registerElement('q:text', () => require('../components/text').QDarkText);
registerElement('q:push-button', () => require('../components/button').QDarkPushButton);
registerElement('q:main-window', () => require('../components/window').QDarkMainWindow);
registerElement('q:image', () => require('../components/image').QDarkImage);
registerElement('q:animated-image', () => require('../components/animated-image').QDarkAnimatedImage);
registerElement('q:scroll-area', () => require('../components/scroll-area').QDarkScrollArea);
registerElement('q:flex-layout', () => require('../components/view').QDarkFlexLayout);
registerElement('q:box-layout', () => require('../components/box-view').QDarkBoxLayout);
registerElement('q:line-edit', () => require('../components/line-edit').QDarkLineEdit);
registerElement('q:dialog', () => require('../components/dialog').QDarkDialog);
registerElement('q:list', () => require('../components/list').QDarkList);
registerElement('q:list-item', () => require('../components/list-item').QDarkListItem);
registerElement('q:progress-bar', () => require('../components/progress-bar').QDarkProgressBar);
registerElement('q:slider', () => require('../components/slider').QDarkSlider);
registerElement('q:calendar', () => require('../components/calendar').QDarkCalendar);
registerElement('q:spin-box', () => require('../components/spin-box').QDarkSpinBox);
registerElement('q:check-box', () => require('../components/check-box').QDarkCheckBox);
registerElement('q:combo-box', () => require('../components/combo-box').QDarkComboBox);
registerElement('q:plain-text-edit', () => require('../components/plain-text-edit').QDarkPlainTextEdit);
registerElement('q:dial', () => require('../components/dial').QDarkDial);
registerElement('q:color-dialog', () => require('../components/color-dialog').QDarkColorDialog);
registerElement('q:error-message', () => require('../components/error-message').QDarkErrorMessage);
registerElement('q:file-dialog', () => require('../components/file-dialog').QDarkFileDialog);
registerElement('q:action', () => require('../components/action').QDarkAction);
registerElement('q:menu-bar', () => require('../components/menu-bar').QDarkMenuBar);
registerElement('q:menu', () => require('../components/menu').QDarkMenu);

export { getElementFactory, registerElement };
