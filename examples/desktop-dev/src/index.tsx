import { QIcon } from '@nodegui/nodegui';
import { h, Fragment, component, useState, useEffect } from '@dark-engine/core';
import { render, Window, View, Text } from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

type AppProps = {
  title: string;
};

const size = { width: 500, height: 500 };
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
      <Window windowTitle={title} windowIcon={winIcon} size={size} styleSheet={styleSheet}>
        <View style={containerStyle}>
          {(count < 5 || count > 10) && (
            <View>
              <Text id='welcome-text-2'>count: {count}</Text>
            </View>
          )}
          <View>
            <Text id='welcome-text-1'>count: {count}</Text>
          </View>
        </View>
      </Window>
    </>
  );
});

const containerStyle = `
  background: '#ccc';
  justify-content: 'center';
`;

const styleSheet = `
  #welcome-text-1 {
    font-size: 24px;
    qproperty-alignment: 'AlignCenter';
    background: 'red';
    padding: 8px;
  }
  #welcome-text-2 {
    font-size: 24px;
    qproperty-alignment: 'AlignCenter';
    background: 'yellow';
    padding: 8px;
  }
`;

render(<App title={`Dark`} />);
