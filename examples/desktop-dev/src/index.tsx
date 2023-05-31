import { type QPushButtonSignals, QIcon, WidgetEventTypes, QPainter, QWidget, CursorShape } from '@nodegui/nodegui';
import { h, Fragment, component, useState, useRef } from '@dark-engine/core';
import { render, Window, View, Text, Button, useEventHandler } from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

type AppProps = {
  title: string;
};

const size = { width: 500, height: 500 };
const winIcon = new QIcon(nodeguiIcon);

const App = component<AppProps>(({ title }) => {
  const [count, setCount] = useState(0);
  const win = useRef<QWidget>();
  const buttonHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => setCount(x => x + 1),
    },
    [],
  );

  return (
    <>
      <Window ref={win} windowTitle={title} windowIcon={winIcon} size={size} styleSheet={styleSheet}>
        <View style={containerStyle}>
          <Text id='welcome-text-2'>count: {count}</Text>
          <Text id='welcome-text-1'>count: {count}</Text>
          <Button id='button' text={`Click Me ${count}`} cursor={CursorShape.PointingHandCursor} on={buttonHandler} />
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
  #button {
    background: 'green';
    height: 80px;
    color: '#fff';
  }
`;

render(<App title={`Dark`} />);
