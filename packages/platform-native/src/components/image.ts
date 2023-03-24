import type { Image as NSImage } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { ImageAttributes } from '../jsx';
import { image } from '../factory';

export type ImageProps = ImageAttributes;
export type ImageRef = NSImage;

const Image = forwardRef<ImageProps, ImageRef>(
  component((props, ref) => image({ ref, ...props }), { displayName: 'Image' }),
) as ComponentFactory<ImageProps, ImageRef>;

export { Image };
