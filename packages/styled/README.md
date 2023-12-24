# @dark-engine/styled 🌖

Styled components for Dark.

[More about Dark](https://github.com/atellmer/dark)

## Features
- Comprehensive CSS support
- Encapsulated scope
- Accommodation of global styles
- Styles dictated by component properties
- CSS Animations via keyframes
- Theming
- SSR

## Usage
```tsx
const Button = styled.button<{
  $primary?: boolean;
}>`
  display: inline-block;
  font-size: 1rem;
  padding: 0.5rem 0.7rem;
  background-color: var(--color);
  color: var(--text-color);
  border: 1px solid var(--color);
  border-radius: 3px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--hover-color);
  }
  &:active {
    background-color: var(--color);
  }

  ${p => css`
    --color: ${p.$primary ? '#BA68C8' : '#eee'};
    --hover-color: ${p.$primary ? '#8E24AA' : '#E0E0E0'};
    --text-color: ${p.$primary ? '#fff' : '#000'};
  `}
`;

<Button>Default</Button>
<Button $primary>Primary</Button>
```

## Installation
npm:
```
npm install @dark-engine/styled
```

yarn:
```
yarn add @dark-engine/styled
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/styled/dist/umd/dark-styled.production.min.js"></script>
```

## API
```tsx
import {
  ServerStyleSheet,
  ThemeProvider,
  createGlobalStyle,
  keyframes,
  useTheme,
  useStyle,
  styled,
  css,
} from '@dark-engine/styled';
```

## Getting Started

Styled uses tagged template literals to describe styles and create a final styled component that can be rendered like a regular Dark component, which can be nested with children and passed props. Under the hood, styled parses the style string into a simple AST in one pass, which is then transformed into final CSS and inserted into the DOM. At the same time, styles are divided into static and dynamic (based on props) for greater fragmentation of reused CSS classes. CSS classes are generated based on a fast non-cryptographic hash function and attached to DOM nodes.

```tsx
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

const Layout = styled.section`
  padding: 4em;
  background: papayawhip;
`;

return (
  <Layout>
    <Title>
      Hello World!
    </Title>
  </Layout>
);
```

## Working with dynamic styles

To transmit dynamic data, it is recommended to use props names that begin with $, if these properties should not end up in the attributes of the DOM node.

```tsx
const Box = styled.div<{ $color: string }>`
  width: 100px;
  height: 100px;
  background-color: ${p => p.$color};
`;

<Box $color='red' />
<Box $color='green' />
<Box $color='blue' />
```

If you need to dynamically generate something more than just a style property value, then you need to always use a special css function that converts the style string to an AST.

```tsx
const Box = styled.div<{ $color: string }>`
  width: 100px;
  height: 100px;

  ${p => css`
    background-color: ${p.$color};
  `}
`;
```

## Extending Styles

To reuse already written styles, you can wrap a ready-made styled component in a styled function. In this case, a new component will be created that will combine all the styles of the parent component with its own styles, which will take precedence.

```tsx
const Button = styled.button`
  color: #bf4f74;
  font-size: 1rem;
  padding: 0.25rem 1rem;
  border: 2px solid #bf4f74;
  border-radius: 3px;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

<Button>Normal button</Button>
<TomatoButton>Tomato button</TomatoButton>
```

You can also style any arbitrary component using this approach. The only requirement is that it passes a class or className prop to the desired DOM node.

```tsx
type SomeButtonProps = {
  className?: string;
  slot: DarkElement;
};

const SomeButton = component<SomeButtonProps>(({ className, slot, ...rest }) => {
  return (
    <button {...rest} class={[className, 'btn'].filter(Boolean).join(' ')}>
      {slot}
    </button>
  );
});

const Button = styled(SomeButton)`
  color: #bf4f74;
  font-size: 1rem;
  padding: 0.25rem 1rem;
  border: 2px solid #bf4f74;
  border-radius: 3px;
`;

<Button>Styled button</Button>
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

