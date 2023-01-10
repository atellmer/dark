import { Image as NSImage } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { ImageAttributes } from '../jsx';
import { factory } from '../factory';

export type ImageProps = ImageAttributes;
export type ImageRef = NSImage;

const image = factory('image');

const Image = forwardRef<ImageProps, ImageRef>(
  createComponent((props, ref) => {
    return image({ ref, ...props });
  }),
);

export { Image };
