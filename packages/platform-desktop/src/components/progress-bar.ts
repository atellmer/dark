import { QProgressBar, type Orientation, type QProgressBarSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qProgressBar } from '../factory';

export type ProgressBarProps = WithStandardProps<
  {
    value: number;
    maximum?: number;
    minimum?: number;
    orientation?: Orientation;
    textHidden?: boolean;
  } & WidgetProps
>;
export type ProgressBarRef = QDarkProgressBar;
export type ProgressBarSignals = QProgressBarSignals;

const ProgressBar = forwardRef<ProgressBarProps, ProgressBarRef>(
  component((props, ref) => qProgressBar({ ref, ...props }), { displayName: 'ProgressBar' }),
) as ComponentFactory<ProgressBarProps, ProgressBarRef>;

class QDarkProgressBar extends QProgressBar {
  setTextHidden(value: boolean) {
    this.setTextVisible(!value);
  }
}

export { ProgressBar, QDarkProgressBar };
