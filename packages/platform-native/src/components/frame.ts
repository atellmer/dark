import type { Frame as NSFrame } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { FrameAttributes } from '../jsx';
import { frame } from '../factory';

export type FrameProps = FrameAttributes;
export type FrameRef = NSFrame;

const Frame = forwardRef<FrameProps, FrameRef>(
  component((props, ref) => frame({ ref, ...props }), { displayName: 'Frame' }),
) as ComponentFactory<FrameProps, FrameRef>;

export { Frame };
