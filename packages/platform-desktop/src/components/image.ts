import { QLabel, QPixmap, AspectRatioMode, TransformationMode } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';
import fetch from 'node-fetch';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qImage } from '../factory';
import { detectisValidURL } from '../utils';

export type ImageProps = WithStandardProps<
  {
    src?: string;
    buffer?: Buffer;
    aspectRatioMode?: AspectRatioMode;
    transformationMode?: TransformationMode;
  } & WidgetProps
>;
export type ImageRef = QLabel;

const Image = forwardRef<ImageProps, ImageRef>(
  component((props, ref) => qImage({ ref, ...props }), { displayName: 'Image' }),
) as ComponentFactory<ImageProps, ImageRef>;

class QImage extends QLabel {
  private aspectRatioMode: AspectRatioMode = AspectRatioMode.KeepAspectRatio;
  private transformationMode: TransformationMode = TransformationMode.FastTransformation;

  constructor() {
    super();
    this.setProperty('scaledContents', true);
  }

  public async setSrc(value: string) {
    if (!value) return;
    try {
      this.setPixmap(this.scale(await createPixmapFromPath(value)));
    } catch (error) {
      console.warn(error);
    }
  }

  public setBuffer(buffer: Buffer) {
    this.setPixmap(createPixmapFromBuffer(buffer));
  }

  public setAspectRatioMode(mode: AspectRatioMode) {
    this.aspectRatioMode = mode;
    this.fit();
  }

  public setTransformationMode(mode: TransformationMode) {
    this.transformationMode = mode;
    this.fit();
  }

  public fit() {
    if (!this.pixmap()) return;
    this.setPixmap(this.scale(this.pixmap()));
  }

  public scale(pixmap: QPixmap) {
    return pixmap.scaled(this.width(), this.height(), this.aspectRatioMode, this.transformationMode);
  }
}

async function createPixmapFromPath(src: string) {
  const pixmap = new QPixmap();

  if (detectisValidURL(src)) {
    const response = await fetch(src);
    const buffer = Buffer.from(await response.arrayBuffer());

    pixmap.loadFromData(buffer);
  } else {
    pixmap.load(src);
  }

  return pixmap;
}

function createPixmapFromBuffer(buffer: Buffer) {
  const pixmap = new QPixmap();

  pixmap.loadFromData(buffer);

  return pixmap;
}

export { Image, QImage };
