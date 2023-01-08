import { h, createComponent } from '@dark-engine/core';
import { ImageAttributes } from '../jsx-typings';

export type ImageProps = {} & ImageAttributes;

const Image = createComponent<ImageProps>(props => {
  return <image {...props} />;
});

export { Image };
