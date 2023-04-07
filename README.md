<div align="center">
<h1>Dark</h1>

The lightweight and powerful UI rendering engine without dependencies and written in TypeScript 💫 <br> (Browser, Node.js, Android, iOS)

<img alt="License" src="https://img.shields.io/github/license/atellmer/dark?style=flat&colorA=000063&colorB=673ab7">
<img alt="GitHub Release" src="https://img.shields.io/github/release/atellmer/dark.svg?style=flat&colorA=000063&colorB=673ab7">
<img alt="NPM Downloads" src="https://img.shields.io/npm/dt/@dark-engine/core.svg?style=flat&colorA=000063&colorB=673ab7">
<img alt="bundle size core" src="https://img.shields.io/bundlephobia/minzip/@dark-engine/core?label=size%20[core]&style=flat&colorA=000063&colorB=673ab7">
<img alt="bundle size browser" src="https://img.shields.io/bundlephobia/minzip/@dark-engine/platform-browser?label=size%20[platform-browser]&style=flat&colorA=000063&colorB=673ab7">
<img alt="bundle size router" src="https://img.shields.io/bundlephobia/minzip/@dark-engine/web-router?label=size%20[router]&style=flat&colorA=000063&colorB=673ab7">
</div>

<div align="center"> 
  <img src="./assets/cover.jpg">
</div>

## Features
- 🌟 Reactive
- 🎉 Declarative
- 🛸 Fast
- 🏭 Has components and hooks
- 🧶 Based on the Fiber architecture
- ⚡️ Сan use without build tools
- 🦾 Strongly typed
- 🦄 Small size (5.8x smaller than React)
- 🌌 No dependencies
- 💥 Tree-shakeable
- 🎊 Server-side rendering
- 🥱 Lazy loading modules
- ☄️ Hot module replacement
- 🏄‍♂️ Out of box isomorphic routing
- 🚢 Rendering to mobile platforms (Android, iOS) via <a href="https://nativescript.org/" target="_blank">NativeScript</a>

```tsx
const Greeting = component(({ name }) => <h1>Hello {name} 🥰</h1>);

<Greeting name='Taylor Swift' />
```

## Demos

- [1k components](https://atellmer.github.io/dark/examples/1k-components/)
- [10k rows](https://atellmer.github.io/dark/examples/10k-rows/)
- [Animated reorderable grid](https://atellmer.github.io/dark/examples/animated-grid/)
- [Animated portal modal window](https://atellmer.github.io/dark/examples/modal-window/)
- [Text patching benchmark](https://atellmer.github.io/dark/examples/dark-vs-vue/)
- [Sierpinski triangle](https://atellmer.github.io/dark/examples/sierpinski-triangle/)
- [Track updates](https://atellmer.github.io/dark/examples/track-updates/)
- [Simple todo-app](https://atellmer.github.io/dark/examples/todo-app/)
- [Deferred search](https://atellmer.github.io/dark/examples/deferred-search/)
- [Vanilla js](https://stackblitz.com/edit/js-q58h8h?file=index.html)
- [Typescript](https://stackblitz.com/edit/darkapp-ccz57rk?file=index.tsx)
- [Spring animated image slider](https://stackblitz.com/edit/darkapp-ccz57rk-8mnd2n?file=index.tsx)
- [Spring animated FAB button](https://stackblitz.com/edit/darkapp-ccz57rk-vhplab?file=index.tsx)
- [Naive styled-components with Dark](https://stackblitz.com/edit/darkapp-ccz57rk-gtbczn?file=styled-components.ts,index.tsx)
- [Drag-n-drop](https://stackblitz.com/edit/darkapp-ccz57rk-ujdypw?file=index.tsx)
- [Dark mode with context](https://stackblitz.com/edit/darkapp-ccz57rk-z41sup?file=index.tsx)
- [Working with standard HTML input elements](https://stackblitz.com/edit/darkapp-ccz57rk-wqitdr?file=index.tsx)
- [Client-side routing with lazy-loaded routes](https://stackblitz.com/edit/darkapp-ccz57rk-hu65rp?file=index.tsx)
- [Server-side rendering](https://stackblitz.com/edit/darkapp-ccz57rk-3j65wa?file=server%2Fapp.ts)
- [Universal dark app (ssr + hydration + lazy + parameterized routing)](https://stackblitz.com/edit/darkapp-ccz57rk-n5zjg6?file=server%2Fapp.ts,client%2Fcomponents%2Fapp.tsx)
- [Hot module replacement (HMR) in dev mode](https://stackblitz.com/edit/darkapp-ccz57rk-cnkbqk?file=app.tsx)
- [Dark ❤️ NativeScript](https://stackblitz.com/edit/darkapp-ccz57rk-vqbndt?file=src%2Fcomponents%2Fapp.tsx)

## Motivation
This project was written in my free time as a hobby. I challenged myself: can I write something similar to React without third-party dependencies and alone. The biggest discovery for me: writing a rendering library is not difficult, it is difficult to write one that is fast and consumes little memory. And this is a really hard task.

## Usage
Simple example with component:

```tsx
import { h, Fragment, component, useReactiveState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

const App = component(() => {
  const state = useReactiveState({ name: 'Alex' });

  const handleInput = (e) => {
    state.name = e.target.value;
  };

  return (
    <>
      <div>Hello {state.name}</div>
      <input value={state.name} onInput={handleInput} />
    </>
  );
});

createRoot(document.getElementById('root')).render(<App />);
```

This code can be rewritten without using JSX like this:

```tsx
import { Text, component, useReactiveState } from '@dark-engine/core';
import { createRoot, div, input } from '@dark-engine/platform-browser';

const App = component(() => {
  const state = useReactiveState({ name: 'Alex' });

  const handleInput = (e) => {
    state.name = e.target.value;
  };

  return [
    div({ slot: Text(`Hello ${state.name}`) }),
    input({ value: state.name, onInput: handleInput }),
  ];
});

createRoot(document.getElementById('root')).render(App());
```

## Installation for browser (Single-page apps)
npm:
```
npm install @dark-engine/core @dark-engine/platform-browser
```
yarn:
```
yarn add @dark-engine/core @dark-engine/platform-browser
```
CDN:
```html
<script src="https://unpkg.com/@dark-engine/core/dist/umd/dark-core.production.min.js"></script>
<script src="https://unpkg.com/@dark-engine/platform-browser/dist/umd/dark-platform-browser.production.min.js"></script>
```

## Installation for Node.js (Universal apps)
npm:
```
npm install @dark-engine/core @dark-engine/platform-browser @dark-engine/platform-server
```
yarn:
```
yarn add @dark-engine/core @dark-engine/platform-browser @dark-engine/platform-server
```

## Installation for mobile platforms (Android and iOS native apps)
npm:
```
npm install @nativescript/core @dark-engine/core @dark-engine/platform-native
```
yarn:
```
yarn add @nativescript/core @dark-engine/core @dark-engine/platform-native
```

## Table of contents
- [API overview](#overview)
- [Elements](#elements)
- [Mounting](#mounting)
- [Unmounting](#unmounting)
- [Conditional rendering](#conditional-rendering)
- [List rendering](#list-rendering)
- [Components](#components)
- [Recursive components rendering](#recursive-rendering)
- [Events](#events)
- [Hooks](#hooks)
- [State](#state)
- [Effects](#effects)
- [Performance optimization](#optimization)
- [Refs](#refs)
- [Catching errors](#errors)
- [Context](#context)
- [Animations](#animations)
- [Code splitting](#code-splitting)
- [Factory](#factory)
- [Styles](#styles)
- [Portals](#portals)
- [SSR (Server-Side Rendering)](#ssr)
- [Routing](#routing)
- [Others](#others)
- [Rendering to native platforms](#native-platforms)

<a name="overview"></a>
## API overview
The public API is partially similar to the React API and includes 2 packages - core and browser support.

```tsx
import {
  type DarkElement,
  type Atom,
  h,
  View,
  Text,
  Comment,
  Fragment,
  Suspense,
  component,
  createContext,
  memo,
  lazy,
  atom,
  batch,
  forwardRef,
  useMemo,
  useCallback,
  useEvent,
  useAtom,
  useContext,
  useEffect,
  useLayoutEffect,
  useInsertionEffect,
  useError,
  useRef,
  useId,
  useSpring,
  useImperativeHandle,
  useState,
  useReducer,
  useReactiveState,
  useDeferredValue,
  useSyncExternalStore,
  detectIsServer,
} from '@dark-engine/core';
```
```tsx
import {
  type SyntheticEvent,
  render,
  createRoot,
  hydrateRoot,
  createPortal,
  factory,
  useStyle,
} from '@dark-engine/platform-browser';
```
```tsx
import { renderToString, renderToStringAsync } from '@dark-engine/platform-server';
```
```tsx
import {
  type Routes,
  type RouterRef,
  Router,
  RouterLink,
  useLocation,
  useHistory,
  useParams,
  useMatch,
} from '@dark-engine/web-router';
```
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
} from '@dark-engine/platform-native';
```
```tsx
import {
  type NavigationOptions,
  NavigationContainer,
  StackNavigator,
  TabNavigator,
  TransitionName,
  useNavigation,
} from '@dark-engine/native-navigation';
```

## A little more about the core concepts...

<a name="elements"></a>
## Elements

Elements are a collection of platform-specific primitives and components. For the browser platform, these are tags, text, and comments.

#### h

```tsx
import { h } from '@dark-engine/core';
```

This is the function you need to enable JSX support and write in a React-like style. If you are writing in typescript you need to enable custom JSX support in tsconfig.json like this:
```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}

```
```tsx
render(<div>I'm Dark</div>, document.getElementById('root'));
```

#### View, Text, Comment

```tsx
import { View, Text, Comment } from '@dark-engine/core';
```

These are the basic entities corresponding to tags, text and comments if you are not using JSX.

```tsx
const h1 = props => View({ ...props, as: 'h1' });

render(
  [
    h1({ slot: Text(`I'm Dark`) }),
    Comment(`I'm comment in DOM`),
  ],
  document.getElementById('root')
);
```
<a name="mounting"></a>
## Mounting

Mounting the application and possibly re-rendering is done by executing the render function. Note that Dark supports rendering multiple independent applications to different DOM elements. This can be useful for creating custom widgets that don't affect how the main application works.

```tsx
import { render } from '@dark-engine/platform-browser';
```
```tsx
render(<App />, document.getElementById('root'));
```

or with createRoot
```tsx
import { createRoot } from '@dark-engine/platform-browser';
```
```tsx
createRoot(document.getElementById('root')).render(<App />);
```

render two or more apps

```tsx
render(<AppOne />, document.getElementById('root-1'));
render(<AppTwo />, document.getElementById('root-2'));
```
re-render root

```tsx
setInterval(() => {
  count++;
  render(<App count={count} />, document.getElementById('root'));
}, 1000);
```
<a name="unmounting"></a>
## Unmounting

To unmount the application, you must use render via createRoot. It already contains the unmount method.

```tsx
const root = createRoot(document.getElementById('root'));

root.render(<App />);
root.unmount();
```

<a name="conditional-rendering"></a>
## Conditional rendering

A couple of examples of working with conditions:

```tsx
const Component = component(({ isOpen }) => {
  return isOpen ? <div>Hello</div> : null
});
```

```tsx
const Component = component(({ isOpen }) => {
  return (
    <Fragment>
      <div>Hello</div>
      {isOpen && <div>Content</div>}
    </Fragment>
  );
});
```

```tsx
const Component = component(({ isOpen }) => {
  return (
    <Fragment>
      <div>Hello</div>
      {isOpen ? <ComponentOne /> : <ComponentTwo />}
      <div>world</div>
    </Fragment>
  );
});
```
<a name="list-rendering"></a>
## List rendering
```tsx
const List = component(({ items }) => {
  return (
    <Fragment>
      {
        items.map(x => {
          return <div key={item.id}>{item.name}</div>
        })
      }
    </Fragment>
  );
});
```

or without Fragment

```tsx
const List = component(({ items }) => {
  return items.map(x => <div key={x.id}>{x.title}</div>);
});
```
Note that every item must have key to identification itself. As key you can use string or number that must be uniqueness in list.

<a name="components"></a>
## Components

Components are the reusable building blocks of your application, encapsulating the presentation and logic of how they work.

#### component

```tsx
import { component } from '@dark-engine/core';
```

This is a fundamental function that creates components with their own logic and possibly nested components.
Components can accept props and change their logic based on their values.

```tsx
type SkyProps = {
  color: string;
};

const Sky = component<SkyProps>(({ color }) => {
  return <div style={`color: ${color}`}>My color is {color}</div>;
});

render(<Sky color='deepskyblue' />, document.getElementById('root'));
```

A component can return an array of elements:

```tsx
const App = component(props => {
  return [
    <header>Header</header>,
    <div>Content</div>,
    <footer>Footer</footer>,
  ];
});
```

You can also use Fragment as an alias for an array:

```tsx
return (
  <Fragment>
    <header>Header</header>
    <div>Content</div>
    <footer>Footer</footer>
  </Fragment>
);
```

or just

```tsx
return (
  <>
    <header>Header</header>
    <div>Content</div>
    <footer>Footer</footer>
  </>
);
```

If a child element is passed to the component, it will appear in props as slot:

```tsx
const App = component(({ slot }) => {
  return (
    <>
      <header>Header</header>
      <div>{slot}</div>
      <footer>Footer</footer>
    </>
  );
});

render(<App>Content</App>, document.getElementById('root'));
```
<a name="recursive-rendering"></a>
## Recursive components rendering
You can put components into themself to get recursion if you want. But every recursion must have return condition for out. In other case we will have infinity loop. Recursive rendering might be useful for tree building or something else.

```tsx
const RecursiveItem = component<RecursiveItemProps>(({ level, currentLevel = 0 }) => {
  if (currentLevel === level) return null;

  return (
    <div style={`margin-left: ${currentLevel === 0 ? '0' : '10px'}`}>
      <div>level: {currentLevel + 1}</div>
      <RecursiveItem level={level} currentLevel={currentLevel + 1} />
    </div>
  );
});

const App = component(() => {
  return <RecursiveItem level={5} />;
});
```
```
 level: 1
  level: 2
   level: 3
    level: 4
     level: 5
```

<a name="events"></a>
## Events
Dark uses the standard DOM event system, but written in camelCase. A handler is passed to the event attribute in the form of a function, which receives a synthetic event containing a native event. Synthetic events are needed in order to emulate the operation of stopPropagation. The emulation is required because, for performance reasons, Dark uses native event delegation to the document element instead of the original element. For example, if you subscribe to a button click event, the event will be tracked on the entire document, not on that button.

```tsx
import { type SyntheticEvent } from '@dark-engine/platform-browser';
```

```tsx
const handleInput = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => setValue(e.target.value);
const handleClick = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => console.log('click');

<input value={value} onInput={handleInput} />
<br />
<button onClick={handleClick}>Click me</button>
```
<a name="hooks"></a>
## Hooks
Hooks are needed to bring components to life: give them an internal state, start some actions, and so on. The basic rule for using hooks is to use them at the top level of the component, i.e. do not nest them inside other functions, cycles, conditions. This is a necessary condition, because hooks are not magic, but work based on array indices.
<a name="state"></a>
## State
Components should be able to store their state between renders. There are useState, useReactiveState and useReducer hooks for this.

#### useState

```tsx
import { useState } from '@dark-engine/core';
```

This is a hook to store the state and call to update a piece of the interface.

```tsx
const App = component(() => {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>fired {count} times</button>;
});
```

The setter can take a function as an argument to which the previous state is passed:

```tsx
const handleClick = () => setCount(x => x + 1);
```

#### useReactiveState

The hook uses Proxy under the hood and allows you to update state reactively when properties change. Performs automatic async batching of updates.

```tsx
import { useReactiveState } from '@dark-engine/core';
```

```tsx
const App = component(() => {
  const state = useReactiveState({ count: 0 });

  return (
    <button onClick={() => state.count++}>fired {state.count} times</button>
  );
});
```

#### useReducer

```tsx
import { useReducer } from '@dark-engine/core';
```

useReducer is used when a component has multiple values in the same complex state, or when the state needs to be updated based on its previous value.

```tsx
type State = { count: number };
type Action = { type: string };

const initialState: State = { count: 0 };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const App = component(() => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
});
```
<a name="effects"></a>
## Effects

Side effects are useful actions that take place outside of the interface rendering. For example, side effects can be fetch data from the server, calling timers, subscribing.

#### useEffect

Executed asynchronously, after rendering.

```tsx
import { useEffect } from '@dark-engine/core';
```

```tsx
const App = component(() => {
  const [albums, setAlbums] = useState<Array<Album>>([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(x => x.json())
      .then(x => setAlbums(x.splice(0, 10)));
  }, []);

  if (albums.length === 0) return <div>loading...</div>;

  return (
    <ul>
      {albums.map(x => (
        <li key={x.id}>{x.title}</li>
      ))}
    </ul>
  );
});
```
The second argument to this hook is an array of dependencies that tells it when to restart. This parameter is optional, then the effect will be restarted on every render.

Also this hook can return a reset function:

```tsx
 useEffect(() => {
    const timerId = setTimeout(() => {
      console.log('hey!');
    }, 1000);

    return () => clearTimeout(timerId);
  }, []);
```
#### useLayoutEffect

```tsx
import { useLayoutEffect } from '@dark-engine/core';
```

This type of effect is similar to useEffect, however, it is executed synchronously right after the commit phase of new changes. Use this to read layout from the DOM and synchronously re-render.

```tsx
useLayoutEffect(() => {
  const height = rootRef.current.clientHeight;

  setHeight(height);
}, []);
```

#### useInsertionEffect

```tsx
import { useInsertionEffect } from '@dark-engine/core';
```

The signature is identical to useEffect, but it fires synchronously before all DOM mutations. Use this to inject styles into the DOM before reading layout in useLayoutEffect. This hook does not have access to refs and cannot call render. Useful for css-in-js libraries.

```tsx
useInsertionEffect(() => {
  // add style tags to head
}, []);
```

<a name="optimization"></a>
## Performance optimization

Performance optimization in Dark can be done using different techniques, the main of which are memoization of the last render, using atoms, batched and deferred updates.

### memo

```tsx
import { memo } from '@dark-engine/core';
```

```tsx
const StaticComponent = memo(component(() => {
  console.log('StaticComponent render!');

  return <div>I'm static</div>;
}));

const App = component(() => {
  console.log('App render!');

  useEffect(() => {
    setInterval(() => {
      root.render(<App />);
    }, 1000);
  }, []);

  return (
    <>
      <div>app</div>
      <StaticComponent />
    </>
  );
});

const root = createRoot(document.getElementById('root'));

root.render(<App />);
```
```
App render!
StaticComponent render!
App render!
App render!
App render!
...
```

As the second argument, it takes a function that answers the question of when to re-render the component:

```tsx
const MemoComponent = memo(Component, (prevProps, nextProps) => prevProps.color !== nextProps.color);
```

#### useMemo 

```tsx
import { useMemo } from '@dark-engine/core';
```

For memoization of heavy calculations or heavy pieces of the interface:

```tsx
const memoizedOne = useMemo(() => Math.random(), []);
const memoizedTwo = useMemo(() => <div>{Math.random()}</div>, []);

return (
  <>
    {memoizedOne}
    {memoizedTwo}
  </>
);
```

#### useCallback

```tsx
import { useCallback } from '@dark-engine/core';
```

Suitable for memoizing handler functions descending down the component tree:

```tsx
 const handleClick = useCallback(() => setCount(count + 1), [count]);

 return (
    <button onClick={handleClick}>add</button>
  );
```

#### useEvent

```tsx
import { useEvent } from '@dark-engine/core';
```

Similar to useCallback but has no dependencies. Ensures the return of the same function, with the closures always corresponding to the last render. In most cases, it eliminates the need to track dependencies in useCallback.

```tsx
const handleClick = useEvent(() => setCount(count + 1));

return (
  <button onClick={handleClick}>add</button>
);
```

#### Atoms

Atoms are pieces of data that can be independently subscribed to and only rendered when those pieces of data are explicitly changed. They are useful primarily for optimizing critical places in large lists, such as working with a single row in a large table based on data coming from the parent component. Atoms are convenient to use with memoizations. In this case, we can achieve the same performance as if the data were in the consumer's local state. The main idea is to split a large render into many smaller ones so that we don't have to process the calculation of the whole tree, even if it is memoized, because traversing memoized components is still a traversal, albeit a superficial one.

```tsx
import { type Atom, atom } from '@dark-engine/core';
```

```tsx
const Parent = component(() => {
  const [count$, setCount$] = useAtom(0);

  // Parent won't render after count$ change cause there is no call count$.value() here

  return (
    <>
      <Child count$={count$} />
      <button onClick={() => setCount$(x => x + 1)}>increment</button>
    </>
  );
});

const Child = component(({ count$ }) => {
  // Renders only atom consumer through call count$.value()

  return <div>{count$.value()}</div>;
});
```

You can pass function that will control rendering necessity
```tsx
const count = count$.value((prev, next) => prev !== next && next >= 5);

<div>{count}</div>
```

#### batch

Enables only the last render call in this tick.

```tsx
import { batch } from '@dark-engine/core';
```

```tsx
useLayoutEffect(() => {
  batch(() => {
    setCount(1);
    setCount(2);
    setCount(3);  // render just this time
  });
}, []);
```

```tsx
const handleMouseMove = (e: SyntheticEvent<MouseEvent>) => {
  batch(() => {
    setClientX(e.sourceEvent.clientX);
    setClientY(e.sourceEvent.clientY);
  });
};
```

#### useDeferredValue

Dark under the hood performs all recalculations in asynchronous mode so as not to block the main thread. Due to the task scheduler, you can achieve prioritization of interface updates. For example, make some updates more important than others, and vice versa - less important.

```tsx
import { useDeferredValue } from '@dark-engine/core';
```
This fixes an issue with an unresponsive interface when user input occurs, based on which heavy calculations or heavy rendering is recalculated.
Returns a delayed value that may lag behind the main value. It can be combined with each other and with useMemo and memo for amazing responsiveness results...

```tsx
const Items = component(({ items }) => {
  const deferredItems = useDeferredValue(items);
  const elements = useMemo(() => {
    return deferredItems.map(item => <li key={item.id}>{item.name}</li>);
  }, [deferredItems]);

  return <ul>{elements}</ul>;
});
```

<a name="refs"></a>
## Refs

To get full control over components or DOM nodes Dark suggests using refs. Working with refs is done like this:

#### useRef

```tsx
import { useRef } from '@dark-engine/core';
```

```tsx
const rootRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  rootRef.current.focus();
}, []);

<input ref={rootRef} />;
```

Also there is support function refs

```tsx
<input ref={ref => console.log(ref)} />;
```

#### forwardRef and useImperativeHandle

```tsx
import { forwardRef, useImperativeHandle } from '@dark-engine/core';
```

They are needed to create an object inside the reference to the component in order to access the component from outside:

```tsx
type DogRef = {
  growl: () => void;
};

const Dog = forwardRef<{}, DogRef>(
  component((_, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        growl: () => console.log('rrrr!'),
      }),
      [],
    );

    return <div>I'm dog</div>;
  }),
);

const App = component(() => {
  const dogRef = useRef<DogRef>(null);

  useEffect(() => {
    dogRef.current.growl();
  }, []);

  return <Dog ref={dogRef} />;
});
```
<a name="errors"></a>
## Catching errors

Error catching is done using the useError hook. When you get an error, you can log it and show an alternate user interface.

```tsx
import { useError } from '@dark-engine/core';
```
```tsx
type BrokenComponentProps = {
  hasError: boolean;
};

const BrokenComponent = component<BrokenComponentProps>(({ hasError }) => {
  if (hasError) {
    throw new Error('oh no!');
  }

  return <div>BrokenComponent</div>;
});

const App = component(() => {
  const [hasError, setHasError] = useState(false);
  const error = useError();

  useEffect(() => {
    setTimeout(() => {
      setHasError(true);
    }, 5000);
  }, []);

  if (error) {
    return <div>Something went wrong!</div>;
  }

  return (
    <>
      <div>Text 1</div>
      <BrokenComponent hasError={hasError} />
    </>
  );
});
```
<a name="context"></a>
## Context

Context might be useful when you need to synchronize state between deeply nested elements without having to pass props from parent to child.

```tsx
import { createContext, useContext } from '@dark-engine/core';
```
```tsx
type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');

const useTheme = () => useContext(ThemeContext);

const ThemeConsumer = component(() => {
  const theme = useTheme();
  console.log('render ThemeConsumer!');

  return <div style='font-size: 20vw;'>{theme === 'light' ? '☀️' : '🌙'}</div>;
});

const StaticLayout = memo(component(() => {
  console.log('render StaticLayout!');

  return (
    <div>
      I won't re-render myself when theme changes
      <ThemeConsumer />
    </div>
  );
}));

const App = component(() => {
  const [theme, setTheme] = useState<Theme>('light');

  const handleToggleTheme = () => setTheme(x => (x === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={theme}>
      <StaticLayout />
      <button onClick={handleToggleTheme}>Toggle theme: {theme}</button>
    </ThemeContext.Provider>
  );
});

```
```
render StaticLayout!
render ThemeConsumer!
render ThemeConsumer!
render ThemeConsumer!
render ThemeConsumer!
...
```

<a name="animations"></a>
## Animations

Animations in Dark are based on spring physics, so to get the effect you want, you should experiment with its parameters. Dark supports an array of animations that run sequentially one after another, including in the opposite direction. With this technique, you can create complex effects of moving elements.

```tsx
import { useSpring } from '@dark-engine/core';
```

```tsx
const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    values: [x],
  } = useSpring({
    state: isOpen,
    getAnimations: () => [
      {
        name: 'my-animation', // animation name should be uniqueness in this array
        mass: 1,
        stiffness: 1,
        damping: 1,
        duration: 1000,
      },
    ],
  });

  const style = useStyle(styled => ({
    root: styled`
      opacity: ${x};
    `,
  }));

  return (
    <>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <div style={style.root}>Hello</div>
    </>
  );
});
```

<a name="code-splitting"></a>
## Code splitting

If you have separated modules, you might want to lazy load them when needed. In this case you can use code splitting. To use components lazy loading, you need to wrap dynamic imports of component in a special function - lazy. You will also need a Suspense component that will show a stub until the module is loaded.

```tsx
import { lazy, Suspense } from '@dark-engine/core';
```

```tsx
type NewPageProps = {};

const NewPage = lazy<NewPageProps>(() => import('./new-page'));

const App = component(() => {
  const [isNewPage, setIsNewPage] = useState(false);

  const handleToggle = () => setIsNewPage(x => !x);

  return (
    <>
      <button onClick={handleToggle}>Toggle new page</button>
      {isNewPage && (
        <Suspense fallback={<div>Loading...</div>}>
          <NewPage />
        </Suspense>
      )}
    </>
  );
});
```
<a name="factory"></a>

## Factory
This is a function that creates elements based on their name if you don't use JSX.

```tsx
import { factory } from '@dark-engine/platform-browser';
```

```tsx
const div = factory('div'); // creates <div></div>
const customElement = factory('custom-element'); // creates <custom-element></custom-element>
```

For convenience, Dark exports all html and svg tags:

```tsx
import { div, button, input, svg, /*and others*/ } from '@dark-engine/platform-browser';
```

You can use it like this:

```tsx
return (
  div({
    slot: button({
      class: 'awesome-button',
      slot: Text('Click me'),
      onClick: () => console.log('click'),
    })
  })
);

// <div>
//   <button class="awesome-button">Click me</button>
// </div>
```

<a name="styles"></a>
## Styles
In Dark for the Browser, styling is done just like in normal HTML using the style and class attributes. You can also use the useStyle hook, which returns an object with styles. This hook differs from the usual template literals in that it internally minifies the style by removing extra spaces (memoization is used), and also, if you have the syntax highlighting plugin for styled-components installed, highlights the style.

```tsx
import { useStyle } from '@dark-engine/platform-browser';
```

```tsx
const style = useStyle(styled => ({
  container: styled`
    width: 100%;
    background-color: ${color};
  `,
  item: styled`
    color: purple;
  `,
}));

<div style={style.container}>
  <span style={style.item}>I'm styled!</span>
</div>
```
<a name="portals"></a>
## Portals

This is a browser environment-specific ability to redirect the rendering flow to another element in the DOM tree. The main purpose is modal windows, dropdown menus and everything where it is necessary to avoid the possibility of being overlapped by the parent container due to configured css overflow.

```tsx
import { createPortal } from '@dark-engine/platform-browser';
```

```tsx
const App = component(() => {
  const portalHost = useMemo(() => document.createElement('div'), []);

  useLayoutEffect(() => {
    document.body.appendChild(portalHost);
    return () => document.body.removeChild(portalHost);
  }, []);

  return (
    <>
      <div>Hello world</div>
      {createPortal(<div>I will be placed in a new container</div>, portalHost)}
    </>
  );
});
```

<a name="ssr"></a>
## SSR (Server-Side Rendering)

A normal Dark application runs in the browser, rendering pages in the DOM in response to user actions. You can also render on the server by creating static application pages that are later loaded on the client. This means that the app typically renders faster, allowing users to preview the layout of the app before it becomes fully interactive.
The basic principle: on the server, the component code is rendered into a string, which the server returns in response to a request in the form of a file to which the assembled build of the front-end code is connected. The user receives a rendered page with content instantly, while Dark performs a hydration procedure, i.e. reuses DOM nodes already created on the server, hangs event handlers, and also performs all relying effects

```
app/
├─ client/
│  ├─ static/
│  │  ├─ build.js
│  ├─ app.tsx
│  ├─ index.tsx
│  ├─ webpack.config.js
├─ server/
│  ├─ app.ts
├─ package.json
├─ tsconfig.json
```

```tsx
// server/app.ts
import { renderToString } from '@dark-engine/platform-server';

import { App } from '../client/app'; // your app.tsx

server.use(express.static(join(__dirname, '../client/static')));

server.get('/', (req, res) => {
  const app = renderToString(App()); // render
  const page = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="description" content="My awesome SSR app">
      <base href="/">
      <link rel="preload" href="./build.js" as="script" />
      <title>My awesome SSR app</title>
    </head>
    <body>
      <div id="root">${app}</div>
      <script src="./build.js" defer></script>
    </body>
    </html>
  `;

  res.send(page);
});
```

```tsx
// client/app.tsx
import { h, component } from '@dark-engine/core';

const App = component(() => <div>Hello World</div>);

export { App };
```

```tsx
// client/index.tsx
import { h } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './app';

hydrateRoot(document.getElementById('root'), <App />); // some magic and app works!
```

A working example of an SSR application based on the express server is in examples

<a name="routing"></a>
## Routing

Dark provides routing as a separate package called `@dark-engine/web-router`.
This is an isomorphic router designed for rendering universal web applications that work both on the client via the HTML5 Browser History API and on the server.

```tsx
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';
```

```tsx
const routes: Routes = [
  {
    path: 'home',
    component: Home, // <-- component
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'contacts',
    component: Contacts,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

const App = component(() => {
  return (
    <Router routes={routes}>
      {slot => {
        return (
          <>
            <header>
              <RouterLink to='/home'>home</RouterLink>
              <RouterLink to='/about'>about</RouterLink>
              <RouterLink to='/contacts'>contacts</RouterLink>
            </header>
            <main>{slot}</main> {/*<-- route content will be placed here*/}
          </>
        );
      }}
    </Router>
  );
});
```

Dark web-router supports nested routes, parameters, lazy loading, redirects, wildcards (notFound pages), combinations of wildcards and redirects, server-side rendering. You can read more about the web-router [here](https://github.com/atellmer/dark/tree/master/packages/web-router).

<a name="others"></a>
## Others
#### useId

useId is a hook for generating unique IDs that stable between renders.

```tsx
import { useId } from '@dark-engine/core';
```

```tsx
const Checkbox = component(() => {
  const id = useId();

  // generates something like this 'dark:0:lflt'

  return (
    <>
      <label for={id}>Do you like it?</label>
      <input id={id} type='checkbox' name='likeit' />
    </>
  );
});
```

#### useSyncExternalStore

The hook is useful for synchronizing render states with an external state management library such as Redux.

```tsx
import { useSyncExternalStore } from '@dark-engine/core';
```

```tsx
const App = component(() => {
  const state = useSyncExternalStore(store.subscribe, store.getState); // redux store

  return <div>{state.isFetching ? 'loading...' : 'ola! 🤪'}</div>;
});
```

<a name="native-platforms"></a>

## Rendering to native platforms (Android, iOS)

Due to the convenient design of the architecture, the Dark core does not depend on the rendering platform, the main thing is that the environment supports JavaScript execution. Thanks to this feature, you can write custom renders for any platform. One such platform is mobile operating systems. Thanks to NativeScript, we can render our components natively on Android or iOS using the native APIs of those systems inside JavaScript. Dark provides a renderer called `@dark-engine/platform-native`. You can learn more about it [here](https://github.com/atellmer/dark/tree/master/packages/platform-native).

Thanks everyone! 🤛

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
