import { QColorDialog, QColor, type QColorDialogSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qColorDialog } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type ColorDialogProps = WithStandardProps<
  {
    open: boolean;
    currentColor?: QColor;
  } & WidgetProps
>;
export type ColorDialogRef = QDarkColorDialog;
export type ColorDialogSignals = QColorDialogSignals;

const ColorDialog = forwardRef<ColorDialogProps, ColorDialogRef>(
  component((props, ref) => qColorDialog({ ref, ...props }), { displayName: 'ColorDialog' }),
) as ComponentFactory<ColorDialogProps, ColorDialogRef>;

class QDarkColorDialog extends QColorDialog {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { ColorDialog, QDarkColorDialog };
