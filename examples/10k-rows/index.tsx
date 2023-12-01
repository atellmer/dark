import {
  type WritableAtom,
  h,
  Text,
  TagVirtualNode,
  TextVirtualNode,
  Flag,
  component,
  memo,
  useMemo,
  atom,
} from '@dark-engine/core';
import { type SyntheticEvent as E, createRoot, table, tbody, div, button } from '@dark-engine/platform-browser';

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
const buildData = (count, prefix = ''): Array<DataItem> => {
  return Array(count)
    .fill(0)
    .map(() => ({
      id: ++nextId,
      name$: atom(`item: ${nextId} ${prefix}`),
    }));
};

type DataItem = { id: number; name$: WritableAtom<string> };

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

type NameProps = {
  name$: WritableAtom<string>;
};

const Name = component<NameProps>(({ name$ }) => new TextVirtualNode(name$.val()));

type RowProps = {
  id: number;
  name$: WritableAtom<string>;
  selected$: WritableAtom<number>;
  onRemove: (id: number, e: E<MouseEvent>) => void;
  onHighlight: (id: number, e: E<MouseEvent>) => void;
};

const Row = component<RowProps>(({ id, selected$, name$, onRemove, onHighlight }) => {
  return new TagVirtualNode(
    'tr',
    {
      class: selected$.val(null, id) === id ? 'selected' : undefined,
      [Flag.STATIC_SLOT_OPT]: true,
    },
    [
      new TagVirtualNode('td', {}, [Name({ name$ })]),
      new TagVirtualNode('td', {}, [new TextVirtualNode('qqq')]),
      new TagVirtualNode('td', {}, [new TextVirtualNode('xxx')]),
      new TagVirtualNode('td', {}, [
        new TagVirtualNode('button', { onClick: [onRemove, id] }, [new TextVirtualNode('remove')]),
        new TagVirtualNode('button', { onClick: [onHighlight, id] }, [new TextVirtualNode('highlight')]),
      ]),
    ],
  );
});

const MemoRow = memo(Row, () => false);

type State = {
  data$: WritableAtom<Array<DataItem>>;
  selected$: WritableAtom<number>;
};

const App = component(() => {
  const state = useMemo<State>(() => ({ data$: atom([]), selected$: atom() }), []);
  const { data$, selected$ } = state;
  const items = data$.val();

  const handleCreate = (e: E<MouseEvent>) => {
    measurer.start('create');
    e.stopPropagation();
    data$.set(buildData(10000));
    measurer.stop();
  };
  const handlePrepend = (e: E<MouseEvent>) => {
    measurer.start('prepend');
    e.stopPropagation();
    const data = data$.get();
    data.unshift(...buildData(1000, '^^^'));
    data$.set(data);
    measurer.stop();
  };
  const handleAppend = (e: E<MouseEvent>) => {
    measurer.start('append');
    e.stopPropagation();
    const data = data$.get();
    data.push(...buildData(1000, '^^^'));
    data$.set(data);
    measurer.stop();
  };
  const handleInsertDifferent = (e: E<MouseEvent>) => {
    measurer.start('insert different');
    e.stopPropagation();
    const data = data$.get();
    data.splice(0, 0, ...buildData(5, '***'));
    data.splice(8, 0, ...buildData(2, '***'));
    data$.set(data);
    measurer.stop();
  };
  const handleUpdateAll = (e: E<MouseEvent>) => {
    measurer.start('update every 10th');
    e.stopPropagation();
    const data = data$.get();

    for (let i = 0; i < data.length; i += 10) {
      data[i].name$.set(x => x + '!!!');
    }
    measurer.stop();
  };
  const handleRemove = (id: number, e: E<MouseEvent>) => {
    measurer.start('remove');
    e.stopPropagation();
    const data = data$.get();
    const idx = data.findIndex(x => x.id === id);
    idx !== -1 && data.splice(idx, 1);
    data$.set(data);
    measurer.stop();
  };
  const handleHightlight = (id: number, e: E<MouseEvent>) => {
    measurer.start('highlight');
    e.stopPropagation();
    selected$.set(id);
    measurer.stop();
  };
  const handleSwap = (e: E<MouseEvent>) => {
    const data = data$.get();
    if (data.length === 0) return;
    measurer.start('swap');
    e.stopPropagation();
    const temp = data[1];
    data[1] = data[data.length - 2];
    data[data.length - 2] = temp;
    data$.set(data);
    measurer.stop();
  };
  const handleClear = (e: E<MouseEvent>) => {
    measurer.start('clear');
    e.stopPropagation();
    data$.set([]);
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
        key: items.length > 0 ? 1 : 2,
        [Flag.MEMO_SLOT_OPT]: true,
        slot: items.map(item => {
          const { id, name$ } = item;

          return MemoRow({
            key: id,
            id,
            name$,
            selected$,
            onRemove: handleRemove,
            onHighlight: handleHightlight,
          });
        }),
      }),
    }),
  ];
});

createRoot(document.getElementById('root')).render(App());
