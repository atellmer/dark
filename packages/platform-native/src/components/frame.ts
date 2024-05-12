import type { Frame as NSFrame } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { FrameAttributes } from '../jsx';
import { frame } from '../factory';

export type FrameProps = {
  ref?: Ref<FrameRef>;
} & FrameAttributes;
export type FrameRef = NSFrame;

const Frame = component<FrameProps>(props => frame(props), { displayName: 'Frame' }) as ComponentFactory<FrameProps>;

export { Frame };
