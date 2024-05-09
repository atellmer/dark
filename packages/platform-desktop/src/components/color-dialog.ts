import { type QColorDialogSignals, QColorDialog, QColor } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qColorDialog } from '../factory';

// const colorDialogEvents = useEvents<ColorDialogSignals>(
//   {
//     colorSelected: (e: SyntheticEvent<QColor>) => console.log(e.value),
//   },
// );
// <ColorDialog open={open} on={colorDialogEvents} />

export type ColorDialogProps = WithStandardProps<
  {
    ref?: Ref<ColorDialogRef>;
    open: boolean;
    currentColor?: QColor;
  } & WidgetProps
>;
export type ColorDialogRef = QDarkColorDialog;
export type ColorDialogSignals = QColorDialogSignals;

const ColorDialog = component<ColorDialogProps>(props => qColorDialog(props), {
  displayName: 'ColorDialog',
}) as ComponentFactory<ColorDialogProps>;

class QDarkColorDialog extends QColorDialog {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { ColorDialog, QDarkColorDialog };
