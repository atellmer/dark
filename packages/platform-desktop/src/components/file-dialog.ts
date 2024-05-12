import { type QFileDialogSignals, type FileMode, type AcceptMode, QFileDialog } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qFileDialog } from '../factory';

// const fileDialogEvents = useEvents<FileDialogSignals>(
//   {
//     fileSelected: (e: SyntheticEvent<string>) => console.log(e.value),
//   },
// );
// <FileDialog open={open} on={fileDialogEvents} />

export type FileDialogProps = WithStandardProps<
  {
    ref?: Ref<FileDialogRef>;
    open: boolean;
    fileMode?: FileMode;
    acceptMode?: AcceptMode;
    nameFilter?: string;
    supportedSchemes?: Array<string>;
    defaultSuffix?: string;
  } & WidgetProps
>;
export type FileDialogRef = QDarkFileDialog;
export type FileDialogSignals = QFileDialogSignals;

const FileDialog = component<FileDialogProps>(props => qFileDialog(props), {
  displayName: 'FileDialog',
}) as ComponentFactory<FileDialogProps>;

class QDarkFileDialog extends QFileDialog {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { FileDialog, QDarkFileDialog };
