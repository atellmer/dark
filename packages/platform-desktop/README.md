# @dark-engine/platform-desktop 🌖

Dark renderer to desktop platforms like Windows, Linux, macOS via <a href="https://docs.nodegui.org/" target="_blank">NodeGui</a> and <a href="https://www.qt.io/" target="_blank">Qt</a>

Qt is a cross-platform framework for developing applications and embedded systems. It provides developers with tools and libraries to build applications for various platforms such as Windows, macOS, Linux, Android, and iOS using the same code. Qt contains a comprehensive set of highly intuitive and modular C++ library classes and is loaded with APIs to simplify application development. It allows you to create easily readable, easily maintainable and reusable code with high runtime performance and small size.

NodeGui is an open source framework for building cross-platform native desktop apps with JavaScript and CSS-like styling. You can run NodeGui applications on macOS , Windows and Linux from the same codebase. NodeGui allows you to build truly native applications without sacrificing user experience by providing a core set of platform-independent native widgets that directly correspond to the platform's UI building blocks. NodeGui widgets are built on top of Qt, are extremely customizable, just like the web, but don't use a web browser under the hood. Applications can be built entirely in JavaScript. With NodeGui, you get the flexibility of web applications and the performance of native desktop applications.

[More about Dark](https://github.com/atellmer/dark)
<br>
[More about Qt](https://www.qt.io/)
<br>
[More about NodeGui](https://docs.nodegui.org/)

## Installation
npm:
```
npm install @nodegui/nodegui @dark-engine/core @dark-engine/platform-desktop
```
yarn:
```
yarn add @nodegui/nodegui @dark-engine/core @dark-engine/platform-desktop
```

## Usage

```tsx
import { Direction } from '@nodegui/nodegui';
import { h, component, useState } from '@dark-engine/core';
import { type PushButtonSignals, Window, BoxLayout, PushButton, useEvents } from '@dark-engine/platform-desktop';

const App = component(() => {
  const [count, setCount] = useState(0);
  const buttonEvents = useEvents<PushButtonSignals>({
    clicked: () => setCount(x => x + 1),
  });

  return (
    <Window windowTitle='My desktop app' width={400} height={400}>
      <BoxLayout direction={Direction.TopToBottom}>
        <PushButton text={`Fired ${count} times`} on={buttonEvents} />
      </BoxLayout>
    </Window>
  );
});
```

Also you can write any code without JSX:

```tsx
import { Direction } from '@nodegui/nodegui';
import { component, useState } from '@dark-engine/core';
import { type PushButtonSignals, Window, BoxLayout, PushButton, useEvents } from '@dark-engine/platform-desktop';

const App = component(() => {
  const [count, setCount] = useState(0);
  const buttonEvents = useEvents<PushButtonSignals>({
    clicked: () => setCount(x => x + 1),
  });

  return Window({
    windowTitle: 'My desktop app',
    width: 400,
    height: 400,
    slot: BoxLayout({
      direction: Direction.TopToBottom,
      slot: PushButton({ text: `Fired ${count} times`, on: buttonEvents }),
    }),
  });
});
```

## Environment Setup

Full working examples with environment setup you can find <a href="https://github.com/atellmer/dark/tree/master/examples/desktop" target="_blank">here</a>

## API

```tsx
import {
  type SyntheticEvent,
  render,
  registerElement,
  factory,
  useEvents,
  useStyle,
  useShortcut,
  Window,
  Text,
  FlexLayout,
  BoxLayout,
  GridLayout,
  GridItem,
  BlurEffect,
  DropShadowEffect,
  Svg,
  Action,
  Menu,
  MenuBar,
  Image,
  AnimatedImage,
  CheckBox,
  LineEdit,
  PlainTextEdit,
  DateEdit,
  TimeEdit,
  DateTimeEdit,
  SpinBox,
  DoubleSpinBox,
  PushButton,
  ToolButton,
  RadioButton,
  ComboBox,
  Slider,
  ScrollArea,
  ProgressBar,
  GroupBox,
  List,
  ListItem,
  Tree,
  TreeItem,
  Table,
  TableItem,
  Tab,
  TabItem,
  Stack,
  Splitter,
  SystemTrayIcon,
  Dial,
  Dialog,
  ColorDialog,
  FileDialog,
  FontDialog,
  InputDialog,
  ProgressDialog,
  MessageDialog,
  Calendar,
  ErrorMessage,
  StatusBar,
  TextBrowser,
  LCDNumber,
} from '@dark-engine/platform-desktop';
```

## Mounting to native platform

```tsx
import { render } from '@dark-engine/platform-desktop';

import App from './app';

render(App());
```

## Layout system

```tsx
import {
  FlexLayout,
  BoxLayout,
  GridLayout,
  GridItem,
} from '@dark-engine/platform-desktop';
```

### FlexLayout

FlexLayout is a kind of layout system based on the flexbox behavior of the web, implemented through the open-source project <a href="https://yogalayout.com/" target="_blank">Yoga Layout Engine</a> (like View in React Native). Styling properties happens through changing the values in the associated css.

```tsx
const style = useStyle(styled => ({
  root: styled`
    QLabel {
      font-size: 20px;
      qproperty-alignment: 'AlignCenter';
    }
    #box {
      flex-direction: 'column';
    }
    #text-1 {
      flex: 1;
      background-color: red;
      color: white;
    }
    #text-2 {
      flex: 1;
      background-color: yellow;
    }
    #text-3 {
      flex: 2;
      background-color: green;
    }
  `,
}));

return (
  <Window windowTitle='Dark' width={400} height={400} styleSheet={style.root}>
    <FlexLayout id='box'>
      <Text id='text-1'>Content 1</Text>
      <Text id='text-2'>Content 2</Text>
      <Text id='text-3'>Content 3</Text>
    </FlexLayout>
  </Window>
);
```
<div align="center"> 
  <img src="./assets/flex.jpg">
</div>

### BoxLayout

This is a built-in layout in Qt that lays out its child elements either horizontally or vertically. You can also control the placement direction using the Direction property.

```tsx
return (
  <Window windowTitle='Dark' width={400} height={400} styleSheet={style.root}>
    <BoxLayout direction={Direction.LeftToRight}>
      <Text id='text-1'>Content 1</Text>
      <Text id='text-2'>Content 2</Text>
      <Text id='text-3'>Content 3</Text>
    </BoxLayout>
  </Window>
);
```

<div align="center"> 
  <img src="./assets/box.jpg">
</div>

### GridLayout

This layout implements a layout system similar to grid on the web, where each child is inside its own row and column.

```tsx
return (
  <Window windowTitle='Dark' width={400} height={400} styleSheet={style.root}>
    <GridLayout columnStretch={[1, 2]} rowStretch={[1, 2]}>
      <GridItem row={0} col={0}>
        <Text id='text-1'>Label 1</Text>
      </GridItem>
      <GridItem row={0} col={1}>
        <Text id='text-2'>Label 2</Text>
      </GridItem>
      <GridItem row={1} col={0}>
        <Text id='text-3'>Label 3</Text>
      </GridItem>
      <GridItem row={1} col={1}>
        <Text id='text-4'>Label 4</Text>
      </GridItem>
    </GridLayout>
  </Window>
);
```

<div align="center"> 
  <img src="./assets/grid.jpg">
</div>

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
