const {
  Fragment,
  memo,
  useCallback,
  useMemo,
} = React;;
const { render } = ReactDOM;

const domElement = document.getElementById('app');

const createMeasurer = () => {
  let startTime;
  let lastMeasureName;
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
      }, 0);
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

const Header = ({ onCreate, onAdd, onUpdateAll, onSwap, onClear }) => {
  const style = {
    width: '100%',
    height: '64px',
    backgroundColor: 'blueviolet',
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
  }
  return (
    <div style={style}>
      <button onClick={onCreate}>create 10000 rows</button>
      <button onClick={onAdd}>Add 1000 rows</button>
      <button onClick={onUpdateAll}>update every 10th row</button>
      <button onClick={onSwap}>swap rows</button>
      <button onClick={onClear}>clear rows</button>
    </div>
  );
}

const MemoHeader = memo<HeaderProps>(Header);

type ListProps = {
  items: Array<{ id: number, name: string; select: boolean }>;
  onRemove: Function;
  onHighlight: Function;
}

const Row = ({ id, name, selected, onRemove, onHighlight }) => {
  const handleRemove = useCallback(() => onRemove(id), [id]);
  const handleHighlight = useCallback(() => onHighlight(id), [id]);

  return (
    <tr className={selected && 'selected'}>
      <td className='cell'>{name}</td>
      <td className='cell'>1</td>
      <td className='cell'>2</td>
      <td className='cell'>
        <button onClick={handleRemove}>remove</button>
        <button onClick={handleHighlight}>highlight</button>
      </td>
    </tr>
  );
}

const MemoRow = memo(Row, (props, nextProps) =>
  props.name === nextProps.name &&
  props.selected === nextProps.selected,
);

const List = ({ items, onRemove, onHighlight }) => {
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
    <table class='table'>
      <tbody>
        {items.map(renderRow)}
      </tbody>
    </table>
  )
};

const MemoList = memo(List);

const App = () => {
  const handleCreate = useCallback(() => {
    state.list = buildData(10000);
    measurer.start('create');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleAdd = useCallback(() => {
    state.list.push(...buildData(1000, '!!!'));
    state.list = [...state.list];
    measurer.start('add');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleUpdateAll = useCallback(() => {
    state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
    measurer.start('update every 10th');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleRemove = useCallback((id) => {
    state.list = state.list.filter((z) => z.id !== id);
    measurer.start('remove');
    forceUpdate();
    measurer.stop();
  }, []);
  const handleHightlight = useCallback((id) => {
    const idx = state.list.findIndex(z => z.id === id);
    state.list[idx].select = !state.list[idx].select;
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
};

function runBench() {
  render(<App />, domElement);
}

function forceUpdate() {
  render(<App />, domElement);
}

export default runBench;
