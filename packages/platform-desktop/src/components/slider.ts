import { QSlider, type Orientation, type TickPosition, type QSliderSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qSlider } from '../factory';

export type SliderProps = WithStandardProps<
  {
    value: number;
    maximum?: number;
    minimum?: number;
    orientation?: Orientation;
    tickInterval?: number;
    tickPosition?: TickPosition;
  } & WidgetProps
>;
export type SliderRef = QDarkSlider;
export type SliderSignals = QSliderSignals;

const Slider = forwardRef<SliderProps, SliderRef>(
  component((props, ref) => qSlider({ ref, ...props }), { displayName: 'Slider' }),
) as ComponentFactory<SliderProps, SliderRef>;

class QDarkSlider extends QSlider {}

export { Slider, QDarkSlider };
