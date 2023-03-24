import { h, component, useState } from '@dark-engine/core';
import { ListView } from '@dark-engine/platform-native';

const App = component(() => {
  const [items, setItems] = useState<Array<number>>(() =>
    Array(1000)
      .fill(null)
      .map((_, idx) => idx),
  );

  return (
    <frame>
      <page>
        <stack-layout>
          <ListView height='100%' items={items}>
            {({ item, idx }) => {
              return (
                <stack-layout backgroundColor={idx % 2 ? 'red' : 'yellow'}>
                  <label color={idx % 2 ? 'white' : 'black'}>item #{item}</label>
                </stack-layout>
              );
            }}
          </ListView>
        </stack-layout>
      </page>
    </frame>
  );
});

export default App;
