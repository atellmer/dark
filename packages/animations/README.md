# @dark-engine/animations 🌖

Spring based animations for Dark

[More about Dark](https://github.com/atellmer/dark)

## Features
- 🎉 Smooth natural animations with max FPS based on spring physics
- ⏱️ No durations and curves, only physic parameters
- 🔄 No rerenders
- 🛸 Can use for web, native and desktop
- 💽 SSR
- 🎊 Includes trails and transitions support
- 🎢 Animation sequences
- ✂️ No deps
- 📦 Small size (5 kB gzipped)

## Installation
npm:
```
npm install @dark-engine/animations
```

yarn:
```
yarn add @dark-engine/animations
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/animations/dist/umd/dark-animations.production.min.js"></script>
```

## Usage

```tsx
import { type SpringValue, Animated, useSpring } from '@dark-engine/animations';
```

```tsx
const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [spring] = useSpring(
    {
      from: { opacity: val(isOpen) },
      to: { opacity: val(isOpen) },
    },
    [isOpen],
  );

  return (
    <>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <Animated spring={spring} fn={styleFn}>
        <div>Hello</div>
      </Animated>
    </>
  );
});

const val = (isOpen: boolean) => isOpen ? 1 : 0;
const styleFn = (e: HTMLElement, x: SpringValue<'opacity'>) => e.style.setProperty('opacity', `${x.opacity}`);
```

## API
```tsx
import {
  type Spring,
  type SpringValue,
  Animated,
  useSpring,
  useSprings,
  useTrail,
  useTransition,
  useChain,
  preset,
  VERSION,
} from '@dark-engine/animations'
```

## Getting Started

In the library, animations are grounded in the principles of spring physics. To achieve the desired effect, it’s necessary to fine-tune parameters such as mass, tension, and friction. The animation comes to life using an appropriate hook. The transmission of property values is facilitated through a special `Animated` component, which serves as a conduit between the hook and the animated element. The entire process unfolds via a subscription, eliminating the need for component rerenders. This approach ensures a seamless and efficient animation experience.

## `useSpring`

The hook that allows you to animate multiple values at once.

```tsx
const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [spring] = useSpring(
    {
      from: { opacity: val(isOpen), scale: val(isOpen) },
      to: { opacity: val(isOpen), scale: val(isOpen) },
      config: key => ({ tension: key === 'scale' ? 200 : isOpen ? 100 : 400, precision: 4 }),
    },
    [isOpen],
  );

  return (
    <>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <Animated spring={spring} fn={styleFn}>
        <div class='box'>Hello world</div>
      </Animated>
    </>
  );
});

const val = (isOpen: boolean) => (isOpen ? 1 : 0);
const styleFn = (element: HTMLDivElement, value: SpringValue<'opacity' | 'scale'>) => {
  element.style.setProperty('opacity', `${value.opacity}`);
  element.style.setProperty('transform', `scale(${value.scale}) translate(-50%, -50%)`);
};
```

What's going on here?
- First, the animation hook is called, to which a config is passed with the `from` and `to` parameters, which change depending on the flag in the state.
- The `Animated` component is taking a spring object and a function describing how it should change styles during the animation process.
- When the state changes, physical parameters are calculated and styles are applied 1 time per 1 frame until the parameters reach the value `from` or `to` depending on the flag.

[spring-toast example](https://github.com/atellmer/dark/tree/master/examples/spring-toast)

https://github.com/atellmer/dark/assets/16635118/42b400a0-fa35-4440-b23b-35d27531591d

## `useSprings`

A generalized version of `useSpring` takes as input the number of elements that need to be animated, as well as a function that creates a config depending on the index of the element. Needed for creating complex animations where elements are processed taking into account the position and other parameters of other elements.

```tsx
const [springs, api] = useSprings(4, idx => createConfig(idx));

...
const handleDragStart = (idx: number) => e => {
  ...
  api.start(createConfig(idx));
};
...

return (
  ...
  <div class='content'>
    {springs.map((spring, idx) => {
      return (
        <Animated spring={spring} fn={styleFn}>
          <div class='item' onPointerDown={handleDragStart(idx)}>{idx}</div>
        </Animated>
      );
    })}
  </div>
)
```

[spring-draggable-list example](https://github.com/atellmer/dark/tree/master/examples/spring-draggable-list)

https://github.com/atellmer/dark/assets/16635118/453b9249-9667-4e80-b456-a48fdf2a8334

## `useTrail`

The hook is also based on `useSprings`, but with minor changes that allow you to apply animations with a slight delay relative to other animated elements. In this case, the delay is not based on timeout, but on events. Can be useful for creating synchronously moving components.

```tsx
const [size, setSize] = useState(10);
const [springs, api] = useTrail(size, () => ({
  from: { x: -100, y: -100 },
  config: () => preset('gentle'),
}));

...

return (
  ...
  <>
    {springs.map((spring, idx) => {
      return (
        <Animated spring={spring} fn={styleFn(idx)}>
          <Item />
        </Animated>
      );
    })}
  </>
);
```

[spring-snake example](https://github.com/atellmer/dark/tree/master/examples/spring-snake)

https://github.com/atellmer/dark/assets/16635118/1342931b-004e-4b7b-9faf-6adf251abc35

## `useTransition`

The hook that animates any manipulations with the tree: adding, moving, replacing and deleting nodes. It works on the basis of an array of data, each element of which has a unique key, which allows you to compare diff elements. Returns a special `transition` function within which it manages the keys.

```tsx
const [items, setItems] = useState(['A']);
const [transition] = useTransition(
  items,
  x => x,
  () => ({
    from: { opacity: 0, x: isNext ? 100 : -100 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: isNext ? -50 : 50 },
  }),
);

...

return (
  ...
  <Container>
    {transition(({ spring, item }) => {
      return (
        <Animated spring={spring} fn={styleFn}>
          <Item $color={colors[item]}>{item}</Item>
        </Animated>
      );
    })}
  </Container>
)
```

[spring-slider example](https://github.com/atellmer/dark/tree/master/examples/spring-slider)

[spring-masonry-grid example](https://github.com/atellmer/dark/tree/master/examples/spring-masonry-grid)

https://github.com/atellmer/dark/assets/16635118/dc1019d2-512d-4d7a-99c0-48c52c08270b

https://github.com/atellmer/dark/assets/16635118/2584d8e0-d44e-4575-9d3d-cc2a62a96692


## `useChain`

Allows you to create chains of heterogeneous animations (springs, trails, transitions), which are launched in a certain sequence. Can be used to create complex animations of the appearance or disappearance of interface elements.

```tsx
const [spring, springApi] = useSpring(
  {
    from: { size: 20, green: 105, blue: 180 },
    to: { size: isOpen ? 100 : 20, green: isOpen ? 255 : 105, blue: isOpen ? 255 : 180 },
    config: () => preset('stiff'),
  },
  [isOpen],
);
const [transition, transitionApi] = useTransition(
  isOpen ? data : [],
  x => x.name,
  () => ({
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    trail: 400 / data.length,
  }),
);

useChain(isOpen ? [springApi, transitionApi] : [transitionApi, springApi], [0, isOpen ? 0.1 : 0.6]);

...

return (
  ...
  <Animated spring={spring} fn={springStyleFn}>
    <div class='container' onClick={() => setIsOpen(x => !x)}>
      {transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={transitionStyleFn(item)}>
            <div class='item' />
          </Animated>
        );
      })}
    </div>
  </Animated>
);
```

[spring-menu example](https://github.com/atellmer/dark/tree/master/examples/spring-menu)

https://github.com/atellmer/dark/assets/16635118/c1d3e472-dc0b-4861-8b05-3cbf9ef71f2c


# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

