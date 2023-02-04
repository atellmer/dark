import type { Image as NSImage } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { ImageAttributes } from '../jsx';
import { image } from '../factory';

export type ImageProps = ImageAttributes;
export type ImageRef = NSImage;

const Image = forwardRef<ImageProps, ImageRef>(
  createComponent((props, ref) => {
    return image({ ref, ...props });
  }),
);

export { Image };
