import { h, Fragment, component, useAtom, useComputed, useStore } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { createGlobalStyle } from '@dark-engine/styled';

const App = component(() => {
  const a$ = useAtom(0);
  const b$ = useComputed([a$], a => a ** 2);
  const [a, b] = useStore([a$, b$]);

  return (
    <>
      <GlobalStyle />
      <h1>
        {a} ^ 2 = {b}
      </h1>
      <button onClick={() => a$.set(x => x + 1)}>increment</button>
    </>
  );
});

const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    box-sizing: border-box;
  }

  html {
    font-size: 14px;
  }

  html, body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    width: 100%;
    height: 100%;
  }
`;

createRoot(document.getElementById('root')).render(<App />);
