import type { Image as NSImage } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ImageAttributes } from '../jsx';
import { image } from '../factory';

export type ImageProps = {
  ref?: Ref<ImageRef>;
} & ImageAttributes;
export type ImageRef = NSImage;

const Image = component<ImageProps>(props => image(props), { displayName: 'Image' }) as ComponentFactory<ImageProps>;

export { Image };
