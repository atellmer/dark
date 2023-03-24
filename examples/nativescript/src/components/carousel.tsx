/* eslint-disable @typescript-eslint/no-namespace */
import { h, component } from '@dark-engine/core';
import { registerElement } from '@dark-engine/platform-native';

registerElement('carousel', () => require('@nstudio/nativescript-carousel').Carousel);
registerElement('carousel-item', () => require('@nstudio/nativescript-carousel').CarouselItem);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      carousel: any;
      'carousel-item': any;
    }
  }
}

const MyCarousel = component(() => {
  return (
    <carousel height='100%' width='100%' showIndicator={false} onPageChanged={() => console.log('page changed')}>
      <carousel-item id='slide1' backgroundColor='red'>
        <flexbox-layout height='100%' width='100%' justifyContent='center' alignItems='center'>
          <label text='Slide 1' horizontalAlignment='center' />
        </flexbox-layout>
      </carousel-item>
      <carousel-item id='slide2' backgroundColor='blue'>
        <flexbox-layout height='100%' width='100%' justifyContent='center' alignItems='center'>
          <label text='Slide 2' horizontalAlignment='center' />
        </flexbox-layout>
      </carousel-item>
      <carousel-item id='slide3' backgroundColor='green'>
        <flexbox-layout height='100%' width='100%' justifyContent='center' alignItems='center'>
          <label text='Slide 3' horizontalAlignment='center' />
        </flexbox-layout>
      </carousel-item>
    </carousel>
  );
});

const App = component(() => {
  return (
    <frame>
      <page actionBarHidden>
        <MyCarousel />
      </page>
    </frame>
  );
});

export default App;
