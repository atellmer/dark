import { Text, component, memo, useUpdate, useCallback, Flag, type DarkElement } from '@dark-engine/core';
import { createRoot, table, tbody, tr, td, div, button } from '@dark-engine/platform-browser';

const flag = { [Flag.HNM]: true };

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
  onClear: () => void;
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

const MemoHeader = memo(Header, () => false);

type RowProps = {
  id: number;
  selected: boolean;
  name: string;
  onRemove: (id: number) => void;
  onHighlight: (id: number) => void;
};

const Row = component<RowProps>(({ id, selected, name, onRemove, onHighlight }) => {
  return tr({
    class: selected ? 'selected' : undefined,
    flag,
    slot: [
      td({ class: 'cell', slot: Text(name) }),
      td({ class: 'cell', slot: Text('qqq') }),
      td({ class: 'cell', slot: Text('xxx') }),
      td({
        class: 'cell',
        slot: [
          button({ onClick: () => onRemove(id), slot: Text('remove') }),
          button({ onClick: () => onHighlight(id), slot: Text('highlight') }),
        ],
      }),
    ],
  });
});

const MemoRow = memo(Row, (p, n) => p.selected !== n.selected || p.name !== n.name);

type ListProps = {
  items: List;
  onRemove: (id: number) => void;
  onHighlight: (id: number) => void;
};

const List = component<ListProps>(({ items, onRemove, onHighlight }) => {
  const renderRow = useCallback(
    (item: ListItem) =>
      MemoRow({
        key: item.id,
        id: item.id,
        selected: item.selected,
        name: item.name,
        onRemove,
        onHighlight,
      }),
    [],
  );

  return table({
    class: 'table',
    slot: tbody({ slot: map(items, renderRow) }),
  });
});

function map<T>(items: Array<T>, cb: (item: T) => DarkElement) {
  const rendered: Array<DarkElement> = [];

  for (const item of items) {
    rendered.push(cb(item));
  }

  return rendered;
}

const MemoList = memo(List);

const Bench = component(() => {
  const forceUpdate = useUpdate({ forceSync: true });
  const handleCreate = useCallback(() => {
    state.list = buildData(10000);
    measurer.start('create');
    forceUpdate();
    measurer.stop();
  }, []);
  const handlePrepend = useCallback(() => {
    state.list.unshift(...buildData(1000, '!!!'));
    state.list = [...state.list];
    measurer.start('prepend');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleAppend = useCallback(() => {
    state.list.push(...buildData(1000, '!!!'));
    state.list = [...state.list];
    measurer.start('append');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleInsertDifferent = useCallback(() => {
    const [item1, item2, item3, ...rest] = state.list;

    state.list = [...buildData(5, '***'), item1, item2, item3, ...buildData(2, '***'), ...rest].filter(Boolean);
    measurer.start('insert different');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleUpdateAll = useCallback(() => {
    state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
    measurer.start('update every 10th');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleRemove = useCallback(id => {
    state.list = state.list.filter(x => x.id !== id);
    measurer.start('remove');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleHightlight = useCallback(id => {
    const idx = state.list.findIndex(x => x.id === id);
    state.list[idx].selected = !state.list[idx].selected;
    state.list = [...state.list];
    measurer.start('highlight');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleSwap = useCallback(() => {
    if (state.list.length === 0) return;
    const temp = state.list[1];
    state.list[1] = state.list[state.list.length - 2];
    state.list[state.list.length - 2] = temp;
    state.list = [...state.list];
    measurer.start('swap');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleClear = useCallback(() => {
    state.list = [];
    measurer.start('clear');
    forceUpdate();
    measurer.stop();
  }, []);

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
    MemoList({
      items: state.list,
      onRemove: handleRemove,
      onHighlight: handleHightlight,
    }),
  ];
});

const root = createRoot(document.getElementById('root'));

root.render(Bench());
