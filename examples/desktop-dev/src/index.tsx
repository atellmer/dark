import {
  type QPushButtonSignals,
  QIcon,
  WidgetEventTypes,
  QMouseEvent,
  QLineEditSignals,
  Direction,
  QWidget,
  CursorShape,
  EchoMode,
  AspectRatioMode,
  FocusReason,
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
  Dialog,
  ScrollArea,
  BoxView,
  LineEdit,
  useEventHandler,
} from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

type AppProps = {
  title: string;
};

const size = { width: 600, height: 700 };
const winIcon = new QIcon(nodeguiIcon);

const App = component<AppProps>(({ title }) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const win = useRef<QWidget>();
  const buttonHandler = useEventHandler<QPushButtonSignals | WidgetEventTypes>(
    {
      clicked: () => setCount(x => x + 1),
    },
    [],
  );
  const dialogButtonHandler = useEventHandler<QPushButtonSignals | WidgetEventTypes>(
    {
      clicked: () => setIsOpen(x => !x),
    },
    [],
  );
  const lineEditHandler = useEventHandler<QLineEditSignals>(
    {
      textChanged: e => setText(e.value),
    },
    [],
  );
  const dialogHandler = useEventHandler<WidgetEventTypes>(
    {
      [WidgetEventTypes.Close]: e => setIsOpen(false),
    },
    [],
  );

  return (
    <>
      <Window ref={win} windowTitle={title} windowIcon={winIcon} size={size} styleSheet={styleSheet}>
        <BoxView direction={Direction.TopToBottom} style={containerStyle}>
          <LineEdit echoMode={EchoMode.Password} clearButtonEnabled on={lineEditHandler} />
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
          <Dialog open={isOpen} on={dialogHandler}>
            <Text>hello</Text>
            <Image
              id='image'
              src='https://nationaltoday.com/wp-content/uploads/2020/08/international-cat-day-1200x834.jpg'
            />
          </Dialog>
          <Button text={isOpen ? 'opened' : 'closed'} on={dialogButtonHandler} />
        </BoxView>
      </Window>
    </>
  );
});

const containerStyle = `
  background: 'blue';
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
  #scroll-area {
    flex: 1;
  }
`;

render(<App title='Dark desktop app' />);
