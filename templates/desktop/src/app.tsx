import { QIcon } from '@nodegui/nodegui';
import { h, Fragment, component, useState } from '@dark-engine/core';
import {
  type PushButtonSignals,
  Window,
  FlexLayout,
  Text,
  PushButton,
  useStyle,
  useEvents,
} from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

const winIcon = new QIcon(nodeguiIcon);

const App = component(() => {
  const [count, setCount] = useState(0);
  const style = useStyle(styled => ({
    root: styled`
      #container {
        justify-content: 'center';
      }
      #text-container {
        background-color: #E57373;
        justify-content: 'center';
        flex-grow: 1;
      }
      #buttons-container {
        background-color: #FFF176;
        flex-direction: 'row';
        justify-content: 'center';
        padding: 20px;
      }
      #text {
        qproperty-alignment: 'AlignCenter';
        font-size: 100px;
      }
    `,
  }));
  const buttonIncreaseEvents = useEvents<PushButtonSignals>({
    clicked: () => setCount(x => x + 1),
  });
  const buttonDecreaseEvents = useEvents<PushButtonSignals>({
    clicked: () => setCount(x => x - 1),
  });

  return (
    <>
      <Window windowTitle='Dark desktop app' windowIcon={winIcon} width={400} height={400} styleSheet={style.root}>
        <FlexLayout id='container'>
          <FlexLayout id='text-container'>
            <Text id='text'>{count}</Text>
          </FlexLayout>
          <FlexLayout id='buttons-container'>
            <PushButton text='increase' on={buttonIncreaseEvents} />
            <PushButton text='decrease' on={buttonDecreaseEvents} />
          </FlexLayout>
        </FlexLayout>
      </Window>
    </>
  );
});

export default App;
