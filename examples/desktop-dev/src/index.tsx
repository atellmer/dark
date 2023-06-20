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
  QPainter,
} from '@nodegui/nodegui';
import { h, Fragment, component, useState, useRef, useEffect, useLayoutEffect } from '@dark-engine/core';
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
  FlexLayoutRef,
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
  Svg,
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
  const canvasRef = useRef<FlexLayoutRef>();
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
  const canvasEvents = useEventSystem<WidgetEventTypes>(
    {
      Paint: () => {
        const painter = new QPainter(canvasRef.current);

        painter.setPen(new QColor('red'));
        painter.setBrush(new QColor('yellow'));
        painter.drawEllipse(100, 100, 200, 200);
        painter.end();
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
        box-shadow: 10px 10px 10px 'red';
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
          <Svg
            source={`
              <svg stroke="blue" fill="blue" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.102 20.898c.698.699 1.696 1.068 2.887 1.068 1.742 0 3.855-.778 6.012-2.127 2.156 1.35 4.27 2.127 6.012 2.127 1.19 0 2.188-.369 2.887-1.068 1.269-1.269 1.411-3.413.401-6.039-.358-.932-.854-1.895-1.457-2.859a16.792 16.792 0 0 0 1.457-2.859c1.01-2.626.867-4.771-.401-6.039-.698-.699-1.696-1.068-2.887-1.068-1.742 0-3.855.778-6.012 2.127-2.156-1.35-4.27-2.127-6.012-2.127-1.19 0-2.188.369-2.887 1.068C1.833 4.371 1.69 6.515 2.7 9.141c.359.932.854 1.895 1.457 2.859A16.792 16.792 0 0 0 2.7 14.859c-1.01 2.626-.867 4.77.402 6.039zm16.331-5.321c.689 1.79.708 3.251.052 3.907-.32.32-.815.482-1.473.482-1.167 0-2.646-.503-4.208-1.38a26.611 26.611 0 0 0 4.783-4.784c.336.601.623 1.196.846 1.775zM12 17.417a23.568 23.568 0 0 1-2.934-2.483A23.998 23.998 0 0 1 6.566 12 23.74 23.74 0 0 1 12 6.583a23.568 23.568 0 0 1 2.934 2.483 23.998 23.998 0 0 1 2.5 2.934A23.74 23.74 0 0 1 12 17.417zm6.012-13.383c.657 0 1.152.162 1.473.482.656.656.638 2.117-.052 3.907-.223.579-.51 1.174-.846 1.775a26.448 26.448 0 0 0-4.783-4.784c1.562-.876 3.041-1.38 4.208-1.38zM4.567 8.423c-.689-1.79-.708-3.251-.052-3.907.32-.32.815-.482 1.473-.482 1.167 0 2.646.503 4.208 1.38a26.448 26.448 0 0 0-4.783 4.784 13.934 13.934 0 0 1-.846-1.775zm0 7.154c.223-.579.51-1.174.846-1.775a26.448 26.448 0 0 0 4.783 4.784c-1.563.877-3.041 1.38-4.208 1.38-.657 0-1.152-.162-1.473-.482-.656-.656-.637-2.117.052-3.907z"></path><circle cx="12" cy="12" r="2.574"></circle></svg>
            `}
          />
        </BoxLayout>
      </Window>
    </>
  );
});

render(<App title='Dark desktop app' />);
