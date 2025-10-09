# @dark-engine/signals 🌖

Reactive signals system for [Dark](https://github.com/atellmer/dark).

## Theory

**Signal** is a primitive for storing reactive value. Changing a signal automatically notifies all computations and effects that use it.

**Computed** is a value calculated based on other signals or computations. They are lazy: recalculated only when accessed and only if their dependencies have changed (versioning is used to track freshness).

**Effect** is a function that automatically runs when the signals or computations used inside them change. Use effects for side effects like logging, syncing signals, or updating UI.

## Features

- ⚡ High performance, optimal dependency graph, minimal recalculations
- 🔗 Automatic dependency tracking
- ⏱️ Fully synchronous by default, with optional async support
- 🛡️ Protection from cyclic dependencies
- 🧠 Lazy computations with versioning
- 🧩 Seamless integration via hooks
- 📦 Small size (1.5kb gzipped)

### Automatic Dependency Tracking

The library implements autotracking: dependencies of computations and effects are determined automatically during their execution. This eliminates the need to explicitly specify what to subscribe to.

### Protection from Cyclic Dependencies

The model is designed so that cyclic dependencies between computations are impossible by design. This prevents infinite loops and errors in the reactive system. The computation graph either stabilizes in a single evaluation pass or fails fast with an error, making cyclic dependencies immediately visible.

### Computed Specifics

In this implementation, `computed` does not subscribe itself to effects. Instead, when an effect uses a computation, the subscription is forwarded to the source signals that the computation depends on.

**Why is this good:**
- Eliminates redundant subscriptions and recalculations.
- Simplifies the reactivity graph.
- Improves performance: effects react only to real data changes, not to intermediate computations.



## Installation

npm:
```
npm install @dark-engine/signals
```

yarn:
```
yarn add @dark-engine/signals
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/signals/dist/umd/dark-signals.production.min.js"></script>
```

## Usage

```tsx
const count$ = signal(0);

effect(() => {
  console.log('count:', count$.get());
});

const App = component(() => (
  <>
    <div>Count: {count$.get()}</div>
    <button onClick={() => count$.set(x => x + 1)}>Increment</button>
  </>
));
```

## API

```tsx
import {
  type Signal,
  type Computed,
  type Effect,
  signal,
  computed,
  effect,
  useSignal,
  useComputed,
  useSignalEffect,
  useSelected,
  VERSION,
} from '@dark-engine/signals';
```

### `signal`

Creates a reactive value.

```tsx
const count$ = signal(0);

count$.set(1);
count$.set(2);
console.log(count$.get()) // 2
```

`peek` method reads value without any subscription

```tsx
console.log(count$.peek()) // 2
```

### `computed`

Creates a lazy computed value, automatically tracks dependencies.

```tsx
const count$ = signal(1);
const double$ = computed(() => count$.get() * 2);

count$.set(1);
count$.set(2);
console.log(double$.get()) // 4
```

### `effect`

Creates a side effect that automatically runs when dependencies change.

```tsx
const count$ = signal(1);

effect(() => {
  console.log('count:', count$.get());
});

count$.set(x => x + 1);
count$.set(x => x + 1);

// effect prints 'count: 1'
// effect prints 'count: 2'
// effect prints 'count: 3'
```

### `useSignal`

Hook for creating a signal inside a Dark component. The signal preserves its state between component renders.

```tsx
const App = component(() => {
  const count$ = useSignal(0);

  return (
    <>
      <div>Count: {count$.get()}</div>
      <button onClick={() => count$.set(x => x + 1)}>Increment</button>
    </>
  );
});
```

### `useComputed`

Hook for creating a computed value inside a component. Automatically recalculates when dependencies change.

```tsx
const App = component(() => {
  const count$ = useSignal(1);
  const double$ = useComputed(() => count$.get() * 2);

  return (
    <>
      <div>Count: {count$.get()}</div>
      <div>Double: {double$.get()}</div>
      <button onClick={() => count$.set(x => x + 1)}>Increment</button>
    </>
  );
});
```

### `useSignalEffect`

Hook for creating an effect inside a component. The effect automatically subscribes to signals and computeds used inside the function.

```tsx
const App = component(() => {
  const value$ = useSignal('hello');

  useSignalEffect(() => {
    console.log('value changed:', value$.get());
  });

  return (
    <>
      <input
        value={value$.get()}
        onInput={e => value$.set(e.target.value)}
      />
      <div>Value: {value$.get()}</div>
    </>
  );
});
```

# Blow your mind

What will happen when this code runs? An infinite loop?

```tsx
const a$ = signal(0);

effect(() => {
  console.log(a$.get());
  a$.set(x => x + 1);
});
```

In other signal implementations (Solid, Preact, etc.) - yes.
But in Dark, only one line will be printed to the console. And all this happens synchronously in one tick of the event loop.
```tsx
// 0
```

And here?
```tsx
const a$ = signal(1);
const b$ = computed(() => a$.get() + 1);
const c$ = computed(() => b$.get() + 1);

effect(() => {
  a$.set(c$.get());
  console.log('a:', a$.get(), 'b:', b$.get(), 'c:', c$.get());
});
```

The same
```tsx
// a: 3 b: 4 c: 5
```

![Image](https://github.com/user-attachments/assets/e81289d2-f2af-458e-9cff-aef9eb7cb768)

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
