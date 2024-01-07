# @dark-engine/core 🌖

A core package that abstracts away the specific code running platform.

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

## API

```tsx
import {
  type DarkElement,
  type ElementKey,
  type ComponentFactory,
  type VirtualNodeFactory,
  type Component,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type StandardComponentProps,
  type Atom,
  type WritableAtom,
  type ReadableAtom,
  type Ref,
  type MutableRef,
  type FunctionRef,
  type Reducer,
  type Dispatch,
  h,
  View,
  Text,
  Comment,
  Fragment,
  Suspense,
  Guard,
  component,
  createContext,
  memo,
  lazy,
  atom,
  batch,
  hot,
  forwardRef,
  computed,
  useUpdate,
  startTransition,
  useTransition,
  useAtom,
  useComputed,
  useStore,
  useMemo,
  useCallback,
  useEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useInsertionEffect,
  useError,
  useRef,
  useId,
  useState,
  useReducer,
  useResource,
  useDeferredValue,
  useSyncExternalStore,
  useImperativeHandle,
  detectIsServer,
} from '@dark-engine/core';
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
