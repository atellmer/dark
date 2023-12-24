# @dark-engine/platform-server 🌖

Dark renderer for Node.js.

[More about Dark](https://github.com/atellmer/dark)

A normal Dark application runs in the browser, rendering pages in the DOM in response to user actions. You can also render on the server by creating static application pages that are later loaded on the client. This means that the app typically renders faster, allowing users to preview the layout of the app before it becomes fully interactive.
The basic principle: on the server, the component code is rendered into a string, which the server returns in response to a request in the form of a file to which the assembled build of the front-end code is connected. The user receives a rendered page with content instantly, while Dark performs a hydration process, i.e. reuses DOM nodes already created on the server, hangs event handlers, and also performs all relying effects.

You can also render through Node.js API into html files directly then save them to give away next without hydration. In this case you will get a static site generation.

## Installation
npm:
```
npm install @dark-engine/core @dark-engine/platform-browser @dark-engine/platform-server
```
yarn:
```
yarn add @dark-engine/core @dark-engine/platform-browser @dark-engine/platform-server
```

## API

```tsx
import { renderToString, renderToStream } from '@dark-engine/platform-server';
```

## Usage
Suppose you have a directory like this:

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

### renderToString

The method renders app to string async to unblock main thread of Node.js

```tsx
// server/app.ts
import { renderToString } from '@dark-engine/platform-server';
import { Page, App } from '../client/app';

server.use(express.static(join(__dirname, '../client/static')));

server.get('/', async (req, res) => {
  const content = Page({ title: 'SSR test', slot: App() });
  const app = await renderToString(content);
  const page = `<!DOCTYPE html>${app}`;

  res.statusCode = 200;
  res.send(page);
});
```

```tsx
// client/app.tsx
import { h, component } from '@dark-engine/core';

const Page = component(({ title, slot }) => {
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>
        <div id="root">{slot}</div>
        <script src="./build.js" defer></script>
      </body>
    </html>
  );
})

const App = component(() => <div>Hello World</div>);

export { Page, App };
```

```tsx
// client/index.tsx
import { h } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './app';

hydrateRoot(document.getElementById('root'), <App />);
```

### renderToStream

Dark can render to readable streams, i.e. give chunks of data as quickly as possible when starting rendering. This method works better for some Lighthouse metrics.

```tsx
import { renderToStream } from '@dark-engine/platform-server';

server.get('/', (req, res) => {
  const content = Page({ title: 'SSR test', slot: App() });
  const stream = renderToStream(content);

  res.statusCode = 200;
  stream.pipe(res);
});
```
Working example of app is in examples folder called server-side-rendering.

## Lazy modules

Dark is written in such a way that it has full support for asynchronous lazy code modules in the rendering process on the server. If Dark encounters a lazy module that is not yet cached, it aborts rendering and waits for the module to be loaded and cached, then resumes rendering where it left off. In subsequent rendering, all modules will be taken from the cache.

As a result, all lazy modules will be fully loaded and the user will receive all the content. If the rendering takes place on the client, the lazy module will be processed through the Suspense component showing the spinner or skeleton.

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

