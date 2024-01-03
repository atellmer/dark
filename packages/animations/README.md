# @dark-engine/animations 🌖

Spring based animations for Dark

[More about Dark](https://github.com/atellmer/dark)

## Features
- 🎉 Smooth natural animations with max FPS based on spring physics
- ⏱️ No durations and curves, only physic parameters
- 🔄 No rerenders
- 🧭 Can use for web, native and desktop
- 💻 SSR
- 🎊 Includes trails and transitions support
- 🪅 Animation sequences
- 🚫 No deps
- 📦 Small size

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
      from: { opacity: isOpen ? 1 : 0 },
      to: { opacity: isOpen ? 1 : 0 },
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

const styleFn = (e: HTMLElement, x: SpringValue<'opacity'>) => e.style.setProperty('opacity', `${x.opacity}`);
```

## Installation
npm:
```
npm install @dark-engine/animations
```

yarn:
```
yarn add @dark-engine/animations
```

## API
```tsx
import {
  type SpringValue,
  Animated,
  useSpring,
  useSprings,
  useTrail,
  useTransition,
  useChain,
  preset,
} from '@dark-engine/animations'
```

## Getting Started
In the Dark library, animations are grounded in the principles of spring physics. To achieve the desired effect, it’s necessary to fine-tune parameters such as mass, tension, and friction. The animation comes to life using an appropriate hook. The transmission of property values is facilitated through a special `Animated` component, which serves as a conduit between the hook and the animated element. The entire process unfolds via a subscription, eliminating the need for component rerenders. This approach ensures a seamless and efficient animation experience.


## useSpring

A hook that allows you to animate multiple values at once.

```tsx
type SpringProps = 'opacity' | 'scale';

const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [spring] = useSpring<SpringProps>(
    {
      from: { opacity: d(isOpen), scale: d(isOpen) },
      to: { opacity: d(isOpen), scale: d(isOpen) },
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

const d = (isOpen: boolean) => (isOpen ? 1 : 0);
const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  element.style.setProperty('opacity', `${value.opacity}`);
  element.style.setProperty('transform', `scale(${value.scale}) translate(-50%, -50%)`);
};
```

What's going on here?
- First, the animation hook is called, to which a config is passed with the `from` and `to` parameters, which change depending on the flag in the state.
- The `Animated` component is taking a spring object and a function describing how it should change styles during the animation process.
- When the state changes, physical parameters are calculated and styles are applied 1 time per 1 frame until the parameters reach the value `from` or `to` depending on the flag.

[Link to this example](https://github.com/atellmer/dark/tree/master/examples/spring-toast)
[video-1]

## useSprings

A generalized version of `useSpring` takes as input the number of elements that need to be animated, as well as a function that creates a config depending on the index of the element. Needed for creating complex animations where elements are processed taking into account the position and other parameters of other elements. Example: drag-n-drop lists.

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

[Link to this example](https://github.com/atellmer/dark/tree/master/examples/spring-draggable-list)
[video-2]

## useTrail

The hook is also based on `useSprings`, but with minor changes that allow you to apply animations with a slight delay relative to other animated elements. In this case, the delay is not based on timeout, but on events. Can be useful for creating synchronously moving components.

```tsx
const [size, setSize] = useState(10);
const [springs, api] = useTrail(size, () => ({
  from: { x: -100, y: -100 },
  config: () => preset('gentle'),
}));

...

return (
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

[Link to this example](https://github.com/atellmer/dark/tree/master/examples/spring-snake)
[video-3]


## useTransition

A hook that animates any manipulations with the tree: adding, moving, replacing and deleting nodes. It works on the basis of an array of data, each element of which has a unique key, which allows you to compare diff elements. Returns a special `transition function` within which it manages the keys.

```tsx
const [items, setItems] = useState(['A']);
const [transition] = useTransition<SpringProps, string>(
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

[Link to this example](https://github.com/atellmer/dark/tree/master/examples/spring-slider)
[video-4]
[video-5]

## useChain

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

[Link to this example](https://github.com/atellmer/dark/tree/master/examples/spring-menu)
[video-6]

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

