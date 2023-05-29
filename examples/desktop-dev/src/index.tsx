import { QIcon } from '@nodegui/nodegui';
import { h, Fragment, component, useState, useEffect } from '@dark-engine/core';
import { render, Window, Text } from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

type AppProps = {
  title: string;
};

const minSize = { width: 500, height: 500 };
const winIcon = new QIcon(nodeguiIcon);

const App = component<AppProps>(({ title }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(x => x + 1);
    }, 1000);
  }, []);

  return (
    <>
      <Window windowTitle={title} windowIcon={winIcon} minSize={minSize} styleSheet={styleSheet}>
        <Text id='welcome-text'>xxx {count}</Text>
      </Window>
    </>
  );
});

const styleSheet = `
  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
`;

render(<App title={`Dark`} />);
