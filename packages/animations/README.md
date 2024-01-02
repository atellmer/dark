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
In the Dark library, animations are grounded in the principles of spring physics. To achieve the desired effect, it’s necessary to fine-tune parameters such as mass, tension, and friction. The animation comes to life using an appropriate hook. The transmission of property values is facilitated through a unique `Animated` component, which serves as a conduit between the hook and the animated element. The entire process unfolds via a subscription, eliminating the need for component rerenders. This approach ensures a seamless and efficient animation experience.


## useSpring

A hook that allows you to animate multiple values at once.

```tsx
const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [spring] = useSpring(
    {
      from: { opacity: d(isOpen), scale: d(isOpen) },
      to: { opacity: d(isOpen), scale: d(isOpen) },
    },
    [isOpen],
  );
  const style = useStyle(styled => ({
    box: styled`
      width: 100px;
      height: 100px;
      background-color: red;
      opacity: ${spring.prop('opacity')};
      transform: scale(${spring.prop('scale')});
    `,
  }));

  return (
    <>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <Animated spring={spring} fn={styleFn}>
        <div style={style.box} />
      </Animated>
    </>
  );
});

const d = (isOpen: boolean) => (isOpen ? 1 : 0);
const styleFn = (e: HTMLElement, x: SpringValue<'opacity' | 'scale'>) => {
  e.style.setProperty('opacity', `${x.opacity}`);
  e.style.setProperty('transform', `scale(${x.scale})`);
};
```

What's going on here?
- First, the animation hook is called, to which a config is passed with the from and to parameters, which change depending on the flag in the state.
- The following describes a set of default styles that creates a red square. You may also notice that the opacity and transform properties are passed into the style. This is necessary in order to set default values during the first render and remove a possible flash of styles.
- The `Animated` component is then called, taking a spring object and a function describing how it should change styles during the animation process.

[video-1]

## useSprings

A generalized version of `useSpring` takes as input the number of elements that need to be animated, as well as a function that creates a config depending on the index of the element. Needed for creating complex animations where elements are processed taking into account the position and other parameters of other elements. Example: drag-n-drop lists.

```tsx
const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [springs] = useSprings(
    2,
    idx => ({
      from: { opacity: d(isOpen, idx) },
      to: { opacity: d(isOpen, idx) },
      config: () => ({ friction: isOpen ? 200 : 100 }),
    }),
    [isOpen],
  );

  return (
    <>
      <div class='container' onClick={() => setIsOpen(x => !x)}>
        {springs.map((spring, idx) => (
          <Animated spring={spring} fn={styleFn}>
            <div class='emoji'>{idx % 2 ? '🤪' : '😊'}</div>
          </Animated>
        ))}
      </div>
    </>
  );
});

const d = (isOpen: boolean, idx: number) => (idx % 2 ? (isOpen ? 1 : 0) : isOpen ? 0 : 1);
const styleFn = (e: HTMLElement, x: SpringValue<'opacity'>) => {e.style.setProperty('opacity', `${x.opacity}`);
```

[video-2]

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

