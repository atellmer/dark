# @dark-engine/data 🌖

Declarative queries and mutations for Dark

[More about Dark](https://github.com/atellmer/dark)

## Installation
npm:
```
npm install @dark-engine/data
```

yarn:
```
yarn add @dark-engine/data
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/data/dist/umd/dark-data.production.min.js"></script>
```

## Usage

```tsx
const { isFetching, data, error } = useQuery('users', fetchUsers);

if (isFetching && !data) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

return (
  <ul>
    {data.map(x => <li key={x.id}>{x.name}</li>)}
  </ul>
);
```

## API

```tsx
import {
  type Query,
  type CacheRecord,
  DataClient,
  DataProvider,
  InMemoryCache,
  useClient,
  useApi,
  useCache,
  useQuery,
  useLazyQuery,
  useMutation,
  VERSION,
} from '@dark-engine/data';
```

#### `useQuery`

This hook is designed to work with asynchronous resources, such as network requests. When rendered in the browser, it knows how to interact with `Suspense`, display the loader, and also the error, if there is one. When rendering on the server, it immediately begins to load the resource in order to provide useful asynchronous content to the server. When hydrated, the state of the hook is restored as if it were running in the browser. This allows us to solve the problem with asynchronous data and how to work with it in the same way both in the browser and on the server.

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

