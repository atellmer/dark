import {
  h,
  createComponent,
  Text,
  View,
  Fragment,
  memo,
  useCallback,
  useMemo,
} from '../../src/core';
import { render } from '../../src/platform/browser';

const domElement = document.getElementById('app');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const table = (props = {}) => View({ ...props, as: 'table' });
const tbody = (props = {}) => View({ ...props, as: 'tbody' });
const tr = (props = {}) => View({ ...props, as: 'tr' });
const td = (props = {}) => View({ ...props, as: 'td' });

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

const MemoHeader = memo<HeaderProps>(Header);

type ListProps = {
  items: Array<{ id: number, name: string; select: boolean }>;
  onRemove: Function;
  onHighlight: Function;
}

const Row = createComponent(({ id, name, selected, onRemove, onHighlight }) => {
  const handleRemove = useCallback(() => onRemove(id), [id]);
  const handleHighlight = useCallback(() => onHighlight(id), [id]);
  const rowStyle = `
    background-color: ${selected ? 'green' : 'transparent'};
  `;
  const cellStyle = `
    border: 1px solid blueviolet;
  `;

  return (
    <tr style={rowStyle}>
      <td style={cellStyle}>{name}</td>
      <td style={cellStyle}>1</td>
      <td style={cellStyle}>2</td>
      <td style={cellStyle}>
        <button onClick={handleRemove}>remove</button>
        <button onClick={handleHighlight}>highlight</button>
      </td>
    </tr>
  );
});

const MemoRow = memo(Row, (props, nextProps) =>
  props.name !== nextProps.name ||
  props.selected !== nextProps.selected,
);

const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {
  const renderRow = useMemo(() => (item) => {
    return (
      <MemoRow
        key={item.id}
        id={item.id}
        name={item.name}
        selected={item.select}
        onRemove={onRemove}
        onHighlight={onHighlight}
      />
    );
  }, []);

  return (
    <table style='width: 100%; border-collapse: collapse;'>
      <tbody>
        {items.map(renderRow)}
      </tbody>
    </table>
  )
});

const MemoList = memo(List);

const App = createComponent(() => {
  const handleCreate = useCallback(() => {
    state.list = buildData(1000);
    console.time('create');
    forceUpdate();
    console.timeEnd('create');
  }, []);
  const handleAdd = useCallback(() => {
    state.list.push(...buildData(1000, '!!!'));
    state.list = [...state.list];
    console.time('add');
    forceUpdate();
    console.timeEnd('add');
  }, []);
  const handleUpdateAll = useCallback(() => {
    state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
    console.time('update every 10th');
    forceUpdate();
    console.timeEnd('update every 10th');
  }, []);
  const handleRemove = useCallback((id) => {
    state.list = state.list.filter((z) => z.id !== id);
    console.time('remove');
    forceUpdate();
    console.timeEnd('remove');
  }, []);
  const handleHightlight = useCallback((id) => {
    const idx = state.list.findIndex(z => z.id === id);
    state.list[idx].select = !state.list[idx].select;
    state.list = [...state.list];
    console.time('highlight');
    forceUpdate();
    console.timeEnd('highlight');
  }, []);
  const handleSwap = useCallback(() => {
    if (state.list.length === 0) return;
    const temp = state.list[1];
    state.list[1] = state.list[state.list.length - 2];
    state.list[state.list.length - 2] = temp;
    state.list = [...state.list];
    console.time('swap');
    forceUpdate();
    console.timeEnd('swap');
  }, []);
  const handleClear = useCallback(() => {
    state.list = [];
    console.time('clear');
    forceUpdate();
    console.timeEnd('clear');
  }, []);

  return (
    <Fragment>
      <MemoHeader
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
  );
});

function runBench() {
  render(App(), domElement);
}

function forceUpdate() {
  render(App(), domElement);
}

export default runBench;
