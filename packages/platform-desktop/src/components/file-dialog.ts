import { type QFileDialogSignals, type FileMode, type AcceptMode, QFileDialog } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qFileDialog } from '../factory';

// const fileDialogEvents = useEventSystem<FileDialogSignals>(
//   {
//     fileSelected: (e: SyntheticEvent<string>) => console.log(e.value),
//   },
//   [],
// );
// <FileDialog open={open} on={fileDialogEvents} />

export type FileDialogProps = WithStandardProps<
  {
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

const FileDialog = forwardRef<FileDialogProps, FileDialogRef>(
  component((props, ref) => qFileDialog({ ref, ...props }), { displayName: 'FileDialog' }),
) as ComponentFactory<FileDialogProps, FileDialogRef>;

class QDarkFileDialog extends QFileDialog {
  public setOpen(value: boolean) {
    value ? this.show() : this.close();
  }
}

export { FileDialog, QDarkFileDialog };
