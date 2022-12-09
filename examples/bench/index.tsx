import {
  h,
  View,
  Text,
  Fragment,
  createComponent,
  memo,
  useCallback,
  SplitUpdate,
  useSplitUpdate,
} from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });

const createMeasurer = () => {
  let startTime;
  let lastMeasureName: string;
  const start = (name: string) => {
    startTime = performance.now();
    lastMeasureName = name;
  };
  const stop = () => {
    const last = lastMeasureName;

    if (lastMeasureName) {
      setTimeout(() => {
        lastMeasureName = null;
        const stopTime = performance.now();
        const diff = stopTime - startTime;

        console.log(`${last}: ${diff}`);
      });
    }
  };

  return {
    start,
    stop,
  };
};

const measurer = createMeasurer();

let nextId = 0;
const buildData = (count, prefix = '') => {
  return Array(count)
    .fill(0)
    .map(() => ({
      id: ++nextId,
      name: `item: ${nextId} ${prefix}`,
      selected: false,
    }));
};

type ListItem = { id: number; name: string; selected: boolean };

type List = Array<ListItem>;

type State = {
  list: List;
};

const state: State = {
  list: [],
};

type HeaderProps = {
  onCreate: () => void;
  onPrepend: () => void;
  onAppend: () => void;
  onInsertDifferent: () => void;
  onUpdateAll: () => void;
  onSwap: () => void;
  onReplace: () => void;
  onClear: () => void;
};

const Header = createComponent<HeaderProps>(
  ({ onCreate, onPrepend, onAppend, onInsertDifferent, onUpdateAll, onSwap, onReplace, onClear }) => {
    return div({
      style:
        'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
      slot: [
        button({
          slot: Text('create 10000 rows'),
          onClick: onCreate,
        }),
        button({
          slot: Text('Prepend 1000 rows'),
          onClick: onPrepend,
        }),
        button({
          slot: Text('Append 1000 rows'),
          onClick: onAppend,
        }),
        button({
          slot: Text('insert different'),
          onClick: onInsertDifferent,
        }),
        button({
          slot: Text('update every 10th row'),
          onClick: onUpdateAll,
        }),
        button({
          slot: Text('swap 2 rows'),
          onClick: onSwap,
        }),
        button({
          slot: Text('replace 1 row'),
          onClick: onReplace,
        }),
        button({
          slot: Text('clear rows'),
          onClick: onClear,
        }),
        button({
          slot: Text('unmount app'),
          onClick: () => {
            root.unmount();
          },
        }),
      ],
    });
  },
);

const MemoHeader = memo<HeaderProps>(Header);

type RowProps = {
  id: number;
  name: string;
  selected: boolean;
  onRemove: (id: number) => void;
  onHighlight: (id: number) => void;
};

const Row = createComponent<RowProps>(({ id, name, selected, onRemove, onHighlight }) => {
  const handleRemove = () => onRemove(id);
  const handleHighlight = () => onHighlight(id);

  console.log('render', id);

  return (
    <tr class={selected ? 'selected' : undefined}>
      <td class='cell'>{name}</td>
      <td class='cell'>qqq</td>
      <td class='cell'>xxx</td>
      <td class='cell'>
        <button onClick={handleRemove}>remove</button>
        <button onClick={handleHighlight}>highlight</button>
      </td>
    </tr>
  );
});

const MemoRow = memo<RowProps>(
  Row,
  (prevProps, nextProps) => prevProps.name !== nextProps.name || prevProps.selected !== nextProps.selected,
);

type ListProps = {
  items: List;
  onRemove: (id: number) => void;
  onHighlight: (id: number) => void;
};

const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {
  return (
    <table class='table'>
      <tbody>
        {items.map(item => {
          return (
            <MemoRow
              key={item.id}
              id={item.id}
              name={item.name}
              selected={item.selected}
              onRemove={onRemove}
              onHighlight={onHighlight}
            />
          );
        })}
      </tbody>
    </table>
  );
});

const MemoList = memo(List);

const Bench = createComponent(() => {
  const handleCreate = () => {
    state.list = buildData(10);
    measurer.start('create');
    forceUpdate();
    measurer.stop();
  };
  const handlePrepend = () => {
    state.list.unshift(...buildData(2, '!!!'));
    state.list = [...state.list];
    measurer.start('prepend');
    forceUpdate();
    measurer.stop();
  };
  const handleAppend = () => {
    state.list.push(...buildData(2, '!!!'));
    state.list = [...state.list];
    measurer.start('append');
    forceUpdate();
    measurer.stop();
  };
  const handleInsertDifferent = () => {
    const [item1, item2, _, ...rest] = state.list;

    state.list = [...buildData(5, '***'), item1, item2, ...buildData(2, '***'), ...rest].filter(Boolean);
    measurer.start('insert different');
    forceUpdate();
    measurer.stop();
  };
  const handleUpdateAll = () => {
    state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
    measurer.start('update every 10th');
    forceUpdate();
    measurer.stop();
  };
  const handleRemove = (id: number) => {
    state.list = state.list.filter(x => x.id !== id);
    measurer.start('remove');
    forceUpdate();
    measurer.stop();
  };
  const handleHightlight = (id: number) => {
    const idx = state.list.findIndex(x => x.id === id);
    state.list[idx].selected = !state.list[idx].selected;
    state.list = [...state.list];
    measurer.start('highlight');
    forceUpdate();
    measurer.stop();
  };
  const handleSwap = () => {
    if (state.list.length === 0) return;
    const temp1 = state.list[1];
    //const temp2 = state.list[2];
    // const temp4 = state.list[4];
    state.list[1] = state.list[state.list.length - 2];
    // state.list[2] = state.list[state.list.length - 3];
    //state.list[4] = state.list[state.list.length - 5];
    state.list[state.list.length - 2] = temp1;
    //state.list[state.list.length - 3] = temp2;
    //state.list[state.list.length - 5] = temp4;
    state.list = [...state.list];
    measurer.start('swap');
    forceUpdate();
    measurer.stop();
  };

  const handleReplace = () => {
    if (state.list.length === 0) return;
    state.list[2] = buildData(1)[0];
    state.list = [...state.list];
    measurer.start('replace');
    forceUpdate();
    measurer.stop();
  };

  const handleClear = () => {
    state.list = [];
    measurer.start('clear');
    forceUpdate();
    measurer.stop();
  };

  return (
    <>
      <MemoHeader
        onCreate={handleCreate}
        onPrepend={handlePrepend}
        onAppend={handleAppend}
        onInsertDifferent={handleInsertDifferent}
        onUpdateAll={handleUpdateAll}
        onSwap={handleSwap}
        onReplace={handleReplace}
        onClear={handleClear}
      />
      <MemoList items={state.list} onRemove={handleRemove} onHighlight={handleHightlight} />
    </>
  );
});

const root = createRoot(document.getElementById('root'));

function forceUpdate() {
  root.render(<Bench />);
}

root.render(<Bench />);
