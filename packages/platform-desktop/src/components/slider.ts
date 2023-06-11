import { QSlider, Orientation, TickPosition } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qSlider } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

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

const Slider = forwardRef<SliderProps, SliderRef>(
  component((props, ref) => qSlider({ ref, ...props }), { displayName: 'Slider' }),
) as ComponentFactory<SliderProps, SliderRef>;

class QDarkSlider extends QSlider {}

export { Slider, QDarkSlider };
