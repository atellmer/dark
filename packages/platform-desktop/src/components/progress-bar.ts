import { QProgressBar, Orientation } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qProgressBar } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type ProgressBarProps = WithStandardProps<
  {
    value: number;
    maximum?: number;
    minimum?: number;
    orientation?: Orientation;
    textHidden?: boolean;
  } & WidgetProps
>;
export type ProgressBarRef = QProgressBar;

const ProgressBar = forwardRef<ProgressBarProps, ProgressBarRef>(
  component((props, ref) => qProgressBar({ ref, ...props }), { displayName: 'ProgressBar' }),
) as ComponentFactory<ProgressBarProps, ProgressBarRef>;

class QDarkProgressBar extends QProgressBar {
  setTextHidden(value: boolean) {
    this.setTextVisible(!value);
  }
}

export { ProgressBar, QDarkProgressBar };
