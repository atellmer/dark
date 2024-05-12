import { type Orientation, type TickPosition, type QSliderSignals, QSlider } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

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
    ref?: Ref<SliderRef>;
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

const Slider = component<SliderProps>(props => qSlider(props), {
  displayName: 'Slider',
}) as ComponentFactory<SliderProps>;

class QDarkSlider extends QSlider {}

export { Slider, QDarkSlider };
