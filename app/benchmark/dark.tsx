import { h, createComponent, Text, View, Fragment, memo, useState, useEffect } from '../../src/core';
import { render } from '../../src/platform/browser';

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

const MemoHeader = memo(Header);

type ListProps = {
  items: Array<{id: number, name: string; select: boolean}>;
  onRemove: Function;
  onHighlight: Function;
}

const Row = createComponent(({  id, name, selected, onRemove, onHighlight }) => {
  const [count, setCount] = useState<number>(0);
  const cellStyle = `border: 1px solid pink;`;

  return (
    <tr style={`${selected ? 'background-color: green;' : ''}`}>
      <td style={cellStyle}>{name}</td>
      <td style={cellStyle}>1</td>
      <td style={cellStyle}>2</td>
      <td style={cellStyle}>
        <button onClick={() => onRemove(id)}>remove</button>
        <button onClick={() => onHighlight(id)}>highlight</button>
        <button onClick={() => setCount(count + 1)}>{'count: ' + count}</button>
      </td>
    </tr>
  );

  // return tr({
  //   style: `${selected ? 'background-color: green;' : ''}`,
  //   slot: [
  //     td({ style: cellStyle, slot: Text(name) }),
  //     td({ style: cellStyle, slot: Text('1') }),
  //     td({ style: cellStyle, slot: Text('2') }),
  //     td({
  //       style: cellStyle,
  //       slot: [
  //         button({
  //           slot: Text('remove'),
  //           onClick: () => onRemove(id),
  //         }),
  //         button({
  //           slot: Text('highlight'),
  //           onClick: () => onHighlight(id),
  //         }),
  //         button({
  //           slot: Text('count: ' + count),
  //           onClick: () => setCount(count + 1),
  //         }),
  //       ],
  //     }),
  //   ],
  // })
});

const MemoRow = memo(Row, (props, nextProps) => props.name !== nextProps.name || props.selected !== nextProps.selected);

const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {

  return (
    <table style='width: 100%; border-collapse: collapse;'>
      <tbody>
        {
          items.map((x) => {
            return (
              <Fragment key={x.id}>
                <MemoRow
                  //key={x.id}
                  id={x.id}
                  name={x.name}
                  selected={x.select}
                  onRemove={onRemove}
                  onHighlight={onHighlight}
                />
                <div style={`${x.select ? 'background-color: red;' : ''}`}>item:{x.id}</div>
              </Fragment>
            );
          })
        }
      </tbody>
    </table>
  )
  
  // return table({
  //   style: 'width: 100%; border-collapse: collapse;',
  //   slot: tbody({
  //     slot: items.map((x) => {
  //       return MemoRow({
  //         key: x.id,
  //         id: x.id,
  //         name: x.name,
  //         selected: x.select,
  //         onRemove,
  //         onHighlight
  //       })
  //     }),
  //   }),
  // });
});

const MemoList = memo(List);

const handleCreate = () => {
  state.list = buildData(100);
  console.time('create')
  forceUpdate();
  console.timeEnd('create')
};
const handleAdd = () => {
  state.list.push( ...buildData(1000, '!!!'));
  state.list = [...state.list];
  console.time('add')
  forceUpdate();
  console.timeEnd('add')
};
const handleUpdateAll = () => {
  state.list = state.list.map((x, idx) => ({...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name}));
  console.time('update every 10th')
  forceUpdate();
  console.timeEnd('update every 10th')
};
const handleRemove = (id) => {
  state.list = state.list.filter((z) => z.id !== id);
  console.time('remove');
  forceUpdate();
  console.timeEnd('remove');
};
const handleHightlight = (id) => {
  //state.list.unshift( ...buildData(1, '!!!'));
  const idx = state.list.findIndex(z => z.id === id);
  state.list[idx].select = !state.list[idx].select;
  state.list = [...state.list];
  console.time('highlight');
  forceUpdate();
  console.timeEnd('highlight');
};
const handleSwap = () => {
  if (state.list.length === 0) return;
  const temp = state.list[1];
  state.list[1] = state.list[state.list.length - 2];
  state.list[state.list.length - 2] = temp;
  state.list = [...state.list];
  console.time('swap')
  //console.log('state.list', state.list); 
  forceUpdate();
  console.timeEnd('swap')
};
const handleClear = () => {
  state.list = [];
  console.time('clear');
  forceUpdate();
  console.timeEnd('clear'); 
};
const App = createComponent(() => {
  return (
    <Fragment>
      <Header
        onCreate={handleCreate}
        onAdd={handleAdd}
        onUpdateAll={handleUpdateAll}
        onSwap={handleSwap}
        onClear={handleClear}
      />
      <MemoList
        items={state.list}
        onRemove={handleRemove}
        onHighlight={handleHightlight}
      />
    </Fragment>
  )

  return div({
    slot: [
      MemoHeader({
        onCreate: handleCreate,
        onAdd: handleAdd,
        onUpdateAll: handleUpdateAll,
        onSwap: handleSwap,
        onClear: handleClear,
      }),
      List({ items: [...state.list], onRemove: handleRemove, onHighlight: handleHightlight }),
    ],
  })
});

function runBench() {
  render(App(), domElement);
}

function forceUpdate() {
  render(App(), domElement);
}

export default runBench;
