import { Image as NSImage } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { ImageAttributes } from '../jsx';
import type { TagNativeElement } from '../native-element';

export type ImageProps = {} & ImageAttributes;

export type ImageRef = TagNativeElement<NSImage>;

const Image = forwardRef<ImageProps, ImageRef>(
  createComponent((props, ref) => {
    return <image ref={ref} {...props} />;
  }),
);

export { Image };
