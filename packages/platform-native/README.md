# @dark-engine/platform-native 🌒

Dark renderer to native platforms like Android and iOS via <a href="https://nativescript.org/" target="_blank">NativeScript</a>

NativeScript is a free and open-source framework for building native mobile apps using JavaScript, or any other language that can transpile to JavaScript, for iOS and Android platforms. It allows developers to write a single codebase for both platforms, resulting in native performance and access to device-specific APIs, while still leveraging familiar web development tools and paradigms.

[More about Dark](https://github.com/atellmer/dark)
[More about NativeScript](https://nativescript.org/)

## Installation
npm:
```
npm install @nativescript/core @dark-engine/core @dark-engine/platform-native
```
yarn:
```
yarn add @nativescript/core @dark-engine/core @dark-engine/platform-native
```

## Usage

```tsx
import { h, createComponent, useState } from '@dark-engine/core';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

   return (
    <flexbox-layout justifyContent='center' alignItems='center'>
      <button backgroundColor='purple' padding={16} onTap={() => setCount(count + 1)}>Fired {count} times</button>
    </flexbox-layout>
  );
});
```

Dark provides wrappers for all nativescript primitives as components. So you can write code above like this:
```tsx
import { h, createComponent, useState } from '@dark-engine/core';
import { FlexboxLayout, Button } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  return (
    <FlexboxLayout justifyContent='center' alignItems='center'>
      <Button backgroundColor='purple' padding={16} onTap={() => setCount(count + 1)}>Fired {count} times</Button>
    </FlexboxLayout>
  );
});
```

Also you can write any code without JSX:
```tsx
import { createComponent, useState } from '@dark-engine/core';
import { FlexboxLayout, Button } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  return FlexboxLayout({
    justifyContent: 'center',
    alignItems: 'center',
    slot: [
      Button({
        backgroundColor: 'purple',
        padding: 16,
        text: `Fired ${count} times`,
        onTap: () => setCount(count + 1),
      }),
    ],
  });
});
```

## Environment Setup

Full working examples with environment setup you can find <a href="https://github.com/atellmer/dark/tree/master/examples/native" target="_blank">here</a>

## API

```tsx
import {
  type SyntheticEvent,
  run,
  registerElement,
  factory,
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  TextField,
  Modal,
  ActionBar,
  ActionItem,
  NavigationButton,
  ActivityIndicator,
  RootLayout,
  AbsoluteLayout,
  StackLayout,
  FlexboxLayout,
  GridLayout,
  DockLayout,
  WrapLayout,
  ContentView,
  HtmlView,
  WebView,
  Slider,
  Switch,
  Placeholder,
  ListPicker,
  DatePicker,
  TimePicker,
  Label,
  TextView,
  FormattedString,
  Span,
  TabView,
  TabViewItem,
  Frame,
  Page,
} from '@dark-engine/platform-native';
```

## Mounting to native platform

To mount you app you need to use `run` function

```tsx
import { run } from '@dark-engine/platform-native';

import App from './components/app';

run(App());
```

## Layout system

The system for placing elements in the layout includes the following components:

```tsx
import {
  RootLayout,
  AbsoluteLayout,
  StackLayout,
  FlexboxLayout,
  GridLayout,
  DockLayout,
  WrapLayout,
} from '@dark-engine/platform-native';
```
To learn more about how they work, you can visit the <a href="https://docs.nativescript.org/ui-and-styling.html" target="_blank">nativescript documentation page</a>

## Connecting 3rd party plugins
In modern development, we can rarely do without third-party packages written by other developers. Therefore, we should always be able to include such plugins in our project.

Suppose you want to connect a third party carousel plugin `@nstudio/nativescript-carousel`

First of all you must install it in your app from npm:
```
npm i @nstudio/nativescript-carousel
```
Further, to register a new element, you need to use the `registerElement` function:
```tsx
import { registerElement } from '@dark-engine/platform-native';

registerElement('carousel', () => require('@nstudio/nativescript-carousel').Carousel);
registerElement('carousel-item', () => require('@nstudio/nativescript-carousel').CarouselItem);
```

Warning: you must include the element using lowercase to name the element. If the element name consists of more than one word, then you must separate them with hyphens.

To avoid typescript JSX errors you should add new items to JSX:

```tsx
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'carousel': any; //<-- describe carousel props here
      'carousel-item': any; //<-- describe carousel-item props here
    }
  }
}
```

After all this, a new plugin can be used like this:

```tsx
return (
  <carousel height='100%' width='100%'>
    <carousel-item id='slide1' backgroundColor='red'>
      <label text='Slide 1' />
    </carousel-item>
    <carousel-item id='slide1' backgroundColor='blue'>
      <label text='Slide 2' />
    </carousel-item>
    <carousel-item id='slide1' backgroundColor='green'>
      <label text='Slide 3' />
    </carousel-item>
  </carousel>
)
```

If you prefer to write nativescript components in PascalCase you need to wrap it with createComponent:

```tsx
import { createComponent } from '@dark-engine/core';
import { factory } from '@dark-engine/platform-native';


type CarouselProps = {};
type CarouselItemProps = {};

const carousel = factory('carousel');
const carouselItem = factory('carousel-item');

const Carousel = createComponent<CarouselProps>(props => carousel(props));
const CarouselItem = createComponent<CarouselItemProps>(props => carouselItem(props));

export { Carousel, CarouselItem };
```

Somewhere in your awesome code:

```tsx
import { Label } from '@dark-engine/platform-native';
import { Carousel, CarouselItem } from '@my-ui-kit';

return (
  <Carousel height='100%' width='100%'>
    <CarouselItem id='slide1' backgroundColor='red'>
      <Label text='Slide 1' />
    </CarouselItem>
    <CarouselItem id='slide1' backgroundColor='blue'>
      <Label text='Slide 2' />
    </CarouselItem>
    <CarouselItem id='slide1' backgroundColor='green'>
      <Label text='Slide 3' />
    </CarouselItem>
  </Carousel>
);
```

## Additional components

Dark includes additional components of type `View`, `Text`, `TouchableOpacity`, `Modal` so that you can write an application in a almost similar to React Native style.

```tsx
import { h, createComponent } from '@dark-engine/core';
import { View, Text, TouchableOpacity } from '@dark-engine/platform-native';

const App = createComponent(() => {
  return (
    <View justifyContent='center'>
      <TouchableOpacity padding={32} backgroundColor='#4caf50' onPress={() => console.log('press')}>
        <Text textAlignment='center'>Press me</Text>
      </TouchableOpacity>
    </View>
  );
});

```

## Navigation

Any more or less complex application needs to be divided into several pages and navigate between them. Dark provides a package for this called `@dark-engine/native-navigation`, which implements navigation using `StackNavigator` and `TabNavigator`. This router also supports nested navigation and parameter passing.

```tsx
import { NavigationContainer, StackNavigator } from '@dark-engine/native-navigation';

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <StackNavigator.Root>
        <StackNavigator.Screen name='Feed' component={Feed} />
        <StackNavigator.Screen name='Friends' component={Friends} />
        <StackNavigator.Screen name='Profile' component={Profile} />
        <StackNavigator.Screen name='Settings' component={Settings} />
      </StackNavigator.Root>
    </NavigationContainer>
  );
});
```

Full documentation about this package you can find [here](https://github.com/atellmer/dark/packages/native-navigation)

MIT © [Alex Plex](https://github.com/atellmer)
