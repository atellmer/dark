import { type QLCDNumberSignals, type Mode, type SegmentStyle, QLCDNumber } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qLCDNumber } from '../factory';

// <LCDNumber display={512} digitCount={3} />

export type LCDNumberProps = WithStandardProps<
  {
    display: number;
    digitCount: number;
    mode?: Mode;
    segmentStyle?: SegmentStyle;
    smallDecimalPoint?: boolean;
  } & WidgetProps
>;
export type LCDNumberRef = QDarkLCDNumber;
export type LCDNumberSignals = QLCDNumberSignals;

const LCDNumber = forwardRef<LCDNumberProps, LCDNumberRef>(
  component((props, ref) => qLCDNumber({ ref, ...props }), { displayName: 'LCDNumber' }),
) as ComponentFactory<LCDNumberProps, LCDNumberRef>;

class QDarkLCDNumber extends QLCDNumber {
  setDisplay(value: number) {
    this.display(value);
  }
}

export { LCDNumber, QDarkLCDNumber };
