import {
  type QPushButtonSignals,
  QIcon,
  WidgetEventTypes,
  QMouseEvent,
  QLineEditSignals,
  Direction,
  Orientation,
  TickPosition,
  QWidget,
  CursorShape,
  EchoMode,
  AspectRatioMode,
  FocusReason,
} from '@nodegui/nodegui';
import {
  HorizontalHeaderFormat,
  SelectionMode,
  VerticalHeaderFormat,
} from '@nodegui/nodegui/dist/lib/QtWidgets/QCalendarWidget';
import { h, Fragment, component, useState, useRef, useEffect } from '@dark-engine/core';
import {
  type ComboBoxItem,
  type ButtonSignals,
  type LineEditSignals,
  type PlainTextEditSignals,
  type FileDialogSignals,
  render,
  Window,
  View,
  Text,
  Button,
  Image,
  AnimatedImage,
  Dialog,
  ScrollArea,
  List,
  ListItem,
  BoxView,
  LineEdit,
  ProgressBar,
  Slider,
  SpinBox,
  CheckBox,
  ComboBox,
  Calendar,
  Dial,
  PlainTextEdit,
  ColorDialog,
  ErrorMessage,
  FileDialog,
  useEventHandler,
} from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

type AppProps = {
  title: string;
};

const size = { width: 600, height: 700 };
const winIcon = new QIcon(nodeguiIcon);
const items: Array<ComboBoxItem> = [{ text: 'apple' }, { text: 'banana' }, { text: 'watermelon' }];

const App = component<AppProps>(({ title }) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const win = useRef<QWidget>();
  const buttonHandler = useEventHandler<ButtonSignals>(
    {
      clicked: () => setCount(x => x + 1),
    },
    [],
  );
  const lineEditHandler = useEventHandler<PlainTextEditSignals>(
    {
      textChanged: e => setText(e.value),
    },
    [],
  );
  const fileEvents = useEventHandler<FileDialogSignals>(
    {
      fileSelected: file => {
        console.log('file', file);
      },
    },
    [],
  );

  return (
    <>
      <Window ref={win} windowTitle={title} windowIcon={winIcon} size={size} styleSheet={styleSheet}>
        <BoxView direction={Direction.TopToBottom} style={containerStyle}>
          <ColorDialog open={false} />
          <LineEdit on={lineEditHandler} />
          <PlainTextEdit />
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
          <ProgressBar value={45} textHidden />
          <Slider value={45} orientation={Orientation.Horizontal} tickPosition={TickPosition.TicksBothSides} />
          <SpinBox value={10} />
          <CheckBox text='xxx' checked />
          <ComboBox currentIndex={2} items={items} />
          <Dial value={100} maximum={200} minimum={0} notchTarget={30} />
          <FileDialog open={false} on={fileEvents} />
        </BoxView>
      </Window>
    </>
  );
});

const containerStyle = `
  background: 'white';
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

// import { QMainWindow, QMenuBar, QMenu, QAction }from "@nodegui/nodegui";

// const win = new QMainWindow();
// const menuBar = new QMenuBar();
// win.setMenuBar(menuBar);

// const fileMenu = new QMenu();
// fileMenu.setTitle("File");

// const newAction = new QAction();
// newAction.setText("New");
// newAction.addEventListener("triggered", () => {
//   console.log("New clicked");
// });

// const openAction = new QAction();
// openAction.setText("Open");
// openAction.addEventListener("triggered", () => {
//   console.log("Open clicked");
// });

// fileMenu.addAction(newAction);
// fileMenu.addAction(openAction);

// menuBar.addMenu(fileMenu);
// win.show();
