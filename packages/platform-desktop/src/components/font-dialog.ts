import { QFontDialog, type QFontDialogSignals, type QFont } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qFontDialog } from '../factory';

export type FontDialogProps = WithStandardProps<
  {
    open: boolean;
    currentFont?: QFont;
  } & WidgetProps
>;
export type FontDialogRef = QDarkFontDialog;
export type FontDialogSignals = QFontDialogSignals;

const FontDialog = forwardRef<FontDialogProps, FontDialogRef>(
  component((props, ref) => qFontDialog({ ref, ...props }), { displayName: 'FontDialog' }),
) as ComponentFactory<FontDialogProps, FontDialogRef>;

class QDarkFontDialog extends QFontDialog {
  public setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { FontDialog, QDarkFontDialog };
