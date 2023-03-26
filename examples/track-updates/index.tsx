import { Text, component, memo, useUpdate, useMemo, Flag, type DarkElement } from '@dark-engine/core';
import {
  type SyntheticEvent,
  createRoot,
  setTrackUpdate,
  table,
  tbody,
  tr,
  td,
  div,
  button,
} from '@dark-engine/platform-browser';

const flag = { [Flag.HAS_NO_MOVES]: true };

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

type StaticLayoutProps = {
  slot: DarkElement;
};

const StaticLayout = memo(
  component<StaticLayoutProps>(({ slot }) => slot),
  () => false,
);

const fn = () => {};

let nextId = 0;
const buildData = (count: number, prefix = ''): Array<ListItem> => {
  return Array(count)
    .fill(0)
    .map(() => ({
      id: ++nextId,
      name: `item: ${nextId} ${prefix}`,
      selected: false,
      update: fn,
    }));
};

type ListItem = { id: number; name: string; selected: boolean; update: () => void };

type HeaderProps = {
  onCreate: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onPrepend: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onAppend: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onInsertDifferent: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onUpdateAll: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onSwap: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onClear: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
};

const Header = component<HeaderProps>(
  ({ onCreate, onPrepend, onAppend, onInsertDifferent, onUpdateAll, onSwap, onClear }) => {
    return div({
      style:
        'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
      slot: [
        button({
          slot: Text('create 10 rows'),
          onClick: onCreate,
        }),
        button({
          slot: Text('Prepend 2 rows'),
          onClick: onPrepend,
        }),
        button({
          slot: Text('Append 2 rows'),
          onClick: onAppend,
        }),
        button({
          slot: Text('insert different'),
          onClick: onInsertDifferent,
        }),
        button({
          slot: Text('update every 5th row'),
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
  item: ListItem;
  onRemove: (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onHighlight: (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
};

const Row = component<RowProps>(({ item, onRemove, onHighlight }) => {
  const update = useUpdate({ forceSync: true });
  const { id, selected, name } = item;

  item.update = update;

  return tr({
    class: selected ? 'selected' : undefined,
    flag,
    slot: [
      td({ class: 'cell', slot: Text(name) }),
      StaticLayout({
        slot: [
          td({ class: 'cell', slot: Text('qqq') }),
          td({ class: 'cell', slot: Text('xxx') }),
          td({
            class: 'cell',
            slot: [
              button({
                onClick: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => onRemove(id, e),
                slot: Text('remove'),
              }),
              button({
                onClick: (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => onHighlight(id, e),
                slot: Text('highlight'),
              }),
            ],
          }),
        ],
      }),
    ],
  });
});

const MemoRow = memo(Row, () => false);

type ListProps = {
  items: Array<ListItem>;
  onRemove: (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onHighlight: (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
};

const List = component<ListProps>(({ items, onRemove, onHighlight }) => {
  const rows: Array<DarkElement> = [];

  for (const item of items) {
    rows.push(
      MemoRow({
        key: item.id,
        item,
        onRemove,
        onHighlight,
      }),
    );
  }

  return table({
    class: 'table',
    slot: tbody({ slot: rows }),
  });
});

const Bench = component(() => {
  const state = useMemo<{ list: Array<ListItem> }>(() => ({ list: [] }), []);
  const forceUpdate = useUpdate({ forceSync: true });

  const handleCreate = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('create');
    e.stopPropagation();
    state.list = buildData(10);
    forceUpdate();
    measurer.stop();
  };
  const handlePrepend = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('prepend');
    e.stopPropagation();
    state.list.unshift(...buildData(2, '!!!'));
    forceUpdate();
    measurer.stop();
  };
  const handleAppend = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('append');
    e.stopPropagation();
    state.list.push(...buildData(2, '!!!'));
    forceUpdate();
    measurer.stop();
  };
  const handleInsertDifferent = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('insert different');
    e.stopPropagation();
    state.list.splice(0, 0, ...buildData(5, '***'));
    state.list.splice(8, 0, ...buildData(2, '***'));
    forceUpdate();
    measurer.stop();
  };
  const handleSwap = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    if (state.list.length === 0) return;
    measurer.start('swap');
    e.stopPropagation();
    const temp = state.list[1];
    state.list[1] = state.list[state.list.length - 2];
    state.list[state.list.length - 2] = temp;
    forceUpdate();
    measurer.stop();
  };
  const handleClear = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('clear');
    e.stopPropagation();
    state.list = [];
    forceUpdate();
    measurer.stop();
  };
  const handleRemove = (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('remove');
    e.stopPropagation();
    const idx = state.list.findIndex(x => x.id === id);

    idx !== -1 && state.list.splice(idx, 1);
    forceUpdate();
    measurer.stop();
  };
  const handleUpdateAll = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('update every 10th');
    e.stopPropagation();

    for (let i = 0; i < state.list.length; i += 5) {
      state.list[i].name = state.list[i].name + '!!!';
      state.list[i].update();
    }

    measurer.stop();
  };
  const handleHightlight = (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('highlight');
    e.stopPropagation();
    const idx = state.list.findIndex(x => x.id === id);

    state.list[idx].selected = !state.list[idx].selected;
    state.list[idx].update();
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
    List({
      items: state.list,
      onRemove: handleRemove,
      onHighlight: handleHightlight,
    }),
  ];
});

const root = createRoot(document.getElementById('root'));

setTrackUpdate((node: HTMLElement) => {
  if (!node.tagName) return;
  requestAnimationFrame(() => {
    node.classList.add('updated-node');

    setTimeout(() => {
      node.classList.remove('updated-node');
    }, 300);
  });
});

root.render(Bench());
