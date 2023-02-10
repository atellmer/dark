import type { Image as NSImage } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { ImageAttributes } from '../jsx';
import { image } from '../factory';

export type ImageProps = ImageAttributes;
export type ImageRef = NSImage;

const Image = forwardRef<ImageProps, ImageRef>(
  createComponent((props, ref) => image({ ref, ...props }), { displayName: 'Image' }),
) as Component<ImageProps, ImageRef>;

export { Image };
