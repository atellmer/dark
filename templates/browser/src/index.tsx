import { h, Fragment, component, useAtom } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { createGlobalStyle } from '@dark-engine/styled';

const App = component(() => {
  const count$ = useAtom(0);

  return (
    <>
      <GlobalStyle />
      <h1>Hello Dark: {count$.val()}</h1>
      <button onClick={() => count$.set(x => x + 1)}>increment!</button>
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
