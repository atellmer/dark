# Dark

Dark is component-based UI rendering engine for javascript apps without dependencies and written in Typescript 💫

## Notice 🙃
This project was written in my free time as a hobby. I challenged myself: can I write something similar to React without third-party dependencies and alone. I wanted to test myself because I'm self-taught (thanks youtube) and don't have a technical background. It took me about 4 years to bring it to an acceptable quality (but this is not accurate). It would probably take you much less time to do it. I rewrote it many times from scratch because I didn't like a lot of it. In the end, I decided to bring it to release, since the "ideal" is still unattainable. In addition, it is necessary to bring the work started to the end. I didn't get to do a lot of what I wanted to do. That is life. You can use the code at your own risk.

## Installation
npm:
```
npm install @dark-engine/core @dark-engine/platform-browser
```
yarn:
```
yarn add @dark-engine/core @dark-engine/platform-browser
```
## API overview
The public API is partially similar to the React API and includes 2 packages - core and browser support.

```typescript
import {
  h,
  View,
  Text,
  Comment,
  createComponent,
  createContext,
  Fragment,
  lazy,
  memo,
  forwardRef,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useError,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
  useUpdate,
} from '@dark-engine/core';
import { render, createPortal } from '@dark-engine/platform-browser';
```
## Shut up and show me your code!

For example this is timer component

```typescript
import {
  h, // for JSX support
  createComponent,
  useState,
  useEffect,
  TagVirtualNodeFactory,
} from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

type TimerProps = {
  slot?: (value: number) => TagVirtualNodeFactory;
};

const Timer = createComponent<TimerProps>(({ slot }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(x => x + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return slot(seconds);
});

const App = createComponent(() => {
  return [
    <div>Timer component is just logic without view...</div>,
    <Timer>{(seconds: number) => <div>timer: {seconds}</div>}</Timer>,
  ];
});

render(<App />, document.getElementById('root'));
```

Here's the same code but without using JSX

```typescript
import {
  View,
  Text,
  createComponent,
  useState,
  useEffect,
  TagVirtualNodeFactory,
} from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

const div = props => View({ ...props, as: 'div' });

type TimerProps = {
  slot?: (value: number) => TagVirtualNodeFactory;
};

const Timer = createComponent<TimerProps>(({ slot }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(x => x + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return slot(seconds);
});

const App = createComponent(() => {
  return [
    div({
      slot: Text('Timer component is just logic without view...')
    }),
    Timer({
      slot: (seconds: number) => div({
        slot: Text(`timer: ${seconds}`),
      }),
    }),
  ];
});

render(App(), document.getElementById('root'));
```

## A little more about the API

#### h
This is the function you need to enable JSX support and write in a React-like style. If you are writing in typescript you need to enable custom JSX support in tsconfig.json like this:
```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h"
  }
}

```
```typescript
import { h } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

render(<h1>Hello world</h1>, document.getElementById('root'));
```

#### View, Text, Comment

These are the basic entities corresponding to tags, text and comments.

```typescript
import { View, Text } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

const h1 = props => View({ ...props, as: 'h1' });

render(
  h1({ slot: Text('Hello world') }),
  document.getElementById('root')
);
```

#### createComponent
This is a fundamental function that creates components with their own logic and possibly nested components.

```typescript
import { h, createComponent } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

type SkyProps = {
  color: string;
};

const Sky = createComponent<SkyProps>(({ color }) => {
  return <div style={`color: ${color}`}>My color is {color}</div>;
});

render(<Sky color='deepskyblue' />, document.getElementById('root'));
```

A component can return an array of elements or components:

```typescript
const App = createComponent(props => {
  return [
    <header>Header</header>,
    <div>Content</div>,
    <footer>Footer</footer>,
  ];
});
```

If a child element is passed to the component, it will appear in props as slot:

```typescript
const App = createComponent(({ slot }) => {
  return [
    <header>Header</header>,
    <div>{slot}</div>,
    <footer>Footer</footer>,
  ];
});

render(<App>Content</App>, document.getElementById('root'));
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
