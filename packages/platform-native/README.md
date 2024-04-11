# @dark-engine/platform-native 🌖

Dark renderer to mobile platforms like Android and iOS via [NativeScript](https://nativescript.org/).

NativeScript is a free and open-source framework for building native mobile apps using JavaScript, or any other language that can transpile to JavaScript, for iOS and Android platforms. It allows developers to write a single codebase for both platforms, resulting in native performance and access to device-specific APIs, while still leveraging familiar web development tools and paradigms.

[More about Dark](https://github.com/atellmer/dark)

[app.webm](https://github.com/atellmer/dark/assets/16635118/d295001b-3abd-4c62-b985-e4428118645c)

## Installation

Install `NativeScript` according to the instructions [here](https://docs.nativescript.org/setup/)

from template:
```
npx degit github:atellmer/dark/templates/native app
```
```
cd app
npm i
npm start
```

npm:
```
npm install @nativescript/core @dark-engine/core @dark-engine/animations @dark-engine/platform-native
```

yarn:
```
yarn add @nativescript/core @dark-engine/core @dark-engine/animations @dark-engine/platform-native
```

## Usage
```tsx
import { component, useState } from '@dark-engine/core';
import { FlexboxLayout, Button } from '@dark-engine/platform-native';

const App = component(() => {
  const [count, setCount] = useState(0);

  return (
    <FlexboxLayout justifyContent='center' alignItems='center'>
      <Button
        backgroundColor='purple'
        padding={16}
        onTap={() => setCount(count + 1)}>
        Fired {count} times
      </Button>
    </FlexboxLayout>
  );
});
```
Also you can write any code without JSX:
```tsx
import { component, useState } from '@dark-engine/core';
import { FlexboxLayout, Button } from '@dark-engine/platform-native';

const App = component(() => {
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

Full working examples with environment setup you can find [here](https://github.com/atellmer/dark/tree/master/templates/native) or just install it from template.

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
  ListView,
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
  VERSION,
} from '@dark-engine/platform-native';
```

## Mounting to native platform

To mount you app you need to use `run` function:

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

To learn more about how they work, you can visit the [NativeScript documentation](https://docs.nativescript.org/ui/).

## Conditional rendering

You can use conditional rendering, but be aware that NativeScript is sensitive to frequent insertions and removals from the element tree. Therefore, whenever possible, an alternative approach should be used - the hidden and visible attributes, more about which can be found in the [NativeScript documentation](https://docs.nativescript.org/best-practices/if-things.html#from-various-frontend-framework-flavors).

```tsx
// variant 1
return (
  <>
    {
      isFetching
      ? <FlexboxLayout
          height='100%'
          justifyContent='center'
          alignItems='center'>
          <ActivityIndicator busy />
        </FlexboxLayout>
      : <StackLayout>
          <Label>Hello 🥰</Label>
        </StackLayout>
    }
  </>
);
```

```tsx
// variant 2
return (
  <>
    <FlexboxLayout
      hidden={!isFetching}
      height='100%'
      justifyContent='center'
      alignItems='center'>
      <ActivityIndicator busy />
    </FlexboxLayout>
    <StackLayout hidden={isFetching}>
      <Label>Hello 🥰</Label>
    </StackLayout>
  </>
);
```

## List rendering

In order to display lists of items, it is recommended to use the ListView component, which implements the virtual list behavior when only those items that are inside the viewport are rendered. Of course, you can also use normal rendering via `map`, however, in terms of performance, NativeScript is very sensitive to the number of elements in the application, as well as inserting and removing them from the tree. Therefore, virtualization should be used as much as possible.

```tsx
import { ListView } from '@dark-engine/platform-native';
```

```tsx
return (
  <ListView
    height='100%'
    items={items}
    onItemTap={() => console.log('tapped!')}>
    {({ item, idx }) => {
      return (
        <StackLayout backgroundColor={idx % 2 ? 'red' : 'yellow'}>
          <Label color={idx % 2 ? 'white' : 'black'}>item #{item}</Label>
        </StackLayout>
      );
    }}
  </ListView>
);
```

## Connecting 3rd party plugins
In modern development, we can rarely do without third-party packages written by other developers. Therefore, we should always be able to include such plugins in our project.

Suppose you want to connect a third party carousel plugin `@nstudio/nativescript-carousel`

First of all you must install it in your app from npm:
```
npm i @nstudio/nativescript-carousel
```
Further, to register a new element, you need to use the `registerElement` function:
```tsx
import { component } from '@dark-engine/core';
import { registerElement, factory } from '@dark-engine/platform-native';

registerElement('ns:carousel', () => require('@nstudio/nativescript-carousel').Carousel);
registerElement('ns:carousel-item', () => require('@nstudio/nativescript-carousel').CarouselItem);

type CarouselProps = {};
type CarouselItemProps = {};

const carousel = factory('ns:carousel');
const Carousel = component<CarouselProps>(props => carousel(props));

const carouselItem = factory('ns:carousel-item');
const CarouselItem = component<CarouselItemProps>(props => carouselItem(props));

export { Carousel, CarouselItem };
```

After all this, a new plugin can be used like this::

```tsx
import { Label } from '@dark-engine/platform-native';
import { Carousel, CarouselItem } from '@my-ui-kit';

return (
  <Carousel height='100%' width='100%'>
    <CarouselItem id='slide1' backgroundColor='red'>
      <Label text='Slide 1' />
    </CarouselItem>
    <CarouselItem id='slide2' backgroundColor='blue'>
      <Label text='Slide 2' />
    </CarouselItem>
    <CarouselItem id='slide3' backgroundColor='green'>
      <Label text='Slide 3' />
    </CarouselItem>
  </Carousel>
);
```

## Modals

To insert content in modal window you need to use a special component `Modal`:

```tsx
import { Modal } from '@dark-engine/platform-native';
```

```tsx
const [isOpen, setIsOpen] = useState(false);

return (
  <Modal isOpen={isOpen} animated onRequestClose={() => setIsOpen(false)}>
    <StackLayout padding={32}>
      <Label>Hello from Modal</Label>
    </StackLayout>
  </Modal>
);
```

## Additional components

Dark includes additional components of type `View`, `Text`, `TouchableOpacity`, so that you can write an application in a almost similar to React Native style.

```tsx
import { component } from '@dark-engine/core';
import { View, Text, TouchableOpacity } from '@dark-engine/platform-native';

const App = component(() => {
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

Any more or less complex application needs to be divided into several pages and navigate between them. Dark provides a package for this called `@dark-engine/native-navigation`, which implements navigation using `StackNavigator` and `TabNavigator`. This router also supports animated transitions, nested navigation and parameter passing.

```tsx
import { NavigationContainer, StackNavigator } from '@dark-engine/native-navigation';

const App = component(() => {
  return (
    <NavigationContainer defaultPathname='/Feed'>
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

Full documentation about this package you can find [here](https://github.com/atellmer/dark/tree/master/packages/native-navigation).

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
