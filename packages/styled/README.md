# @dark-engine/styled 💅

Styled components for Dark 🌖

[More about Dark](https://github.com/atellmer/dark)

## Features
- 📚 Comprehensive CSS support
- 🎁 Encapsulated scope
- 🎉 Accommodation of global styles
- 📝 Styles dictated by component properties
- 🔁 Reusable fragments
- 🛒 CSS nesting
- 🎨 Theming
- 💃 Animations
- 💻 SSR
- 🗜️ Minification
- 🚫 No deps
- 📦 Small size

## Usage
```tsx
const Button = styled.button<{ $primary?: boolean }>`
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
  type StyledComponentFactory,
  type StyleSheet,
  type Keyframes,
  ThemeProvider,
  createGlobalStyle,
  keyframes,
  useTheme,
  useStyle,
  styled,
  css,
} from '@dark-engine/styled';
import { ServerStyleSheet } from '@dark-engine/styled/server';
```

## Getting Started

The styled uses tagged template literals to describe styles and create a final styled component that can be rendered like a regular Dark component, which can be nested with children and passed props. Under the hood, styled parses the style string into the simple abstract syntax tree (AST) in one pass, which is then transformed into final CSS and inserted into the DOM. At the same time, styles are divided into static and dynamic (based on props) for greater fragmentation of reused CSS classes. CSS classes are generated based on a fast non-cryptographic hash function and attached to DOM nodes.

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

To transmit dynamic data, it is recommended to use props names that begin with `$`, if these properties should not end up in the attributes of the DOM node.

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

If you need to dynamically generate something more than just a style property value, then you need to always use a special `css` function that converts the style string to the AST.

```tsx
const Box = styled.div<{ $color: string }>`
  width: 100px;
  height: 100px;

  ${p => css`
    background-color: ${p.$color};
  `}
`;
```

## Reusable CSS fragments

Fragments make coding easier and prevent style elements from being repeated.

```tsx
const square = (size: number) => css`
  width: ${size}px;
  height: ${size}px;
`;

const Box = styled.div`
  ${square(100)}
  background-color: blue;
`;
```

## Extending styles

To reuse already written styles, you can wrap a ready-made styled component in a `styled` function. In this case, a new component will be created that will combine all the styles of the parent component with its own styles, which will take precedence.

```tsx
const Button = styled.button`
  display: inline-block;
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

You can also style any arbitrary component using this approach. The only requirement is that it passes a `class` or `className` prop to the desired DOM node.

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
  display: inline-block;
  color: #bf4f74;
  font-size: 1rem;
  padding: 0.25rem 1rem;
  border: 2px solid #bf4f74;
  border-radius: 3px;
`;

<Button>Button with .btn class</Button>
```

## Dynamically swap tags or components

In some cases, you may need to replace the tag or component that needs to be rendered. For example, replace the `button` tag with the `a` tag, while maintaining the style of the button. There is prop `as` for this.

```tsx
const Button = styled.button`
  display: inline-block;
  color: #bf4f74;
  font-size: 1rem;
  padding: 0.25rem 1rem;
  border: 2px solid #bf4f74;
  border-radius: 3px;
  text-decoration: none;
`;

<Button>Normal button</Button>
<Button as='a' {...{ href: 'www.example.com' }}>Link button</Button>
<Button as={SomeButton}>Button with .btn class</Button>
```

## Configuration of default attributes via `attrs` function

```tsx
type TextFieldProps = {
  value: string;
  onInput: (e: SyntheticEvent<InputEvent, HTMLInputElement>) => void;
};

const TextField = styled.input.attrs(p => ({ ...p, type: 'text' }))<TextFieldProps>`
  border: 4px solid blue;
`;

const PasswordField = styled(TextField).attrs(p => ({ ...p, type: 'password' }))``;

<TextField value={value} onInput={handleInput} />
<PasswordField value={value} onInput={handleInput} />
```

## Style nesting

To describe nested style expressions, you need to use the `&` symbol, which, after parsing and generating classes, is replaced with the name of the class of this style.

```tsx
const Thing = styled.div`
  color: blue;

  &:hover {
    color: red; // <Thing> when hovered
  }

  & ~ & {
    background: tomato; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
  }

  & + & {
    background: lime; // <Thing> next to <Thing>
  }

  &.something {
    background: orange; // <Thing> tagged with an additional CSS class ".something"
  }

  .something-else & {
    border: 1px solid; // <Thing> inside another element labeled ".something-else"
  }
`;

<>
  <Thing>Hello world!</Thing>
  <Thing>How ya doing?</Thing>
  <Thing className='something'>The sun is shining...</Thing>
  <div>Pretty nice day today.</div>
  <Thing>Don't you think?</Thing>
  <div className='something-else'>
    <Thing>Splendid.</Thing>
  </div>
</>
```

## Media and Container queries

The lib allows you to write nested media query and container query expressions as if you were using a CSS preprocessor. Under the hood, expressions are transformed into global expressions in which classes with styles are placed.

```tsx
const Layout = styled.div`
  width: 100%;
  background-color: blue;
  color: #fff;

  @media (max-width: 600px) {
    background-color: green;

    & span {
      color: red;
    }
  }
`;
<Layout>
  This is <span>Content</span>
</Layout>
```

```tsx
const Layout = styled.div`
  width: 100%;
  container: main / inline-size;
  
  & span {
    font-size: 2rem;
  }

  @container main (max-width: 600px) {
    & span {
      font-size: 1rem;
    }
  }
`;
<Layout>
  This is <span>Content</span>
</Layout>
```

## Referring to other components

```tsx
const Link = styled.a<{ href: string }>`
  display: inline-flex;
  align-items: center;
  color: #bf4f74;
  padding: 8px;
`;

const Icon = styled.svg<{ viewBox: string }>`
  flex: none;
  transition: fill 0.25s;
  width: 16px;
  height: 16px;

  ${Link} & {
    margin-right: 8px;
  }

  ${Link}:hover & {
    fill: blueviolet;
  }
`;
<Link href='#'>
  <Icon viewBox='0 0 20 20'>
    <path d='M10 15h8c1 0 2-1 2-2V3c0-1-1-2-2-2H2C1 1 0 2 0 3v10c0 1 1 2 2 2h4v4l4-4zM5 7h2v2H5V7zm4 0h2v2H9V7zm4 0h2v2h-2V7z' />
  </Icon>
  Some link
</Link>
```

## Render function
This approach can be used to isolate styles without creating styled components for all nested elements.

```tsx
const Root = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px minmax(50px, 1fr) 50px;
  height: 100vh;

  &_header {
    background-color: deepskyblue;
    border: 1px solid #fff;
  }

  &_body {
    background-color: limegreen;
    border: 1px solid #fff;
  }

  &_footer {
    background-color: salmon;
    border: 1px solid #fff;
  }
`;

<Root>
  {fn => (
    <>
      <div class={fn('header')} />
      <div class={fn('body')} />
      <div class={fn('footer')} />
    </>
  )}
</Root>
```

## Animations

The styled fully supports CSS animations. To create an animation you need to use the special `keyframes` function.

```tsx
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 2rem;
`;

<Rotate>🍉</Rotate>
```

If you want to generate animation based on props, you can represent the animation as a function.

```tsx
const color = (from: string, to: string) => keyframes`
  0% {
    background-color: ${from};
  }

  50% {
    background-color: ${to};
  }

  100% {
    background-color: ${from};
  }
`;

const Colored = styled.div<{ $from: string; $to: string }>`
  display: inline-block;
  animation: ${p => color(p.$from, p.$to)} 3s linear infinite;
  padding: 2rem 1rem;
  font-size: 2rem;
`;

<Colored $from='yellow' $to='red'>🍊</Colored>
<Colored $from='green' $to='blue'>🍋</Colored>
```

## Global styles

Typically, styled components are auto-scoped to a local CSS class, providing isolation from other components. However, with `createGlobalStyle`, this restriction is lifted, enabling the application of CSS resets or base stylesheets.

```tsx
const GlobalStyle = createGlobalStyle<{ $light?: boolean }>`
  body {
    background-color: ${p => (p.$light ? 'white' : 'black')};
    color: ${p => (p.$light ? 'black' : 'white')};
  }
`;

<GlobalStyle $light />
```
## Theming

The styled offers complete theming support by exporting a `<ThemeProvider>` wrapper component. This component supplies a theme to all its child components through the context API. Consequently, all styled components in the render tree, regardless of their depth, can access the provided theme.

```tsx
type Theme = {
  accent: string;
};

declare module '@dark-engine/styled' {
  export interface DefaultTheme extends Theme {}
}

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${p => p.theme.accent};
`;

const App = component(() => {
  const [theme, setTheme] = useState<Theme>({ accent: '#03A9F4' });

  return (
    <ThemeProvider theme={theme}>
      <Box />
    </ThemeProvider>
  );
});
```

The library also provides a `useTheme` hook to access the current theme.

## Setting inline styles via `useStyle` hook

```tsx
const style = useStyle(styled => ({
  root: styled`
    width: 100px;
    height: 100px;
    background-color: darkcyan;
  `,
}));

<div style={style.root}></div>
```

## Server Side Rendering

The styled supports server-side rendering, complemented by stylesheet rehydration. Essentially, each time your application is rendered on the server, a `ServerStyleSheet` can be created and a provider can be added to your component tree, which accepts styles through a context API.

### Render to string

```tsx
const sheet = new ServerStyleSheet();
try {
  const app = await renderToString(sheet.collectStyles(<App />));
  const tags = sheet.getStyleTags();
  const mark = '{{%styles%}}' // somewhere in your <head></head>
  const page = `<!DOCTYPE html>${app}`.replace(mark, tags.join(''));

  res.statusCode = 200;
  res.send(page);
} catch (error) {
  console.error(error);
} finally {
  sheet.seal();
}
```

### Render to stream

```tsx
const sheet = new ServerStyleSheet();
const stream = sheet.interleaveWithStream(renderToStream(sheet.collectStyles(<App />)));

res.statusCode = 200;
stream.pipe(res);
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

