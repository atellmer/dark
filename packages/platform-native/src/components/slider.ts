import { Slider as NSSlider } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { SliderAttributes } from '../jsx';
import { slider } from '../factory';

export type SliderProps = SliderAttributes;
export type SliderRef = NSSlider;

const Slider = forwardRef<SliderProps, SliderRef>(
  createComponent((props, ref) => {
    return slider({ ref, ...props });
  }),
);

export { Slider };
