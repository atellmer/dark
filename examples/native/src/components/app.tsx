import { h, Fragment, createComponent, useEvent, useState, Text } from '@dark-engine/core';
import { ListView } from '@dark-engine/platform-native';

type Item = {
  id: number;
  text: string;
};

const App = createComponent(() => {
  const [items, setItems] = useState<Array<number>>(() =>
    Array(100)
      .fill(null)
      .map((_, idx) => idx),
  );

  return (
    <frame>
      <page>
        <ListView items={items}>
          {({ item, idx }) => {
            return (
              <stack-layout backgroundColor={idx % 2 ? 'red' : 'yellow'}>
                <label color={idx % 2 ? 'white' : 'black'}>item #{item}</label>
              </stack-layout>
            );
          }}
        </ListView>
      </page>
    </frame>
  );
});

export default App;
