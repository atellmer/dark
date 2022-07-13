# Dark

Dark is lightweight (10 Kb gzipped) component-and-hook-based UI rendering engine for javascript apps without dependencies and written in Typescript 💫

## Notice
This project was written in my free time as a hobby. I challenged myself: can I write something similar to React without third-party dependencies and alone. It took me about 4 years to bring it to an acceptable quality (but this is not accurate). It would probably take you much less time to do it. I rewrote it many times from scratch because I didn't like a lot of it. In the end, I decided to bring it to release, since the "ideal" is still unattainable. In addition, it is necessary to bring the work started to the end. I didn't get to do a lot of what I wanted to do. That is life. You can use the code at your own risk.

The biggest discovery for me: writing a rendering library is not difficult, it is difficult to write one that is fast and consumes little memory. And this is a really difficult task.

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
} from '@dark-engine/core';
import { render, createPortal } from '@dark-engine/platform-browser';
```
## Shut up and show me your code!

For example this is timer component:

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

Here's the same code but without using JSX (Flutter style:)

```tsx
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

## A little more about the API...

### Elements

Elements are a collection of platform-specific primitives and components. For the browser platform, these are tags, text, and comments.

#### h

```tsx
import { h } from '@dark-engine/platform-browser';
```

This is the function you need to enable JSX support and write in a React-like style. If you are writing in typescript you need to enable custom JSX support in tsconfig.json like this:
```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h"
  }
}

```
```tsx
render(<h1>I'm Dark</h1>, document.getElementById('root'));
```

#### View, Text, Comment
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

### Mounting and rerender root

Mounting the application and possibly re-rendering is done by executing the render function. Note that Dark supports rendering multiple independent applications to different DOM elements. This can be useful for creating custom widgets that don't affect how the main application works.

```tsx
import { render } from '@dark-engine/platform-browser';
```
```tsx
render(<App />, document.getElementById('root'));
```
render two apps

```tsx
render(<AppOne />, document.getElementById('root-1'));
render(<AppTwo />, document.getElementById('root-2'));
```
rerender root

```tsx
setInterval(() => {
  count++;
  render(<App count={count} />, document.getElementById('root'));
}, 1000);
```

### Conditional rendering

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
      {isOpen ? <ComponentOne> : <ComponentTwo>}
      <div>world</div>
    </Fragment>
  );
});
```

### List rendering

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
  return albums.map(x => <div key={x.id}>{x.title}</div>);
});
```

### Components

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

If a child element is passed to the component, it will appear in props as slot:

```tsx
const App = createComponent(({ slot }) => {
  return [
    <header>Header</header>,
    <div>{slot}</div>,
    <footer>Footer</footer>,
  ];
});

render(<App>Content</App>, document.getElementById('root'));
```

### Hooks
Hooks are needed to bring components to life: give them an internal state, start some actions, and so on. The basic rule for using hooks is to use them at the top level of the component, i.e. do not nest them inside other functions, cycles, conditions. This is a necessary condition, because hooks are not magic, but work based on array indices.

### State
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
    <Fragment>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </Fragment>
  );
});
```

### Side Effects

Side Effects are useful actions that take place outside of the interface rendering. For example, side effects can be fetch data from the server, calling timers, subscribing.

#### useEffect

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

### Performance optimization

In Dark, redraw optimization can be configured using the memo function, as well as the useMemo and useCallback hooks. Optimization occurs due to the memoization of the results of the previous calculation or render.

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

  return [<div>app</div>, <MemoHardComponent />];
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
const memoizedTwo = useMemo(() => <div>I will rerender when dependencies change</div>, []);

return (
  <Fragment>
    {memoizedOne}
    {memoizedTwo}
  </Fragment>
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

### Refs

Refs are needed to be able to get a reference to a DOM element or a reference to a component in order to interact with them more subtly.
In Dark, work with refs is done using the forwardRef function and the useRef and useImperativeHandle hooks.

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

### Catching errors

Error catching is done using the useError hook. When you get an error, you can log it and show an alternate UI.

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
    <Fragment>
      <div>Text 1</div>
      <BrokenComponent hasError={hasError} />
    </Fragment>
  );
});
```

### Context

Context is needed when you need to synchronize state between deeply nested elements without having to pass props from parent to child.
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

### Code splitting

Code splitting is required when you have separate modules that can be lazily loaded when needed. For example, jumping to a new page with a new URL using the Browser History API. To use components lazy loading, you need to wrap dynamic imports of component in a special function - lazy. You will also need a Suspense component that will show a stub until the module is loaded.

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
    <Fragment>
      <button onClick={handleToggle}>Toggle new page</button>
      {isNewPage && (
        <Suspense fallback={<div>Loading...</div>}>
          <NewPage />
        </Suspense>
      )}
    </Fragment>
  );
});
```

### Portals

This is a browser environment-specific ability to redirect the rendering thread to another element in the DOM tree. The main purpose is modal windows, dropdown menus and everything where it is necessary to avoid the possibility of being overlapped by the parent container due to configured css overflow.

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
    <Fragment>
      <div>Some text</div>
      {createPortal(<div>I will be placed in a new container</div>, portalHost)}
    </Fragment>
  );
});
```

Thanks everyone!

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
