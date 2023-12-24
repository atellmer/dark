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
  styled,
  css,
  useTheme,
  useStyle,
}
```



# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

