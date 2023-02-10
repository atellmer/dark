import type { Frame as NSFrame } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { FrameAttributes } from '../jsx';
import { frame } from '../factory';

export type FrameProps = FrameAttributes;
export type FrameRef = NSFrame;

const Frame = forwardRef<FrameProps, FrameRef>(
  createComponent((props, ref) => frame({ ref, ...props }), { displayName: 'Frame' }),
) as Component<FrameProps, FrameRef>;

export { Frame };
