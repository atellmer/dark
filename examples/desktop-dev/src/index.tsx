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
  AlignmentFlag,
  TabPosition,
  ItemFlag,
  QBrush,
  QColor,
  QUrl,
  QDate,
  QTime,
} from '@nodegui/nodegui';
import { h, Fragment, component, useState, useRef, useEffect } from '@dark-engine/core';
import {
  type ComboBoxItem,
  type PushButtonSignals,
  type LineEditSignals,
  type PlainTextEditSignals,
  type FileDialogSignals,
  render,
  Window,
  WindowRef,
  FlexLayout,
  BoxLayout,
  GridLayout,
  GridItem,
  Text,
  PushButton,
  Image,
  AnimatedImage,
  Dialog,
  ScrollArea,
  List,
  ListItem,
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
  Action,
  MenuBar,
  Menu,
  FontDialog,
  InputDialog,
  ProgressDialog,
  Tab,
  TabItem,
  Table,
  TableItem,
  SystemTrayIcon,
  DateEdit,
  TimeEdit,
  DateTimeEdit,
  DoubleSpinBox,
  RadioButton,
  useEventSystem,
  useStyle,
  useShortcut,
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
  const windowRef = useRef<WindowRef>();
  const buttonEvents = useEventSystem<PushButtonSignals>(
    {
      clicked: () => setCount(x => x + 1),
    },
    [],
  );
  const lineEditEvents = useEventSystem<PlainTextEditSignals>(
    {
      textChanged: e => setText(e.value),
    },
    [],
  );
  const fileEvents = useEventSystem<FileDialogSignals>(
    {
      fileSelected: file => {
        console.log('file', file);
      },
    },
    [],
  );
  const style = useStyle(styled => ({
    root: styled`
      #welcome-text-1 {
        font-size: 24px;
        background: 'red';
        padding: 8px;
      }
      #welcome-text-2 {
        font-size: 24px;
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
    `,
    container: styled`
      background: 'pink';
      justify-content: 'center';
    `,
  }));

  useShortcut({
    ref: windowRef,
    keySequence: 'Ctrl+Shift+Q',
    callback: () => console.log('Ctrl+Shift+Q pressed!'),
  });

  return (
    <>
      <Window ref={windowRef} windowTitle={title} windowIcon={winIcon} size={size} styleSheet={style.root}>
        {/* <MenuBar>
          <Menu title='File'>
            <Action text='Open' />
            <Action text='Create' />
            <Action text='Save' />
          </Menu>
          <Menu title='Edit'>
            <Action text='Cut' />
            <Action text='Copy' />
            <Action text='Paste' />
          </Menu>
        </MenuBar> */}
        {/* <SystemTrayIcon icon={winIcon} visible>
          <Menu title='File'>
            <Action text='Open' />
            <Action text='Create' />
            <Action text='Save' />
          </Menu>
        </SystemTrayIcon> */}
        <BoxLayout direction={Direction.TopToBottom} style={style.container}>
          {/* <ColorDialog open={false} />
          <LineEdit on={lineEditEvents} />
          <PlainTextEdit />
          <FlexLayout>
            <Image
              id='image'
              src='https://nationaltoday.com/wp-content/uploads/2020/08/international-cat-day-1200x834.jpg'
            />
            <AnimatedImage
              id='image'
              src='https://cdn.vox-cdn.com/thumbor/X7iwJz04FJYn71gDS1uuDeyKuQg=/800x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8692949/no_words_homer_into_brush.gif'
            />
          </FlexLayout>
          <Text id='welcome-text-2'>count: {count}</Text>
          <Text id='welcome-text-1'>count: {count}</Text>
          <PushButton
            id='button'
            text={`Click Me ${count}`}
            cursor={CursorShape.PointingHandCursor}
            on={buttonEvents}
          />
          <ProgressBar value={45} textHidden />
          <Slider value={45} orientation={Orientation.Horizontal} tickPosition={TickPosition.TicksBothSides} />
          <SpinBox value={10} />
          <CheckBox text='xxx' checked />
          <ComboBox currentIndex={2} items={items} />
          <Dial value={100} maximum={200} minimum={0} notchTarget={30} />
          <FileDialog open={false} on={fileEvents} />
          <FontDialog open={false} />
          <InputDialog open={false} />
          <ProgressDialog open={false} value={40} /> */}
          {/* <GridLayout columnStretch={[1, 2]} rowStretch={[1, 2]}>
            <GridItem row={0} col={0}>
              <Text style={`background-color: red;`}>Label 1</Text>
            </GridItem>
            <GridItem row={0} col={1}>
              <Text style={`background-color: yellow;`}>Label 2 {count}</Text>
            </GridItem>
            <GridItem row={1} col={0}>
              <Text style={`background-color: green;`}>Label 3</Text>
            </GridItem>
            <GridItem row={1} col={1}>
              <Text style={`background-color: blue;`}>Label 4</Text>
            </GridItem>
          </GridLayout> */}
          {/* <Tab currentIndex={0} tabPosition={TabPosition.West} tabsClosable>
            <TabItem text='Tab 1'>
              <Text style={`background-color: red;`}>Content 1</Text>
            </TabItem>
            <TabItem text='Tab 2'>
              <Text style={`background-color: yellow;`}>Content 2</Text>
            </TabItem>
            <TabItem text='Tab 3'>
              <Text style={`background-color: green;`}>Content 3</Text>
            </TabItem>
          </Tab> */}
          {/* <Table columnCount={2} rowCount={2}>
            <TableItem row={0} col={0} text='0, 0' />
            <TableItem row={0} col={1} text='0, 1' />
            <TableItem row={1} col={0} text='1, 0' />
            <TableItem row={1} col={1} text='1, 1' />
          </Table> */}
          {/* <RadioButton text='Option 1' />
          <RadioButton text='Option 2' />
          <RadioButton text='Option 3' />
          <RadioButton text='Option 4' /> */}
          {/* <DateEdit date={new QDate(2024, 1, 1)} displayFormat='dd.MM.yyyy' /> */}
          {/* <TimeEdit time={new QTime(12, 30, 12)} displayFormat='hh:mm:ss' /> */}
          {/* <DateTimeEdit date={new QDate(2024, 1, 1)} time={new QTime(12, 30, 12)} /> */}
          <PushButton
            id='button'
            text={`Click Me ${count}`}
            cursor={CursorShape.PointingHandCursor}
            on={buttonEvents}
          />
          <DoubleSpinBox value={12.34} prefix='PREFIX ' suffix=' SUFFIX' singleStep={0.01} />
        </BoxLayout>
      </Window>
    </>
  );
});

render(<App title='Dark desktop app' />);

// const { QMainWindow, QShortcut, QKeySequence } = require("@nodegui/nodegui");

// const win = new QMainWindow();
// const shortcut = new QShortcut(win);
// shortcut.setKey(new QKeySequence("Ctrl+Q"));

// shortcut.addEventListener("activated", () => {
//   console.log("Shortcut activated!");
// });

// win.show();
