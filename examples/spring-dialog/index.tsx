import { component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { createGlobalStyle, styled } from '@dark-engine/styled';

import { Dialog } from './dialog';

const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      <Button onClick={() => setIsOpen(x => !x)}>Toggle dialog</Button>
      <Dialog isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <Content>
          <h1>Hey, I'm a dialog! 👋</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo soluta vero unde, cumque perspiciatis mollitia
            sunt exercitationem beatae assumenda iusto eos fugit fugiat alias est explicabo pariatur. Reprehenderit
            eligendi quae molestias nesciunt dolore sequi qui delectus nobis unde, officia, numquam dignissimos sit
            voluptas necessitatibus consectetur maxime maiores tempora aliquid nihil ducimus reiciendis architecto
          </p>
          <img src='./assets/mountains.jpg' alt='mountains' />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo soluta vero unde, cumque perspiciatis mollitia
            sunt exercitationem beatae assumenda iusto eos fugit fugiat alias est explicabo pariatur. Reprehenderit
            eligendi quae molestias nesciunt dolore sequi qui delectus nobis unde, officia, numquam dignissimos sit
            voluptas necessitatibus consectetur maxime maiores tempora aliquid nihil ducimus reiciendis architecto
          </p>
        </Content>
      </Dialog>
    </>
  );
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
    background-color: #fff;
  }
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  border: none;
  text-transform: uppercase;
  background-color: #e91e63;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  color: #fff;
  border-radius: 4px;
  letter-spacing: 1px;
  font-weight: 700;
  transition: opacity 0.05s ease-in-out;

  &:active {
    opacity: 0.5;
  }
`;

const Content = styled.main`
  width: 100%;
  height: 100%;
  text-align: center;

  & p {
    text-align: justify;
    margin: 32px 0;
  }

  & img {
    width: 100%;
  }
`;

createRoot(document.getElementById('root')).render(<App />);
