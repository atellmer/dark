import { Text, component, memo, useUpdate, Flag, Guard, useMemo } from '@dark-engine/core';
import { type SyntheticEvent as E, createRoot, table, tbody, tr, td, div, button } from '@dark-engine/platform-browser';

const flag1 = { [Flag.NM]: true };
const flag2 = { [Flag.NM]: true, [Flag.SR]: true };

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
    }));
};

type DataItem = { id: number; name: string };

type HeaderProps = {
  onCreate: (e: E<MouseEvent>) => void;
  onPrepend: (e: E<MouseEvent>) => void;
  onAppend: (e: E<MouseEvent>) => void;
  onInsertDifferent: (e: E<MouseEvent>) => void;
  onUpdateAll: (e: E<MouseEvent>) => void;
  onSwap: (e: E<MouseEvent>) => void;
  onClear: (e: E<MouseEvent>) => void;
};

const Header = component<HeaderProps>(
  ({ onCreate, onPrepend, onAppend, onInsertDifferent, onUpdateAll, onSwap, onClear }) => {
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
          slot: Text('swap rows'),
          onClick: onSwap,
        }),
        button({
          slot: Text('clear rows'),
          onClick: onClear,
        }),
      ],
    });
  },
);

const MemoHeader = memo(Header, () => false);

type RowProps = {
  id: number;
  selected: boolean;
  name: string;
  onRemove: (id: number, e: E<MouseEvent>) => void;
  onHighlight: (id: number, e: E<MouseEvent>) => void;
};

const Row = component<RowProps>(({ id, selected, name, onRemove, onHighlight }) => {
  return tr({
    class: selected ? 'selected' : undefined,
    flag: flag1,
    slot: [
      td({ class: 'cell', slot: Text(name) }),
      Guard({
        slot: [td({ class: 'cell', slot: Text('qqq') }), td({ class: 'cell', slot: Text('xxx') })],
      }),
      td({
        class: 'cell',
        slot: [
          button({ onClick: [onRemove, id], slot: Text('remove') }),
          button({ onClick: [onHighlight, id], slot: Text('highlight') }),
        ],
      }),
    ],
  });
});

const MemoRow = memo(Row, (p, n) => p.selected !== n.selected || p.name !== n.name);

type State = {
  data: Array<DataItem>;
  selected: number;
};

const App = component(() => {
  const state = useMemo<State>(() => ({ data: [], selected: undefined }), []);
  const forceUpdate = useUpdate({ forceSync: true });
  const { data, selected } = state;

  const handleCreate = (e: E<MouseEvent>) => {
    measurer.start('create');
    e.stopPropagation();
    state.data = buildData(10000);
    forceUpdate();
    measurer.stop();
  };
  const handlePrepend = (e: E<MouseEvent>) => {
    measurer.start('prepend');
    e.stopPropagation();
    const data = state.data;
    data.unshift(...buildData(1000, '^^^'));
    forceUpdate();
    measurer.stop();
  };
  const handleAppend = (e: E<MouseEvent>) => {
    measurer.start('append');
    e.stopPropagation();
    const data = state.data;
    data.push(...buildData(1000, '^^^'));
    forceUpdate();
    measurer.stop();
  };
  const handleInsertDifferent = (e: E<MouseEvent>) => {
    measurer.start('insert different');
    e.stopPropagation();
    const data = state.data;
    data.splice(0, 0, ...buildData(5, '***'));
    data.splice(8, 0, ...buildData(2, '***'));
    forceUpdate();
    measurer.stop();
  };
  const handleUpdateAll = (e: E<MouseEvent>) => {
    measurer.start('update every 10th');
    e.stopPropagation();
    const data = state.data;

    for (let i = 0; i < data.length; i += 10) {
      data[i] = {
        ...data[i],
        name: data[i].name + '!!!',
      };
    }
    forceUpdate();
    measurer.stop();
  };
  const handleRemove = (id: number, e: E<MouseEvent>) => {
    measurer.start('remove');
    e.stopPropagation();
    const data = state.data;
    const idx = data.findIndex(x => x.id === id);
    idx !== -1 && data.splice(idx, 1);
    forceUpdate();
    measurer.stop();
  };
  const handleHightlight = (id: number, e: E<MouseEvent>) => {
    measurer.start('highlight');
    e.stopPropagation();
    state.selected = id;
    forceUpdate();
    measurer.stop();
  };
  const handleSwap = (e: E<MouseEvent>) => {
    const data = state.data;
    if (data.length === 0) return;
    measurer.start('swap');
    e.stopPropagation();
    const temp = state.data[1];
    data[1] = data[data.length - 2];
    data[data.length - 2] = temp;
    forceUpdate();
    measurer.stop();
  };
  const handleClear = (e: E<MouseEvent>) => {
    measurer.start('clear');
    e.stopPropagation();
    state.data = [];
    forceUpdate();
    measurer.stop();
  };

  return [
    MemoHeader({
      onCreate: handleCreate,
      onPrepend: handlePrepend,
      onAppend: handleAppend,
      onInsertDifferent: handleInsertDifferent,
      onUpdateAll: handleUpdateAll,
      onSwap: handleSwap,
      onClear: handleClear,
    }),
    table({
      class: 'table',
      slot: tbody({
        flag: flag2,
        slot: data.map(item => {
          const { id, name } = item;

          return MemoRow({
            //key: id,
            id,
            name,
            selected: selected === id,
            onRemove: handleRemove,
            onHighlight: handleHightlight,
          });
        }),
      }),
    }),
  ];
});

createRoot(document.getElementById('root')).render(App());
