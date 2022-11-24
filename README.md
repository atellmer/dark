# Dark

Dark is lightweight (10 Kb gzipped) component-and-hook-based UI rendering engine for javascript apps without dependencies and written in Typescript 💫

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?style=flat&colorA=000063&colorB=673ab7)](https://github.com/atellmer/dark/blob/master/LICENSE)
[![GitHub Release](https://img.shields.io/github/release/atellmer/dark.svg?style=flat&colorA=000063&colorB=673ab7)]()
[![NPM Downloads](https://img.shields.io/npm/dt/@dark-engine/core.svg?style=flat&colorA=000063&colorB=673ab7)]()
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat&colorA=000063&colorB=673ab7)](http://makeapullrequest.com) 

![Dark](./assets/cover.jpg) 

## Demos

- [1k components](https://atellmer.github.io/dark/examples/1k-components/)
- [10k rows](https://atellmer.github.io/dark/examples/10k-rows/)
- [Track updates](https://atellmer.github.io/dark/examples/track-updates/)
- [Sierpinski triangle](https://atellmer.github.io/dark/examples/sierpinski-triangle/)
- [Simple todo-app](https://atellmer.github.io/dark/examples/todo-app/)
- [Deferred search](https://atellmer.github.io/dark/examples/deferred-search/)
- [Modal window](https://atellmer.github.io/dark/examples/modal-window/)
- [CodeSandbox example](https://codesandbox.io/s/stupefied-colden-6j9ep5?file=/src/index.tsx)

## Motivation
This project was written in my free time as a hobby. I challenged myself: can I write something similar to React without third-party dependencies and alone. The biggest discovery for me: writing a rendering library is not difficult, it is difficult to write one that is fast and consumes little memory. And this is a really hard task.

## Installation
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
<script src="https://unpkg.com/@dark-engine/core/umd/dark-core.production.min.js"></script>
<script src="https://unpkg.com/@dark-engine/platform-browser/umd/dark-platform-browser.production.min.js"></script>
```

## Table of contents
- [Overview](#overview)
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
- [Code splitting](#code-splitting)
- [Styles](#styles)
- [Portals](#portals)

<a name="overview"></a>
## API overview
The public API is partially similar to the React API and includes 2 packages - core and browser support.

```tsx
import {
  h,
  View,
  Text,
  Comment,
  Fragment,
  createComponent,
  createContext,
  memo,
  lazy,
  batch,
  forwardRef,
  Suspense,
  useCallback,
  useEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useError,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
  useDeferredValue,
} from '@dark-engine/core';
import { render, createRoot, createPortal, useStyle } from '@dark-engine/platform-browser';
```
## Shut up and show me your code!

For example this is a timer component:

```tsx
import {
  h,
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
    <div>Timer component is just a logic without view...</div>,
    <Timer>{(seconds: number) => <div>timer: {seconds}</div>}</Timer>,
  ];
});

render(<App />, document.getElementById('root'));
```

Part of this code can be rewritten without using JSX like this:

```tsx
const div = props => View({ ...props, as: 'div' });

const App = createComponent(() => {
  return [
    div({
      slot: Text('Timer component is just a logic without view...')
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
const Component = createComponent(({ isOpen }) => {
  return isOpen ? <div>Hello</div> : null
});
```

```tsx
const Component = createComponent(({ isOpen }) => {
  return (
    <Fragment>
      <div>Hello</div>
      {isOpen && <div>Content</div>}
    </Fragment>
  );
});
```

```tsx
const Component = createComponent(({ isOpen }) => {
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
const List = createComponent(({ items }) => {
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
const List = createComponent(({ items }) => {
  return items.map(x => <div key={x.id}>{x.title}</div>);
});
```
Note that every item must have key to identification itself. As key you can use string or number that must be uniqueness in list.

<a name="components"></a>
## Components

Components are the reusable building blocks of your application, encapsulating the presentation and logic of how they work.

#### createComponent

```tsx
import { createComponent } from '@dark-engine/core';
```

This is a fundamental function that creates components with their own logic and possibly nested components.
Components can accept props and change their logic based on their values.

```tsx
type SkyProps = {
  color: string;
};

const Sky = createComponent<SkyProps>(({ color }) => {
  return <div style={`color: ${color}`}>My color is {color}</div>;
});

render(<Sky color='deepskyblue' />, document.getElementById('root'));
```

A component can return an array of elements:

```tsx
const App = createComponent(props => {
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
const App = createComponent(({ slot }) => {
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
const RecursiveItem = createComponent<RecursiveItemProps>(({ level, currentLevel = 0 }) => {
  if (currentLevel === level) return null;

  return (
    <div style={`margin-left: ${currentLevel === 0 ? '0' : '10px'}`}>
      <div>level: {currentLevel + 1}</div>
      <RecursiveItem level={level} currentLevel={currentLevel + 1} />
    </div>
  );
});

const App = createComponent(() => {
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
Components should be able to store their state between renders. There are useState and useReducer hooks for this.

#### useState

```tsx
import { useState } from '@dark-engine/core';
```

This is a hook to store the state and call to update a piece of the interface.

```tsx
const App = createComponent(() => {
  const [count, setCount] = useState(0);

  const handleClick = () => setCount(count + 1);

  return [
    <div>count: {count}</div>,
    <button onClick={handleClick}>Click me</button>,
  ];
});
```

The setter can take a function as an argument to which the previous state is passed:

```tsx
const handleClick = () => setCount(x => x + 1);
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

const App = createComponent(() => {
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
const App = createComponent(() => {
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

<a name="optimization"></a>
## Performance optimization

Performance optimization in Dark can be done using different techniques, the main of which are memoization of the last render, batched and deferred updates.

### memo

```tsx
import { memo } from '@dark-engine/core';
```

```tsx
const HardComponent = createComponent(() => {
  console.log('HardComponent render!');

  return <div>I'm too complicated</div>;
});

const MemoHardComponent = memo(HardComponent);

const App = createComponent(() => {
  console.log('App render!');

  useEffect(() => {
    setInterval(() => {
      render(<App />, document.getElementById('root'));
    }, 1000);
  }, []);

  return (
    <>
      <div>app</div>
      <MemoHardComponent />
    </>
  );
});

render(<App />, document.getElementById('root'));
```
```
App render!
HardComponent render!
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

#### batch

Enables only the last render call in this animation frame.

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
const Items = createComponent(({ items }) => {
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

return <input ref={rootRef} />;
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
  createComponent((_, ref) => {
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

const App = createComponent(() => {
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

const BrokenComponent = createComponent<BrokenComponentProps>(({ hasError }) => {
  if (hasError) {
    throw new Error('oh no!');
  }

  return <div>BrokenComponent</div>;
});

const App = createComponent(() => {
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
In Dark, the context works with the createContext method and useContext hook.
Note that memoized intermediate components do not necessarily participate in re-rendering.

```tsx
import { createContext, useContext } from '@dark-engine/core';
```
```tsx
type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');

const useTheme = () => useContext(ThemeContext);

const ThemeConsumer = createComponent(() => {
  const theme = useTheme();
  console.log('render ThemeConsumer!');

  return <div style='font-size: 20vw;'>{theme === 'light' ? '☀️' : '🌙'}</div>;
});

const Proxy = createComponent(() => {
  console.log('render Proxy!');

  return (
    <div>
      I won't re-render myself when theme changes
      <ThemeConsumer />
    </div>
  );
});

const MemoProxy = memo(Proxy);

const App = createComponent(() => {
  const [theme, setTheme] = useState<Theme>('light');

  const handleToggleTheme = () => setTheme(x => (x === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={theme}>
      <MemoProxy />
      <button onClick={handleToggleTheme}>Toggle theme: {theme}</button>
    </ThemeContext.Provider>
  );
});

```
```
render Proxy!
render ThemeConsumer!
render ThemeConsumer!
render ThemeConsumer!
render ThemeConsumer!
...
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

const App = createComponent(() => {
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
const App = createComponent(() => {
  const portalHost = useMemo(() => {
    const host = document.createElement('div');

    document.body.append(host);

    return host;
  }, []);

  return (
    <>
      <div>Some text</div>
      {createPortal(<div>I will be placed in a new container</div>, portalHost)}
    </>
  );
});
```

Thanks everyone!

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
