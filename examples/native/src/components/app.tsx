import { h, Fragment, createComponent, useState, useRef, useEffect } from '@dark-engine/core';

type Item = {
  id: number;
  name: string;
};

function randomize(list: Array<Item>) {
  let currentIndex = list.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];
  }

  return list;
}

const shuffle = (count: number) => {
  let nextId = -1;
  const items = Array(count)
    .fill(0)
    .map(() => ({
      id: ++nextId,
      name: `${nextId}`,
    }));
  const list = randomize(items);

  return list;
};

const App = createComponent(() => {
  const [items, setItems] = useState(() => shuffle(10));

  useEffect(() => {
    setTimeout(() => {
      console.log(
        'items',
        items.map(x => x.id),
      );
    }, 1000);
  });

  const handleShuffle = () => {
    setItems(shuffle(items.length));
  };

  return (
    <frame>
      <page actionBarHidden>
        <stack-layout>
          <button class='button' onTap={() => handleShuffle()}>
            shuffle
          </button>
          <stack-layout>
            {items.map(item => {
              return (
                <Fragment key={item.id}>
                  <label>item #{item.id}: 0</label>
                  <label>item #{item.id}: 1</label>
                </Fragment>
              );
            })}
          </stack-layout>
        </stack-layout>
      </page>
    </frame>
  );
});

export default App;
