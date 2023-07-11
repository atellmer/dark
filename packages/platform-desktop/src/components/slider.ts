import { type Orientation, type TickPosition, type QSliderSignals, QSlider } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qSlider } from '../factory';

// const sliderEvents = useEvents<SliderSignals>(
//   {
//     valueChanged: (e: SyntheticEvent<number>) => console.log(e.value)
//   },
// );
// <Slider value={value} orientation={Orientation.Horizontal} on={sliderEvents} />

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
