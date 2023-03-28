import {
  type DarkElement,
  Text,
  component,
  memo,
  Flag,
  type Atom,
  atom,
  useAtom,
  useReactiveState,
} from '@dark-engine/core';
import { type SyntheticEvent, createRoot, table, tbody, tr, td, div, button } from '@dark-engine/platform-browser';

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

let nextId = 0;
const buildData = (count: number, prefix = ''): Array<Atom<DataItem>> => {
  return Array(count)
    .fill(0)
    .map(() =>
      atom({
        id: ++nextId,
        name: `item: ${nextId} ${prefix}`,
      }),
    );
};

type DataItem = { id: number; name: string };

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
          onClick: () => root.unmount(),
        }),
      ],
    });
  },
);

const MemoHeader = memo(Header, () => false);

type RowProps = {
  id: number;
  item$: Atom<DataItem>;
  selected$: Atom<number>;
  onRemove: (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
  onHighlight: (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => void;
};

const Row = component<RowProps>(({ id, item$, selected$, onRemove, onHighlight }) => {
  const [{ name }, selected] = useAtom([[item$], [selected$, (p, n) => p === id || n === id]]);

  return tr({
    class: selected === id ? 'selected' : undefined,
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

type State = {
  listX: Array<Atom<DataItem>>;
  selected$: Atom<number>;
};

const Bench = component(() => {
  const state = useReactiveState<State>({ selected$: atom(), listX: [] }, { forceSync: true });

  const handleCreate = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('create');
    e.stopPropagation();
    state.listX = buildData(10000);
    measurer.stop();
  };
  const handlePrepend = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('prepend');
    e.stopPropagation();
    const list = [...buildData(1000, '!!!'), ...state.listX];

    state.listX = list;
    measurer.stop();
  };
  const handleAppend = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('append');
    e.stopPropagation();
    const list = [...state.listX, ...buildData(1000, '!!!')];

    state.listX = list;
    measurer.stop();
  };
  const handleInsertDifferent = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('insert different');
    e.stopPropagation();
    const list = [...state.listX];

    list.splice(0, 0, ...buildData(5, '***'));
    list.splice(8, 0, ...buildData(2, '***'));

    state.listX = list;
    measurer.stop();
  };
  const handleSwap = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    if (state.listX.length === 0) return;
    measurer.start('swap');
    e.stopPropagation();
    const list = [...state.listX];
    const temp = list[1];

    list[1] = list[list.length - 2];
    list[list.length - 2] = temp;

    state.listX = list;
    measurer.stop();
  };
  const handleClear = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('clear');
    e.stopPropagation();
    state.listX = [];
    state.selected$.set(undefined);
    measurer.stop();
  };
  const handleRemove = (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('remove');
    e.stopPropagation();
    const list = [...state.listX];
    const idx = list.findIndex(x => x.get().id === id);

    idx !== -1 && list.splice(idx, 1);

    state.listX = list;
    state.selected$.set(undefined);
    measurer.stop();
  };
  const handleUpdateAll = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('update every 10th');
    e.stopPropagation();

    for (let i = 0; i < state.listX.length; i += 10) {
      const item = state.listX[i].get();

      state.listX[i].set({ ...item, name: item.name + '!!!' });
    }

    measurer.stop();
  };
  const handleHightlight = (id: number, e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
    measurer.start('highlight');
    e.stopPropagation();
    state.selected$.set(id);
    measurer.stop();
  };

  const rows: Array<DarkElement> = [];

  for (const item$ of state.listX) {
    const id = item$.get().id;

    rows.push(
      MemoRow({
        key: id,
        id,
        item$,
        selected$: state.selected$,
        onRemove: handleRemove,
        onHighlight: handleHightlight,
      }),
    );
  }

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
      slot: tbody({ slot: rows }),
    }),
  ];
});

const root = createRoot(document.getElementById('root'));

root.render(Bench());
