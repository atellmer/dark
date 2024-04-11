import { Direction, QIcon } from '@nodegui/nodegui';
import { component, useAtom } from '@dark-engine/core';
import {
  type PushButtonSignals,
  Window,
  FlexLayout,
  BoxLayout,
  Text,
  PushButton,
  useStyle,
  useEvents,
} from '@dark-engine/platform-desktop';

import nodeguiIcon from '../assets/nodegui.jpg';

const winIcon = new QIcon(nodeguiIcon);

const App = component(() => {
  const count$ = useAtom(0);
  const style = useStyle(styled => ({
    root: styled`
      #root {
        justify-content: 'center';
      }

      #text-container {
        background-color: #E57373;
        justify-content: 'center';
        flex-grow: 1;
      }

      #buttons-container {
        background-color: #FFF176;
        padding: 20px;
      }

      #text {
        qproperty-alignment: 'AlignCenter';
        font-size: 100px;
      }

      QPushButton {
        text-transform: uppercase;
      }
    `,
  }));
  const buttonDecreaseEvents = useEvents<PushButtonSignals>({
    clicked: () => count$.set(x => x - 1),
  });
  const buttonIncreaseEvents = useEvents<PushButtonSignals>({
    clicked: () => count$.set(x => x + 1),
  });

  return (
    <>
      <Window windowTitle='Dark Desktop App' windowIcon={winIcon} width={400} height={400} styleSheet={style.root}>
        <FlexLayout id='root'>
          <FlexLayout id='text-container'>
            <Text id='text'>{count$.val()}</Text>
          </FlexLayout>
          <BoxLayout id='buttons-container' direction={Direction.LeftToRight}>
            <PushButton text='decrease' on={buttonDecreaseEvents} />
            <PushButton text='increase' on={buttonIncreaseEvents} />
          </BoxLayout>
        </FlexLayout>
      </Window>
    </>
  );
});

export default App;
