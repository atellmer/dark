import type { Slider as NSSlider } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { SliderAttributes } from '../jsx';
import { slider } from '../factory';

export type SliderProps = SliderAttributes;
export type SliderRef = NSSlider;

const Slider = forwardRef<SliderProps, SliderRef>(
  component((props, ref) => slider({ ref, ...props }), { displayName: 'Slider' }),
) as ComponentFactory<SliderProps, SliderRef>;

export { Slider };
