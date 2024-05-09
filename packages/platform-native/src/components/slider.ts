import type { Slider as NSSlider } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { SliderAttributes } from '../jsx';
import { slider } from '../factory';

export type SliderProps = {
  ref?: Ref<SliderRef>;
} & SliderAttributes;
export type SliderRef = NSSlider;

const Slider = component<SliderProps>(props => slider(props), {
  displayName: 'Slider',
}) as ComponentFactory<SliderProps>;

export { Slider };
