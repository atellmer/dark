import { h, Fragment, component, useAtom } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { createGlobalStyle } from '@dark-engine/styled';

const App = component(() => {
  const a$ = useAtom(0);

  return (
    <>
      <GlobalStyle />
      <h1>{a$.val()}</h1>
      <button onClick={() => a$.set(x => x + 1)}>increment</button>
    </>
  );
});

const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  html, body {
    padding: 0;
    margin: 0;
    width: 100%;
  }

  body {
    font-family: sans-serif;
    padding: 16px;
  }
`;

createRoot(document.getElementById('root')).render(<App />);
