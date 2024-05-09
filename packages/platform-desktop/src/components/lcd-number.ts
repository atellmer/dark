import { type QLCDNumberSignals, type Mode, type SegmentStyle, QLCDNumber } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qLCDNumber } from '../factory';

// <LCDNumber display={512} digitCount={3} />

export type LCDNumberProps = WithStandardProps<
  {
    ref?: Ref<LCDNumberRef>;
    display: number;
    digitCount: number;
    mode?: Mode;
    segmentStyle?: SegmentStyle;
    smallDecimalPoint?: boolean;
  } & WidgetProps
>;
export type LCDNumberRef = QDarkLCDNumber;
export type LCDNumberSignals = QLCDNumberSignals;

const LCDNumber = component<LCDNumberProps>(props => qLCDNumber(props), {
  displayName: 'LCDNumber',
}) as ComponentFactory<LCDNumberProps>;

class QDarkLCDNumber extends QLCDNumber {
  setDisplay(value: number) {
    this.display(value);
  }
}

export { LCDNumber, QDarkLCDNumber };
