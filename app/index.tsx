import runBench from './benchmark/dark';

//runBench();


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
  useRef,
  useContext,
  createContext,
} from '../src/core';
import { render, useTransitions, createPortal } from '../src/platform/browser';

const domElement = document.getElementById('app');
const domElement2 = document.getElementById('app2');
const domElementPortal = document.getElementById('portal');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const table = (props = {}) => View({ ...props, as: 'table' });
const tbody = (props = {}) => View({ ...props, as: 'tbody' });
const tr = (props = {}) => View({ ...props, as: 'tr' });
const td = (props = {}) => View({ ...props, as: 'td' });



// let nextId = 0;
// const buildData = (count, prefix = '') => {
//   return Array(count).fill(0).map((_, idx) => ({
//     id: ++nextId,
//     name: `item: ${idx + 1} ${prefix}`,
//     select: false,
//   }))
// }

// const state = {
//   list: [],
// };

// const ThemeContext = createContext<string>('dark');

// ThemeContext.displayName = 'ThemeContext';

// const I18nContext = createContext<string>('ru');

// I18nContext.displayName = 'I18nContext';

// type HeaderProps = {
//   onCreate: Function;
//   onAdd: Function;
//   onUpdateAll: Function;
//   onSwap: Function;
//   onClear: Function;
//   onToggleThemeOne: Function;
//   onToggleThemeTwo: Function;
//   onToggleLang: Function;
// }

// const Header = createComponent<HeaderProps>((
//   { onCreate, onAdd, onUpdateAll, onSwap, onClear, onToggleThemeOne, onToggleThemeTwo, onToggleLang }) => {
//   return div({
//     style: 'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
//     slot: [
//       button({
//         slot: Text('create 10000 rows'),
//         onClick: onCreate,
//       }),
//       button({
//         slot: Text('Add 1000 rows'),
//         onClick: onAdd,
//       }),
//       button({
//         slot: Text('update every 10th row'),
//         onClick: onUpdateAll,
//       }),
//       button({
//         slot: Text('swap rows'),
//         onClick: onSwap,
//       }),
//       button({
//         slot: Text('clear rows'),
//         onClick: onClear,
//       }),
//       button({
//         slot: Text('toggle theme 1'),
//         onClick: onToggleThemeOne,
//       }),
//       button({
//         slot: Text('toggle theme 2'),
//         onClick: onToggleThemeTwo,
//       }),
//       button({
//         slot: Text('toggle lang'),
//         onClick: onToggleLang,
//       }),
//     ],
//   });
// });

// const MemoHeader = memo<HeaderProps & { key?: string }>(Header);

// const StateList = createComponent<{prefix: string}>(({ prefix }) => {
//   const [toggle, setToggle] = useState(false);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setToggle(!toggle);
//     }, 0);

//     return () => clearTimeout(timerId);
//   }, [toggle]);

//   return (toggle ? [0, 1] : [0]).map(x => {
//     return (<div key={prefix + ':' + x}>{x}</div>);
//   });
// });

// const MemoStateList = memo(StateList);

// const Emoji = createComponent(() => {
//   const [toggle, setToggle] = useState(true);
//   const transitions = useTransitions(toggle, null, {
//     enter: { className: 'animation-fade-in' },
//     leave: { className: 'animation-fade-out' },
//   });

//   useEffect(() => {
//     const intervalId = setTimeout(() => {
//       setToggle(toggle => !toggle);
//     }, 5000);
//     return () => clearTimeout(intervalId);
//   }, [toggle]);

//   return transitions.map(({ item, key, props }) => {
//     return item
//       ? <div
//           key={key}
//           style='font-size: 100px; position: absolute; top: 128px'
//           class={props.className}
//           onAnimationEnd={props.onAnimationEnd}>
//           😄
//         </div>
//       : <div
//           key={key}
//           style='font-size: 100px; position: absolute; top: 128px'
//           class={props.className}
//           onAnimationEnd={props.onAnimationEnd}>
//           🤪
//         </div>
//   })
// });

// const MemoEmoji = memo(Emoji);

// type ListProps = {
//   items: Array<{ id: number, name: string; select: boolean }>;
//   onRemove: Function;
//   onHighlight: Function;
// }

// type State = { count: number }
// type Action = { type: string; payload: number };

// const reducer = (state: State, action: Action) => {
//   if (action.type === 'INCREMENT') {
//     return { ...state, count: action.payload }
//   }
//   return state;
// }

// const Row = createComponent(({ id, name, selected, onRemove, onHighlight, ...rest }) => {
//   const [{ count }, dispatch] = useReducer(reducer, { count: 0 });
//   const handleRemove = useCallback(() => onRemove(id), [id]);
//   const handleHighlight = useCallback(() => onHighlight(id), [id]);
//   const handleIncrement = useCallback(() => dispatch({ type: 'INCREMENT', payload: count + 1 }), [count]);
//   const theme = useContext<string>(ThemeContext);
//   const lang = useContext<string>(I18nContext);

//   const rowStyle = `
//     background-color: ${selected ? 'green' : 'transparent'};
//   `;
//   const cellStyle = `
//     border: 1px solid ${theme === 'light' ? 'pink' : 'blueviolet'};
//   `;

//   return (
//     <tr style={rowStyle} {...rest}>
//       <td style={cellStyle}>{name}</td>
//       <td style={cellStyle}>1</td>
//       <td style={cellStyle}>lang: {lang}</td>
//       <td style={cellStyle}>
//         <button onClick={handleRemove}>remove</button>
//         <button onClick={handleHighlight}>highlight</button>
//         <button onClick={handleIncrement}>{'count: ' + count}</button>
//       </td>
//     </tr>
//   );
// });

// const MemoRow = memo(Row, (props, nextProps) =>
//   props.name !== nextProps.name ||
//   props.selected !== nextProps.selected ||
//   props.class !== nextProps.class ,
// );

// const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {

//   return (
//     <table style='width: 100%; border-collapse: collapse;'>
//       <tbody>
//         {
//           items.map((item) => {
//             return (
//               <MemoRow
//                 key={item.id}
//                 id={item.id}
//                 name={item.name}
//                 selected={item.select}
//                 onRemove={onRemove}
//                 onHighlight={onHighlight}
//               />
//             );
//           })
//         }
//       </tbody>
//     </table>
//   )
// });

// const MemoList = memo(List);

// const App = createComponent(() => {
//   const [themeOne, setThemeOne] = useState('dark');
//   const [themeTwo, setThemeTwo] = useState('dark');
//   const [lang, setLang] = useState('ru');
//   const handleCreate = useCallback(() => {
//     state.list = buildData(10);
//     console.time('create');
//     forceUpdate();
//     console.timeEnd('create');
//   }, []);
//   const handleAdd = useCallback(() => {
//     state.list.push(...buildData(1000, '!!!'));
//     state.list = [...state.list];
//     console.time('add');
//     forceUpdate();
//     console.timeEnd('add');
//   }, []);
//   const handleUpdateAll = useCallback(() => {
//     state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
//     console.time('update every 10th');
//     forceUpdate();
//     console.timeEnd('update every 10th');
//   }, []);
//   const handleRemove = useCallback((id) => {
//     state.list = state.list.filter((z) => z.id !== id);
//     console.time('remove');
//     forceUpdate();
//     console.timeEnd('remove');
//   }, []);
//   const handleHightlight = useCallback((id) => {
//     const idx = state.list.findIndex(z => z.id === id);
//     state.list[idx].select = !state.list[idx].select;
//     state.list = [...state.list];
//     console.time('highlight');
//     forceUpdate();
//     console.timeEnd('highlight');
//   }, []);
//   const handleSwap = useCallback(() => {
//     if (state.list.length === 0) return;
//     const temp = state.list[1];
//     state.list[1] = state.list[state.list.length - 2];
//     state.list[state.list.length - 2] = temp;
//     state.list = [...state.list];
//     console.time('swap');
//     forceUpdate();
//     console.timeEnd('swap');
//   }, []);
//   const handleClear = useCallback(() => {
//     state.list = [];
//     console.time('clear');
//     forceUpdate();
//     console.timeEnd('clear');
//   }, []);
//   const handleToggleThemeOne = useCallback(() => {
//     themeOne === 'dark' ? setThemeOne('light') : setThemeOne('dark');
//   }, [themeOne]);
//   const handleToggleThemeTwo = useCallback(() => {
//     themeTwo === 'dark' ? setThemeTwo('light') : setThemeTwo('dark');
//   }, [themeTwo]);
//   const handleToggleLang = useCallback(() => {
//     lang === 'ru' ? setLang('en') : setLang('ru');
//   }, [lang]);

//   return (
//     <Fragment>
//       <MemoHeader
//         onCreate={handleCreate}
//         onAdd={handleAdd}
//         onUpdateAll={handleUpdateAll}
//         onSwap={handleSwap}
//         onClear={handleClear}
//         onToggleThemeOne={handleToggleThemeOne}
//         onToggleThemeTwo={handleToggleThemeTwo}
//         onToggleLang={handleToggleLang}
//       />
//       <ThemeContext.Provider value={themeOne}>
//         <Emoji />
//         <MemoList
//           key='list'
//           items={state.list}
//           onRemove={handleRemove}
//           onHighlight={handleHightlight}
//         />
//       </ThemeContext.Provider>
//       <ThemeContext.Provider value={themeTwo}>
//         <I18nContext.Provider value={lang}>
//           <MemoList
//             items={state.list}
//             onRemove={handleRemove}
//             onHighlight={handleHightlight}
//           />
//         </I18nContext.Provider>
//       </ThemeContext.Provider>
//     </Fragment>
//   );
// });

// function forceUpdate() {
//   render(App(), domElement);
// }


const App = createComponent(({ isOpen }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('ref', elementRef.current);
  });

  return (
    <div>
      test
      {isOpen && <div ref={elementRef}>ref</div>}
    </div>
  )
});

render(App({ isOpen: true }), domElement);

setTimeout(() => {
  render(App({ isOpen: false }), domElement);
}, 1000)

setTimeout(() => {
  render(App({ isOpen: true }), domElement);
}, 2000)

