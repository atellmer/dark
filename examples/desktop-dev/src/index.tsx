import {
  type QPushButtonSignals,
  QIcon,
  WidgetEventTypes,
  QMouseEvent,
  QWidget,
  CursorShape,
  AspectRatioMode,
} from '@nodegui/nodegui';
import { h, Fragment, component, useState, useRef, useEffect } from '@dark-engine/core';
import {
  render,
  Window,
  View,
  Text,
  Button,
  Image,
  AnimatedImage,
  useEventHandler,
} from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

type AppProps = {
  title: string;
};

const size = { width: 600, height: 600 };
const winIcon = new QIcon(nodeguiIcon);

const App = component<AppProps>(({ title }) => {
  const [count, setCount] = useState(0);
  const win = useRef<QWidget>();
  const buttonHandler = useEventHandler<QPushButtonSignals | WidgetEventTypes>(
    {
      clicked: () => setCount(x => x + 1),
    },
    [],
  );

  return (
    <>
      <Window ref={win} windowTitle={title} windowIcon={winIcon} size={size} styleSheet={styleSheet}>
        <View style={containerStyle}>
          <View style={imageLayoutStyle}>
            <Image
              id='image'
              src='https://nationaltoday.com/wp-content/uploads/2020/08/international-cat-day-1200x834.jpg'
            />
            <AnimatedImage
              id='image'
              src='https://cdn.vox-cdn.com/thumbor/X7iwJz04FJYn71gDS1uuDeyKuQg=/800x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8692949/no_words_homer_into_brush.gif'
            />
          </View>
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

const imageLayoutStyle = `
  justify-content: 'center';
  align-items: 'center';
  background: 'blueviolet';
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
  #image {
    width: 200px;
    height: 200px;
    background: 'pink';
  }
`;

render(<App title='Dark desktop app' />);
