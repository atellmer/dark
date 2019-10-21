import { createComponent, Text, View } from '../../src/core';
import { renderComponent } from '../../src/platform/browser';

const domElement = document.getElementById('app');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const table =  (props = {}) => View({ ...props, as: 'table' });
const tbody =  (props = {}) => View({ ...props, as: 'tbody' });
const tr =  (props = {}) => View({ ...props, as: 'tr' });
const td =  (props = {}) => View({ ...props, as: 'td' });

let nextId = 0;
const buildData = (count, prefix = '') => {
  return Array(count).fill(0).map((_, idx) => ({
    id: ++nextId,
    name: `item: ${idx + 1} ${prefix}`,
    select: false,
  }))
}

const state = {
  list: [],
};

type HeaderProps = {
  onCreate: Function;
  onAdd: Function;
  onUpdateAll: Function;
  onSwap: Function;
  onClear: Function;
}

const Header = createComponent<HeaderProps>(({ onCreate, onAdd, onUpdateAll, onSwap, onClear }) => {
  return div({
    style: 'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
    slot: [
      button({
        slot: Text('create 10000 rows'),
        onClick: onCreate,
      }),
      button({
        slot: Text('Add 1000 rows'),
        onClick: onAdd,
      }),
      button({
        slot: Text('update every 10th row'),
        onClick: onUpdateAll,
      }),
      button({
        slot: Text('swap rows'),
        onClick: onSwap,
      }),
      button({
        slot: Text('clear rows'),
        onClick: onClear,
      }),
    ],
  });
});

type ListProps = {
  items: Array<{id: number, name: string; select: boolean}>;
  onRemove: Function;
  onHighlight: Function;
}

const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {
  return table({
    style: 'width: 100%; border-collapse: collapse;',
    slot: tbody({
      slot: items.map((x) => {
        const cellStyle = `border: 1px solid pink; ${x.select ? 'background-color: green;' : ''}`;
        return tr({
          key: x.id,
          slot: [
            td({ style: cellStyle, slot: Text(x.name) }),
            td({ style: cellStyle, skip: true, slot: Text('1') }),
            td({ style: cellStyle, skip: true, slot: Text('2') }),
            td({
              style: cellStyle,
              skip: true,
              slot: [
                button({
                  slot: Text('remove'),
                  onClick: () => onRemove(x),
                }),
                button({
                  slot: Text('highlight'),
                  onClick: () => onHighlight(x),
                }),
              ],
            }),
          ],
        })
      }),
    }),
  });
});

const App = createComponent(() => {
  const handleCreate = () => {
    console.time('create')
    state.list = buildData(10000);
    forceUpdate();
    console.timeEnd('create')
  };
  const handleAdd = () => {
    console.time('add')
    state.list.push( ...buildData(1000, '!!!'));
    forceUpdate();
    console.timeEnd('add')
  };
  const handleUpdateAll = () => {
    console.time('update every 10th')
    state.list = state.list.map((x, idx) => ({...x, name: idx % 10 === 0 ? x.name + '!!!' : x.name}));
    forceUpdate();
    console.timeEnd('update every 10th')
  };
  const handleRemove = (x) => {
    console.time('remove');
    const idx = state.list.findIndex(z => z.id === x.id);
    state.list.splice(idx, 1);
    forceUpdate();
    console.timeEnd('remove');
  };
  const handleHightlight = (x) => {
    console.time('highlight');
    const idx = state.list.findIndex(z => z.id === x.id);
    state.list[idx].select = !state.list[idx].select;
    forceUpdate();
    console.timeEnd('highlight');
  };
  const handleSwap = () => {
    console.time('swap')
    const temp = state.list[1];
    state.list[1] = state.list[state.list.length - 2];
    state.list[state.list.length - 2] = temp;
    forceUpdate();
    console.timeEnd('swap')
  };
  const handleClear = () => {
    console.time('clear');
    state.list = [];
    forceUpdate();
    console.timeEnd('clear');
  };

  return div({
    slot: [
      Header({
        onCreate: handleCreate,
        onAdd: handleAdd,
        onUpdateAll: handleUpdateAll,
        onSwap: handleSwap,
        onClear: handleClear,
      }),
      List({ items: state.list, onRemove: handleRemove, onHighlight: handleHightlight }),
    ],
  })
});

function runBench() {
  renderComponent(App(), domElement);
}

function forceUpdate() {
  renderComponent(App(), domElement);
}

export default runBench;
