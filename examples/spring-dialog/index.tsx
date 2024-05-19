import { component, useState, useLayoutEffect } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { createGlobalStyle, styled, css } from '@dark-engine/styled';

import { Dialog } from './dialog';

const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <Dialog isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <Container>
          <h1>Hello world</h1>
        </Container>
      </Dialog>
    </>
  );
});

const Content = component<{ slot: any }>(({ slot }) => {
  return <Container>{slot}</Container>;
});

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial;
    padding: 16px;
    background-color: #666;
  }
`;

const Container = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

createRoot(document.getElementById('root')).render(<App />);
