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
    throw new Error(`[Dark]: the element with name "${name}" is not registered!`);
  }

  return factory;
}

registerElement(ROOT, () => null);
registerElement('q:text', () => require('../components/text').QDarkText);
registerElement('q:push-button', () => require('../components/push-button').QDarkPushButton);
registerElement('q:main-window', () => require('../components/window').QDarkMainWindow);
registerElement('q:image', () => require('../components/image').QDarkImage);
registerElement('q:animated-image', () => require('../components/animated-image').QDarkAnimatedImage);
registerElement('q:scroll-area', () => require('../components/scroll-area').QDarkScrollArea);
registerElement('q:flex-layout', () => require('../components/flex-layout').QDarkFlexLayout);
registerElement('q:box-layout', () => require('../components/box-layout').QDarkBoxLayout);
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
registerElement('q:font-dialog', () => require('../components/font-dialog').QDarkFontDialog);
registerElement('q:input-dialog', () => require('../components/input-dialog').QDarkInputDialog);
registerElement('q:progress-dialog', () => require('../components/progress-dialog').QDarkProgressDialog);
registerElement('q:grid-layout', () => require('../components/grid-layout').QDarkGridLayout);
registerElement('q:grid-item', () => require('../components/grid-item').QDarkGridItem);
registerElement('q:tab', () => require('../components/tab').QDarkTab);
registerElement('q:tab-item', () => require('../components/tab-item').QDarkTabItem);
registerElement('q:table', () => require('../components/table').QDarkTable);
registerElement('q:table-item', () => require('../components/table-item').QDarkTableItem);
registerElement('q:system-tray-icon', () => require('../components/system-tray-icon').QDarkSystemTrayIcon);
registerElement('q:radio-button', () => require('../components/radio-button').QDarkRadioButton);
registerElement('q:text-browser', () => require('../components/text-browser').QDarkTextBrowser);
registerElement('q:date-edit', () => require('../components/date-edit').QDarkDateEdit);
registerElement('q:time-edit', () => require('../components/time-edit').QDarkTimeEdit);
registerElement('q:date-time-edit', () => require('../components/date-time-edit').QDarkDateTimeEdit);
registerElement('q:double-spin-box', () => require('../components/double-spin-box').QDarkDoubleSpinBox);
registerElement('q:svg', () => require('../components/svg').QDarkSvg);
registerElement('q:tree', () => require('../components/tree').QDarkTree);
registerElement('q:tree-item', () => require('../components/tree-item').QDarkTreeItem);
registerElement('q:stack', () => require('../components/stack').QDarkStack);
registerElement('q:group-box', () => require('../components/group-box').QDarkGroupBox);
registerElement('q:message-dialog', () => require('../components/message-dialog').QDarkMessageDialog);
registerElement('q:status-bar', () => require('../components/status-bar').QDarkStatusBar);
registerElement('q:tool-button', () => require('../components/tool-button').QDarkToolButton);
registerElement('q:splitter', () => require('../components/splitter').QDarkSplitter);
registerElement('q:lcd-number', () => require('../components/lcd-number').QDarkLCDNumber);

export { getElementFactory, registerElement };
