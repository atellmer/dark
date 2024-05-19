# @dark-engine/core 🌖

A core package that abstracts away the specific code running platform. The core is based on the Fiber architecture, implements its own call stack, which makes it possible to flexibly manage rendering: schedule, prioritize, interrupt, resume rendering from the same point, or cancel it altogether. Supports asynchronous and concurrent rendering, works synchronously by default. Breaks the rendering work into two phases: the reconciliation phase and the phase of committing changes to the platform.

[README](https://github.com/atellmer/dark)

## Installation

npm:
```
npm install @dark-engine/core
```

yarn:
```
yarn add @dark-engine/core
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/core/dist/umd/dark-core.production.min.js"></script>
```

## Table of contents
- [API](#api)
- [Elements](#elements)
- [JSX](#jsx)
- [Components](#components)
- [Conditional rendering](#conditional-rendering)
- [List rendering](#list-rendering)
- [Recursive rendering](#recursive-rendering)
- [Hooks](#hooks)
- [Effects](#effects)
- [Memoization](#memoization)
- [Refs](#refs)
- [Catching errors](#catching-errors)
- [Context](#context)
- [Batching](#batching)
- [Atoms](#atoms)
- [Code splitting](#code-splitting)
- [Async rendering](#async-rendering)
- [Concurrent rendering](#concurrent-rendering)
- [Hot module replacement](#hmr)
- [Others](#others)

<a id="api"></a>

## API

```tsx
import {
  type Atom,
  type CommentVirtualNode,
  type Component,
  type ComponentFactory,
  type DarkElement,
  type Dispatch,
  type ElementKey,
  type FunctionRef,
  type MutableRef,
  type ReadableAtom,
  type Reducer,
  type Ref,
  type StandardComponentProps,
  type TagVirtualNode,
  type TextVirtualNode,
  type VirtualNodeFactory,
  type WritableAtom,
  atom,
  batch,
  Comment,
  component,
  computed,
  createContext,
  detectIsAtom,
  detectIsWritableAtom,
  detectIsReadableAtom,
  detectIsServer,
  Fragment,
  Guard,
  h,
  hot,
  lazy,
  memo,
  startTransition,
  Suspense,
  Text,
  useAtom,
  useCallback,
  useContext,
  useComputed,
  useDeferredValue,
  useEffect,
  useError,
  useEvent,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useStore,
  useSyncExternalStore,
  useTransition,
  useUpdate,
  View,
  VERSION,
} from '@dark-engine/core';
```

# Сore concepts...

<a id="elements"></a>

## Elements

Elements are a collection of platform-specific primitives and components. For the browser platform, these are tags, text, and comments.

#### `View`, `Text`, `Comment`

```tsx
import { View, Text, Comment } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
```

```tsx
const h1 = (props = {}) => View({ ...props, as: 'h1' });
const content = [h1({ slot: Text(`I'm the text inside the tag`) }), Comment(`I'm the comment`)];

createRoot(document.getElementById('root')).render(content);
```

<a id="jsx"></a>

## JSX
JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file.
You can use it:

### via `jsx-runtime`

In your `tsconfig.json`, you must add these rows:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@dark-engine/core",
  }
}
```
The necessary functions will be automatically imported into your code.

If for some reason you don't want to use auto-imports, then you should use a different approach.

### via `h`

This is the function you need to enable JSX support. In your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

In this case, you will always have to import the `h` function and the `Fragment` component yourself.

```tsx
import { h, Fragment } from '@dark-engine/core';
```

```tsx
const content = (
  <>
    <h1>I'm the text inside the tag</h1>
    <span>Hello</span>
  </>
);

createRoot(document.getElementById('root')).render(content);
```

<a id="components"></a>

## Components

Components are the fundamental logical units of a modern interface. Components can accept props, have their own internal state, and contain child elements or components.

```tsx
type SkyProps = {
  color: string;
};

const Sky = component<SkyProps>(({ color }) => {
  return <div style={`color: ${color}`}>My color is {color}</div>;
});

<Sky color='deepskyblue' />;
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

You can also use `Fragment` as an alias for an array:

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

<App>Content</App>;
```

<a id="conditional-rendering"></a>

## Conditional rendering

```tsx
const App = component(({ isOpen }) => {
  return isOpen ? <div>Hello</div> : null
});
```

```tsx
const App = component(({ isOpen }) => {
  return (
    <>
      <div>Hello</div>
      {isOpen && <div>Content</div>}
    </>
  );
});
```

```tsx
const App = component(({ isOpen }) => {
  return (
    <>
      <div>Hello</div>
      {isOpen ? <ComponentOne /> : <ComponentTwo />}
      <div>world</div>
    </>
  );
});
```

<a id="list-rendering"></a>

## List rendering

```tsx
const List = component(({ items }) => {
  return (
    <>
      {items.map(x => <div key={item.id}>{item.name}</div>)}
    </>
  );
});
```

```tsx
const List = component(({ items }) => {
  return items.map(x => <div key={x.id}>{x.title}</div>);
});
```

<a id="recursive-rendering"></a>

## Recursive rendering

You can put components into themself to get recursion if you want. But every recursion must have return condition for out. In other case we will have infinity loop. Recursive rendering might be useful for tree building or something else.

```tsx
const Item = component(({ level, current = 0 }) => {
  if (current === level) return null;

  return (
    <div style={`margin-left: ${current === 0 ? '0' : '10px'}`}>
      <div>level: {current + 1}</div>
      <Item level={level} current={current + 1} />
    </div>
  );
});

const App = component(() => {
  return <Item level={5} />;
});
```

```
level: 1
  level: 2
    level: 3
      level: 4
        level: 5
```

<a id="hooks"></a>

## Hooks
Hooks are needed to bring components to life: give them an internal state, start some actions, and so on. The basic rule for using hooks is to use them at the top level of the component, i.e. do not nest them inside other functions, cycles, conditions. This is a necessary condition, because hooks are not magic, but work based on array indices.

There are three types of main hooks: 

- A hook that allows you to store the state of a component between renders.
- A hook that starts the process of rerendering a component.
- A hook that triggers side effects.

All other hooks are somehow derived from these hooks.

#### `useState`

The hook to store the state and call to update a piece of the interface.

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

#### `useReducer`

It's  used when a component has multiple values in the same complex state, or when the state needs to be updated based on its previous value.

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

#### `useUpdate`

Simply starts the component rerender.

```tsx
const update = useUpdate();

console.log('render');

return (
  <>
    <button onClick={() => update()}>update</button>
  </>
);
```

<a id="effects"></a>

## Effects

Side effects are useful actions that take place outside of the interface rendering. For example, side effects can be fetch data from the server, calling timers, subscribing.

#### `useEffect`

Executed asynchronously, after rendering.

```tsx
const [albums, setAlbums] = useState<Array<Album>>([]);

useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/albums')
    .then(x => x.json())
    .then(x => x.slice(0, 10))
    .then(x => setAlbums(x));
}, []);

if (albums.length === 0) return <div>loading...</div>;

return (
  <ul>
    {albums.map(x => <li key={x.id}>{x.title}</li>)}
  </ul>
);
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

#### `useLayoutEffect`

This type of effect is similar to `useEffect`, however, it is executed synchronously right after the commit phase of new changes. Use this to read layout from the DOM and synchronously re-render.

```tsx
useLayoutEffect(() => {
  const height = rootRef.current.clientHeight;

  setHeight(height);
}, []);
```

#### `useInsertionEffect`

The signature is identical to `useEffect`, but it fires synchronously before all DOM mutations. Use this to inject styles into the DOM before reading layout in `useLayoutEffect`. This hook does not have access to refs and cannot call render. Useful for css-in-js libraries.

```tsx
useInsertionEffect(() => {
  // add style tags to head
}, []);
```

<a id="memoization"></a>

## Memoization

Memoization in Dark is the process of remembering the last value of a function and returning it if the parameters have not changed. Allows you to skip heavy calculations if possible.

#### `useMemo`

The hook for memoization of heavy calculations or heavy pieces of the interface:

```tsx
const memoizedOne = useMemo(() => Math.random(), []);
const memoizedTwo = useMemo(() => <div>{Math.random()}</div>, []);

<>
  {memoizedOne}
  {memoizedTwo}
</>
```

#### `useCallback`

Suitable for memoizing handler functions descending down the component tree:

```tsx
const handleClick = useCallback(() => setCount(count + 1), [count]);

<button onClick={handleClick}>add</button>
```

#### `useEvent`

Similar to `useCallback` but has no dependencies. Ensures the return of the same function, with the closures always corresponding to the last render. In most cases, it eliminates the need to track dependencies in `useCallback`.

```tsx
const handleClick = useEvent(() => setCount(count + 1));

<button onClick={handleClick}>add</button>
```

### `memo`

```tsx
const Memo = memo(component(() => {
  console.log('Memo render!');
  return <div>I'm Memo</div>;
}));

const App = component(() => {
  console.log('App render!');

  useEffect(() => {
    setInterval(() => root.render(<App />), 1000);
  }, []);

  return (
    <>
      <Memo />
    </>
  );
});

const root = createRoot(document.getElementById('root'));

root.render(<App />);
```
```
App render!
Memo render!
App render!
App render!
App render!
...
```

As the second argument, it takes a function that answers the question of when to re-render the component:

```tsx
const Memo = memo(Component, (prevProps, nextProps) => prevProps.color !== nextProps.color);
```

#### `Guard`

A component that is intended to mark a certain area of the layout as static, which can be skipped during updates. Based on `memo`.

```tsx
<Guard>
  <div>I'am always static</div>
</Guard>
```

<a id="refs"></a>

## Refs

To get full control over components or DOM nodes Dark suggests using refs.

#### `useRef`

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

#### `useImperativeHandle`

They are needed to create an object inside the reference to the component in order to access the component from outside:

```tsx
type ChildProps = {
  ref?: Ref<ChildRef>;
}

type ChildRef = {
  hello: () => void;
};

const Child = component<ChildProps>(({ ref }) => {
  useImperativeHandle(
    ref,
    () => ({
      hello: () => console.log('hello!'),
    }),
    [],
  );

  return <div>I'm Child</div>;
});

const App = component(() => {
  const childRef = useRef<ChildRef>(null);

  useEffect(() => {
    childRef.current.hello();
  }, []);

  return <Child ref={childRef} />;
});
```

<a id="catching-errors"></a>

## Catching errors

When you get an error, you can log it and show an alternate user interface.

#### `useError`

```tsx
type BrokenProps = {
  hasError: boolean;
};

const Broken = component<BrokenProps>(({ hasError }) => {
  if (hasError) {
    throw new Error('oh no!');
  }

  return <div>Hello!</div>;
});

const App = component(() => {
  const [hasError, setHasError] = useState(false);
  const error = useError();

  useEffect(() => {
    setTimeout(() => setHasError(true), 3000);
  }, []);

  if (error) return <div>Something went wrong! 🫢</div>;

  return (
    <>
      <Broken hasError={hasError} />
    </>
  );
});
```

<a id="context"></a>

## Context

The context might be useful when you need to synchronize state between deeply nested elements without having to pass props from parent to child.

#### `createContext` and `useContext`

```tsx
type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light');
const useTheme = () => useContext(ThemeContext);

const CurrentTheme = component(() => {
  const theme = useTheme();

  return <div style='font-size: 20vw;'>{theme === 'light' ? '☀️' : '🌙'}</div>;
});

const App = component(() => {
  const [theme, setTheme] = useState<Theme>('light');
  const handleToggle = () => setTheme(x => (x === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext value={theme}>
      <CurrentTheme />
      <button onClick={handleToggle}>Toggle: {theme}</button>
    </ThemeContext>
  );
});
```

If the context consumer is inside a memoized component that will skip the render from above when the context changes, then the consumer will automatically apply its internal render to apply the latest changes.

<a id="batching"></a>

## Batching

The strategy that allows you to merge similar updates into one render to reduce computational work.

#### `batch`

```tsx
useEffect(() => {
  const handleEvent = (e: MouseEvent) => {
    batch(() => {
      setClientX(e.clientX);
      setClientY(e.clientY); // render just this time
    });
  };

  document.addEventListener('mousemove', handleEvent);

  return () => document.removeEventListener('mousemove', handleEvent);
}, []);
```

<a id="atoms"></a>

## Atoms

Atoms, sometimes called signals, are fine-grained reactivity elements that are objects with useful data and methods that allow triggering updates in the component-consumer. Atoms can be successfully used as independent units of information storage, replacing the state manager functions. At the same time, they can be used as a tool for optimizing the performance of critical areas in combination with memoization. In this case, we can achieve the same performance as if the data were in the consumer's local state. The main idea is to split a large render into many smaller ones so that we don't have to process the calculation of the whole tree, even if it is memoized, because traversing memoized components is still a traversal, albeit a superficial one.

There are `writableAtom` and `ReadableAtom`. You can write values in `WritableAtom` using the `set` method. You cannot write to `ReadableAtom`; it is intended to be computed by a formula that is calculated based on its dependencies on other atoms.

#### `WritableAtom` and `atom`

```tsx
const a$ = atom(0); // a$ is instance of WritableAtom

a$.on(({ next }) => console.log(next));
a$.set(1);
a$.set(x => x + 1);

// 1
// 2
```

#### `ReadableAtom` and `computed`

```tsx
const a$ = atom(0);
const b$ = computed([a$], a => a ** 2); // b$ is instance of ReadableAtom

b$.on(({ next }) => console.log(next));
a$.set(1);
a$.set(2);
a$.set(3);

// 1
// 4
// 9
```

#### `useAtom`

When calling the `val` method, the atom automatically subscribes the component to change its value and then re-renders it.

```tsx
const App = component(() => {
  const a$ = useAtom(0);

  // <App /> won't render after a$ change cause there is no call a$.val() here
  return (
    <>
      <Child a$={a$} />
      <button onClick={() => a$.set(x => x + 1)}>increment</button>
    </>
  );
});

type ChildProps = {
  a$: WritableAtom<number>;
};

const Child = component<ChildProps>(({ a$ }) => {
  // Renders only <Child /> through call a$.val()
  return <div>{a$.val()}</div>;
});
```

You can pass function that will control rendering necessity.

```tsx
const a = a$.val((prev, next) => prev !== next && next >= 5);

<div>{a}</div>
```

#### `useComputed`

```tsx
const b$ = useComputed([a$], a => a ** 2);

<div>
  {a$.get()} ^ 2 = {b$.val()}
</div>

// 0 ^ 2 = 0
// 1 ^ 2 = 1
// 2 ^ 2 = 4
// 3 ^ 2 = 9
```

#### `useStore`

Retrieves atom values into an array and updates the component when atom values change. Uses batching to update.

```tsx
const [a, b] = useStore([a$, b$]);

<div>{a} ^ 2 = {b}</div>;
```

<a id="code-splitting"></a>

## Code splitting

#### `lazy` and `Suspense`

If your application is structured into separate modules, you may wish to employ lazy loading for efficiency. This can be achieved through code splitting. To implement lazy loading for components, dynamic imports of the component must be wrapped in a specific function - `lazy`. Additionally, a `Suspense` component is required to display a loading indicator or skeleton screen until the module has been fully loaded.

```tsx
const Page = lazy(() => import('./page'));

const App = component(() => {
  const [isNewPage, setIsNewPage] = useState(false);

  return (
    <>
      <button onClick={() => setIsNewPage(x => !x)}>toggle</button>
      {isNewPage && (
        <Suspense fallback={<div>Loading...</div>}>
          <Page />
        </Suspense>
      )}
    </>
  );
});

// Loading... -> <Page />
```

<a id="async-rendering"></a>

## Async rendering

Dark is designed with support for asynchronous rendering. This implies that following the mounting of each component during the reconciliation phase, the core checks if a preset deadline has been reached. If the deadline is met, control of the event loop is yielded to other code, resuming at the next tick. If the deadline is not yet met, the core continues the rendering process. The deadline is consistently set at 6 milliseconds.

By default, core runs in synchronous mode, however, if Dark understands that it is rendering on the server, it goes into asynchronous mode and can wait for lazy modules to load and asynchronous code to execute if the `useQuery` hook from `@dark-engine/data` package is used.

<a id="cocurrent-rendering"></a>

## Concurrent rendering

Concurrent rendering is a strategy that enables the assignment of the lowest priority to updates, allowing them to execute in the background without obstructing the main thread. Upon the arrival of higher-priority updates, such as user render events, the low-priority task is halted and retains all essential data for potential reinstatement (or permanent cancellation) by the scheduler, if there won't be further high-priority updates. This technique facilitates the creation of fluid user interfaces.

#### `startTransition`

Marks the update as low-priority and renders it in the background. This allows you to switch between tabs quickly, even if they are rendered slowly due to the large number of calculations. When switching tabs, unnecessary work is marked as obsolete and removed from the task list.

```tsx
const selectTab = (name: string) => startTransition(() => setTab(name));

<>
  <TabButton onClick={() => selectTab('about')}>
    About
  </TabButton>
  <TabButton onClick={() => selectTab('posts')}>
    Posts
  </TabButton>
  <TabButton onClick={() => selectTab('contact')}>
    Contact
  </TabButton>
  {tab === 'about' && <AboutTab />}
  {tab === 'posts' && <PostsTab />}
  {tab === 'contact' && <ContactTab />}
</>
```

#### `useTransition`

Allows you to create a version of `startTransition` and a flag `isPending` that will show what stage of concurrent rendering we are in.

```tsx
const [isPending, startTransition] = useTransition();
const handleClick = () => startTransition(() => onClick());

<button style={`color: ${isPending ? 'red' : 'yellow'}`}>{slot}</button>;
```

#### `useDeferredValue`

This fixes an issue with an unresponsive interface when user input occurs, based on which heavy calculations or heavy rendering is recalculated.
Returns a delayed value that may lag behind the main value. It can be combined with each other and with useMemo and memo for amazing responsiveness results...

```tsx
const [name, setName] = useState('');
const deferredName = useDeferredValue(name);
const isStale = name !== deferredName;
const handleInput = e => setName(e.target.value);

// <List /> should be a memo component

return (
  <div>
    <input value={name} onInput={handleInput} />
    <List name={deferredName} isStale={isStale} />
  </div>
);
```

<a id="hmr"></a>

## Hot Module Replacement (HMR)

Allows you to avoid reloading the entire interface when changing code in development mode. Saves the state of other components, because under the hood, instead of reloading the page, it simply performs a new render as if the interface was rebuilt not by new code, but by the user.

#### `hot`

```tsx
// index.tsx
import { hot } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

import { App } from './app';

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept('./app', () => {
    hot(() => root.render(<App />));
  });
}

const root = createRoot(document.getElementById('root'));

root.render(<App />);
```

<a id="others"></a>

## Others

#### `useId`

The hook for generating unique identifiers that stable between renders.

```tsx
const id = useId();

// generates something like this 'dark:0:lflt'
<>
  <label for={id}>Do you like it?</label>
  <input id={id} type='checkbox' name='likeit' />
</>
```

#### `useSyncExternalStore`

It's useful for synchronizing render states with an external state management library such as Redux.

```tsx
const state = useSyncExternalStore(store.subscribe, store.getState); // redux store
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
