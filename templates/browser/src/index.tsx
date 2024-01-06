import { h, Fragment, component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { createGlobalStyle } from '@dark-engine/styled';

const App = component(() => {
  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalStyle />
      <h1>Hello Dark: {count}</h1>
      <button onClick={() => setCount(x => x + 1)}>increment!</button>
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
