import { type QColorDialogSignals, QColorDialog, QColor } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qColorDialog } from '../factory';

// const colorDialogEvents = useEventSystem<ColorDialogSignals>(
//   {
//     colorSelected: (e: SyntheticEvent<QColor>) => console.log(e.value),
//   },
//   [],
// );
// <ColorDialog open={open} on={colorDialogEvents} />

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
  public setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { ColorDialog, QDarkColorDialog };
