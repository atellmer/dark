import { type QFontDialogSignals, type QFont, QFontDialog } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qFontDialog } from '../factory';

// const fontDialogEvents = useEvents<FontDialogSignals>(
//   {
//     fontSelected: (e: SyntheticEvent<QFont>) => console.log(e.value),
//   },
// );
// <FontDialog open={open} on={fontDialogEvents} />

export type FontDialogProps = WithStandardProps<
  {
    ref?: Ref<FontDialogRef>;
    open: boolean;
    currentFont?: QFont;
  } & WidgetProps
>;
export type FontDialogRef = QDarkFontDialog;
export type FontDialogSignals = QFontDialogSignals;

const FontDialog = component<FontDialogProps>(props => qFontDialog(props), {
  displayName: 'FontDialog',
}) as ComponentFactory<FontDialogProps>;

class QDarkFontDialog extends QFontDialog {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { FontDialog, QDarkFontDialog };
