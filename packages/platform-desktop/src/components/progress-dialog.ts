import { QProgressDialog, type QProgressDialogSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qProgressDialog } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type ProgressDialogProps = WithStandardProps<
  {
    open: boolean;
    value: number;
    autoClose?: boolean;
    autoReset?: boolean;
    cancelButtonText?: string;
    labelText?: string;
    maximum?: number;
    minimum?: number;
    minimumDuration?: number;
    progressRange?: ProgressRange;
  } & WidgetProps
>;
export type ProgressDialogRef = QDarkProgressDialog;
export type ProgressDialogSignals = QProgressDialogSignals;
export type ProgressRange = {
  maximum: number;
  minimum: number;
};

const ProgressDialog = forwardRef<ProgressDialogProps, ProgressDialogRef>(
  component((props, ref) => qProgressDialog({ ref, ...props }), { displayName: 'ProgressDialog' }),
) as ComponentFactory<ProgressDialogProps, ProgressDialogRef>;

class QDarkProgressDialog extends QProgressDialog {
  setOpen(value: boolean) {
    value ? this.show() : this.close();
  }

  setProgressRange(value: ProgressRange) {
    this.setRange(value.maximum, value.minimum);
  }
}

export { ProgressDialog, QDarkProgressDialog };
