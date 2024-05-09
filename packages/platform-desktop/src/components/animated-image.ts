import { QLabel, QMovie } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';
import fetch from 'node-fetch';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qAnimatedImage } from '../factory';
import { detectisValidURL } from '../utils';

// <AnimatedImage src='https://media.giphy.com/media/fdHg7T902uzLy/giphy.gif' />

export type AnimatedImageProps = WithStandardProps<
  {
    ref?: Ref<AnimatedImageRef>;
    src?: string;
    buffer?: Buffer;
  } & WidgetProps
>;
export type AnimatedImageRef = QDarkAnimatedImage;

const AnimatedImage = component<AnimatedImageProps>(props => qAnimatedImage(props), {
  displayName: 'AnimatedImage',
}) as ComponentFactory<AnimatedImageProps>;

class QDarkAnimatedImage extends QLabel {
  constructor() {
    super();
    this.setProperty('scaledContents', true);
  }

  async setSrc(value: string) {
    if (!value) return;
    try {
      this.setMovie(await createMoviewFromPath(value));
      this.movie().start();
    } catch (error) {
      console.warn(error);
    }
  }

  setBuffer(buffer: Buffer) {
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

export { AnimatedImage, QDarkAnimatedImage };
