import { type Orientation, type QProgressBarSignals, QProgressBar } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qProgressBar } from '../factory';

// <ProgressBar value={45} textHidden />

export type ProgressBarProps = WithStandardProps<
  {
    ref?: Ref<ProgressBarRef>;
    value: number;
    maximum?: number;
    minimum?: number;
    orientation?: Orientation;
    textHidden?: boolean;
  } & WidgetProps
>;
export type ProgressBarRef = QDarkProgressBar;
export type ProgressBarSignals = QProgressBarSignals;

const ProgressBar = component<ProgressBarProps>(props => qProgressBar(props), {
  displayName: 'ProgressBar',
}) as ComponentFactory<ProgressBarProps>;

class QDarkProgressBar extends QProgressBar {
  setTextHidden(value: boolean) {
    this.setTextVisible(!value);
  }
}

export { ProgressBar, QDarkProgressBar };
