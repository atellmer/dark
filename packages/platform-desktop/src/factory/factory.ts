import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

export const qMainWindow = factory('q:main-window');
export const qText = factory('q:text');
export const qPushButton = factory('q:push-button');
export const qImage = factory('q:image');
export const qAnimatedImage = factory('q:animated-image');
export const qScrollArea = factory('q:scroll-area');
export const qFlexLayout = factory('q:flex-layout');
export const qBoxLayout = factory('q:box-layout');
export const qLineEdit = factory('q:line-edit');
export const qDialog = factory('q:dialog');
export const qList = factory('q:list');
export const qListItem = factory('q:list-item');
export const qProgressBar = factory('q:progress-bar');
export const qSlider = factory('q:slider');
export const qCalendar = factory('q:calendar');
export const qSpinBox = factory('q:spin-box');
export const qCheckBox = factory('q:check-box');
export const qComboBox = factory('q:combo-box');
export const qPlainTextEdit = factory('q:plain-text-edit');
export const qDial = factory('q:dial');
export const qColorDialog = factory('q:color-dialog');
export const qErrorMessage = factory('q:error-message');
export const qFileDialog = factory('q:file-dialog');
export const qAction = factory('q:action');
export const qMenuBar = factory('q:menu-bar');
export const qMenu = factory('q:menu');
export const qFontDialog = factory('q:font-dialog');
