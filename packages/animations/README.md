# @dark-engine/animations 🌖

Spring based animations for Dark

[More about Dark](https://github.com/atellmer/dark)

## Features
- Smooth natural animations with max FPS based on spring physics
- No durations and curves, only physic parameters
- No rerenders
- Can use for web, native and desktop
- SSR
- Includes trails and transitions support
- Animation sequences

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
      from: { opacity: 0 },
      to: { opacity: isOpen ? 1 : 0 },
    },
    [isOpen],
  );
  const style = useStyle(styled => ({
    root: styled`
      width: 100px;
      height: 100px;
      background-color: darkcyan;
    `,
  }));

  return (
    <>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <Animated spring={spring} fn={styleFn}>
        <div style={style.root} />
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



# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

