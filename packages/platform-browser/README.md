# @dark-engine/platform-browser 🌖

Dark renderer for browser.

[More about Dark](https://github.com/atellmer/dark)

## Installation

from template:
```
npx degit github:atellmer/dark/templates/browser app
```

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
<script src="https://unpkg.com/@dark-engine/platform-browser/dist/umd/dark-platform-browser.production.min.js"></script>
```

## API

```tsx
import {
  type DarkJSX,
  type SyntheticEvent,
  type CSSProperties,
  createRoot,
  hydrateRoot,
  createPortal,
  factory,
} from '@dark-engine/platform-browser';
```

## Mounting the app
To create an application entry point, you need to use the special `createRoot` method.

```tsx
import { createRoot } from '@dark-engine/platform-browser';
```
```tsx
const root = createRoot(document.getElementById('root'));

root.render(<App />);
```

## More than one host
The platform supports rendering multiple independent applications to different DOM elements. This can be useful for creating custom widgets that don't affect how the main application works.

```tsx
const root1 = createRoot(document.getElementById('root-1'));
const root2 = createRoot(document.getElementById('root-2'));

root1.render(<AppOne />);
root2.render(<AppTwo />);
```

## Rerenders

```tsx
setInterval(() => {
  count++;
  root.render(<App count={count} />);
}, 1000);
```
## Unmounting the app
Clears all subscriptions, variables and content without a trace.

```tsx
root.unmount();
```

## Event system

Dark employs the standard DOM event system, with event names written in camelCase. Event handlers are functions passed to event attributes, which receive a synthetic event encapsulating a native event.

#### Synthetic Events

Synthetic events are utilized to emulate the behavior of `stopPropagation`. This emulation is necessary due to Dark's performance-optimized approach of delegating native events to the document element, rather than the originating element.

#### Event Delegation

For instance, when subscribing to a button click event, the event is monitored across the entire document, not on the button. This is a key aspect of Dark's event handling mechanism.

```tsx
import { type SyntheticEvent } from '@dark-engine/platform-browser';
```

```tsx
const handleInput = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => setValue(e.target.value);
const handleClick = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => console.log('click');

<input value={value} onInput={handleInput} />
<button onClick={handleClick}>Click me</button>
```

## Portals

This refers to a browser-specific feature that allows the redirection of the rendering flow to another element in the DOM tree. It's primarily used for modal windows, dropdown menus, and any situation where it's crucial to prevent overlap by the parent container due to configured CSS overflow.

```tsx
import { createPortal } from '@dark-engine/platform-browser';
```

```tsx
const App = component(() => {
  const host = useMemo(() => document.createElement('div'), []);

  useLayoutEffect(() => {
    document.body.appendChild(host);
    return () => document.body.removeChild(host);
  }, []);

  return (
    <>
      <div>Hello world</div>
      {createPortal(<div>I will be placed in a new container</div>, host)}
    </>
  );
});
```

## Factory

The function that creates elements based on their name if you don't use JSX.

```tsx
import { factory } from '@dark-engine/platform-browser';
```

```tsx
const div = factory('div'); // <div></div>
const customElement = factory('custom-element'); // <custom-element></custom-element>
```

For convenience, the package exports all html and svg tags:

```tsx
import { Text } from '@dark-engine/core';
import { div, button, input, svg, ... } from '@dark-engine/platform-browser';
```

You can use it like this:

```tsx
div({
  slot: [
    button({
      class: 'awesome-button',
      onClick: () => console.log('click'),
      slot: Text('Click me'),
    })
  ]
})
```

it's the same as writing

```tsx
<div>
  <button
    class="awesome-button"
    onClick={() => console.log('click')}>
    Click me
  </button>
</div>
```

## Hydration

Hydration is the process of reinstating the interactivity of an application once the content, delivered as a string and a JavaScript bundle, has been received by the user's browser. This process is achieved by reusing pre-existing DOM nodes, initializing the library's internal mechanisms, and attaching event handlers.

```tsx
import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './app';

hydrateRoot(document.getElementById('root'), <App />);
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

