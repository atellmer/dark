import {
  h,
  createComponent,
  Text,
  View,
  Fragment,
  memo,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  createContext,
} from '../../src/core';
import { render, useTransitions } from '../../src/platform/browser';

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

const ThemeContext = createContext<string>('dark');
ThemeContext.displayName = 'ThemeContext';

type HeaderProps = {
  onCreate: Function;
  onAdd: Function;
  onUpdateAll: Function;
  onSwap: Function;
  onClear: Function;
  onToggleTheme: Function;
}

const Header = createComponent<HeaderProps>(({ onCreate, onAdd, onUpdateAll, onSwap, onClear, onToggleTheme }) => {
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
      button({
        slot: Text('toggle theme'),
        onClick: onToggleTheme,
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

type State = { count: number }
type Action = { type: string; payload: number };

const reducer = (state: State, action: Action) => {
  if (action.type === 'INCREMENT') {
    return { ...state, count: action.payload }
  }
  return state;
}

const Row = createComponent(({ id, name, selected, onRemove, onHighlight, ...rest }) => {
  const [{ count }, dispatch] = useReducer(reducer, { count: 0 });
  const handleRemove = useCallback(() => onRemove(id), [id]);
  const handleHighlight = useCallback(() => onHighlight(id), [id]);
  const handleIncrement = useCallback(() => dispatch({ type: 'INCREMENT', payload: count + 1 }), [count]);

  return (
    <ThemeContext.Consumer>
      {
        (theme) => {
          const rowStyle = `
            background-color: ${selected ? 'green' : 'transparent'};
          `;
          const cellStyle = `
            border: 1px solid ${theme === 'light' ? 'pink' : 'blueviolet'};
          `;
          return (
            <tr style={rowStyle} {...rest}>
              <td style={cellStyle}>{name}</td>
              <td style={cellStyle}>1</td>
              <td style={cellStyle}>2</td>
              <td style={cellStyle}>
                <button onClick={handleRemove}>remove</button>
                <button onClick={handleHighlight}>highlight</button>
                <button onClick={handleIncrement}>{'count: ' + count}</button>
              </td>
            </tr>
          )
        }
      }
    </ThemeContext.Consumer>
  );
});

const MemoRow = memo(Row, (props, nextProps) =>
  props.name !== nextProps.name ||
  props.selected !== nextProps.selected ||
  props.class !== nextProps.class ,
);

const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {

  return (
    <table style='width: 100%; border-collapse: collapse;'>
      <tbody>
        {
          items.map((item) => {
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
          })
        }
      </tbody>
    </table>
  )
});

const MemoList = memo(List);

const StateList = createComponent<{prefix: string}>(({ prefix }) => {
  const [list, setList] = useState(Array(2).fill(0).map((_, idx) => idx));

  useEffect(() => {
    const timerId = setTimeout(() => {
      const newList = [...list];
      newList.length > 0 && newList.shift();

      setList(newList);
    }, 5000);

    return () => clearTimeout(timerId);
  }, []);

  return list.map(x => {
    return (<div key={prefix + ':' + x}>{x}</div>);
  });
});

const MemoStateList = memo(StateList);

const App = createComponent(() => {
  const [theme, setTheme] = useState('dark');
  const handleCreate = useCallback(() => {
    state.list = buildData(10);
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
  const handleToggleTheme = useCallback(() => {
    theme === 'dark' ? setTheme('light') : setTheme('dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <MemoHeader
        onCreate={handleCreate}
        onAdd={handleAdd}
        onUpdateAll={handleUpdateAll}
        onSwap={handleSwap}
        onClear={handleClear}
        onToggleTheme={handleToggleTheme}
      />
      <MemoStateList prefix={'1'} />
      <MemoList
        items={state.list}
        onRemove={handleRemove}
        onHighlight={handleHightlight}
      />
      <MemoStateList prefix={'2'} />
    </ThemeContext.Provider>
  );
});

function runBench() {
  render(App(), domElement);
}

function forceUpdate() {
  render(App(), domElement);
}

export default runBench;
