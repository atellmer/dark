import { QLabel, QMovie } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';
import fetch from 'node-fetch';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qAnimatedImage } from '../factory';
import { detectisValidURL } from '../utils';

export type AnimatedImageProps = WithStandardProps<
  {
    src?: string;
    buffer?: Buffer;
  } & WidgetProps
>;
export type AnimatedImageRef = QLabel;

const AnimatedImage = forwardRef<AnimatedImageProps, AnimatedImageRef>(
  component((props, ref) => qAnimatedImage({ ref, ...props }), { displayName: 'AnimatedImage' }),
) as ComponentFactory<AnimatedImageProps, AnimatedImageRef>;

class QAnimatedImage extends QLabel {
  constructor() {
    super();
    this.setProperty('scaledContents', true);
  }

  public async setSrc(value: string) {
    if (!value) return;
    try {
      this.setMovie(await createMoviewFromPath(value));
      this.movie().start();
    } catch (error) {
      console.warn(error);
    }
  }

  public setBuffer(buffer: Buffer) {
    this.setMovie(createMovieFromBuffer(buffer));
    this.movie().start();
  }
}

async function createMoviewFromPath(src: string) {
  const movie = new QMovie();

  if (detectisValidURL(src)) {
    const response = await fetch(src);
    const buffer = Buffer.from(await response.arrayBuffer());

    movie.loadFromData(buffer);
  } else {
    movie.setFileName(src);
  }

  return movie;
}

function createMovieFromBuffer(buffer: Buffer) {
  const movie = new QMovie();

  movie.loadFromData(buffer);

  return movie;
}

export { AnimatedImage, QAnimatedImage };
