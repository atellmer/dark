import { createComponent, Fragment, h, Text, View } from '../src/core';
import { renderComponent } from '../src/platform/browser';

const domElement = document.getElementById('app');
const domElement2 = document.getElementById('app2');
const domElement3 = document.getElementById('app3');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });
const table =  (props = {}) => View({ ...props, as: 'table' });
const tbody =  (props = {}) => View({ ...props, as: 'tbody' });
const tr =  (props = {}) => View({ ...props, as: 'tr' });
const td =  (props = {}) => View({ ...props, as: 'td' });

// type ContainerProp = {
//   value: string;
// };

// const Container = createComponent<ContainerProp>(({ slot, value }) => {
//   return (
//     <div style='color: green'>
//       {typeof slot === 'function' && slot('render props pattern')}
//       value: {value}
//     </div>
//   );
// });

// type AppProps = {
//   isOpen?: boolean;
//   value: string;
// };

// const App = createComponent<AppProps>(({ value = 'open' }) => {
//   const isOpen = value === 'open';
//   const renderInput = () => {
//     return <input value={value || ''} onInput={e => renderComponent(App({ value: e.target.value }), domElement)} />;
//   };

//   // return (
//   //   Container({
//   //     value,
//   //     slot: (v) => div({ slot: Text(v) }),
//   //   })
//   // );

//   // return (
//   //   <div>
//   //     <div>1</div>
//   //     <div>2</div>
//   //     <div>3</div>
//   //   </div>
//   // )

//   return (
//     <div>
//       <Fragment>
//         <div>1</div>
//         <div>2</div>
//         <div>3</div>
//       </Fragment>
//       <div>xxx</div>
//       {
//         isOpen &&
//         [
//           <div>1</div>,
//           <div>2</div>,
//           <div>3</div>,
//         ]
//       }
//       {renderInput()}
//       <Container value={value}>{v => <div>{v}</div>}</Container>
//     </div>
//   );
// });

let nextId = 0;
const buildData = (count, prefix = '') => {
  return Array(count).fill(0).map((_, idx) => ({
    id: ++nextId,
    name: `item: ${idx + 1} ${prefix}`,
  }))
}


type WithListProp = {
  list: Array<{id: number, name: string}>;
}

const state = {
  list: buildData(1000),
};


type HeaderProps = {
  onAdd: Function;
  onUpdateAll: Function;
  onSwap: Function;
  onClear: Function;
}

const Header = createComponent<HeaderProps>(({ onAdd, onUpdateAll, onSwap, onClear }) => {
  return div({
    style: 'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
    slot: [
      button({
        slot: Text('Add 1000 rows'),
        onClick: onAdd,
      }),
      button({
        slot: Text('update all rows'),
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

type ListProps = {
  items: Array<{id: number, name: string}>;
  onRemove: Function;
}

const List = createComponent<ListProps>(({ items, onRemove }) => {
  const cellStyle = 'border: 1px solid pink;';
  return table({
    style: 'width: 100%; border-collapse: collapse;',
    slot: tbody({
      slot: items.map((x) => {
        return tr({
          key: x.id,
          slot: [
            td({ style: cellStyle, slot: Text(x.name) }),
            td({ style: cellStyle, slot: Text('1') }),
            td({ style: cellStyle, slot: Text('2') }),
            td({
              style: cellStyle,
              slot: button({
                slot: Text('remove'),
                onClick: () => onRemove(x),
              }),
            }),
          ],
        })
      }),
    }),
  });
});

const App = createComponent(() => {
  const handleAdd = () => {
    console.time('add')
    state.list = [...buildData(1000, '!!!'), ...state.list];
    forceUpdate();
    console.timeEnd('add')
  };
  const handleUpdateAll = () => {
    console.time('update all')
    state.list = state.list.map(x => ({...x, name: x.name + '!!!'}));
    forceUpdate();
    console.timeEnd('update all')
  };
  const handleRemove = (x) => {
    console.time('remove');
    const idx = state.list.findIndex(z => z.id === x.id);
    state.list.splice(idx, 1);
    forceUpdate();
    console.timeEnd('remove');
  };
  const handleSwap = () => {
    console.time('swap')
    if (state.list.length > 998) {
      const temp = state.list[1];
      state.list[1] = state.list[998];
      state.list[998] = temp;
    }
    forceUpdate();
    console.timeEnd('swap')
  };

  const handleClear = () => {
    console.time('clear');
    state.list = [];
    forceUpdate();
    console.timeEnd('clear');
  };

  return div({
    slot: [
      Header({
        onAdd: handleAdd,
        onUpdateAll: handleUpdateAll,
        onSwap: handleSwap,
        onClear: handleClear,
      }),
      List({ items: state.list, onRemove: handleRemove }),
    ],
  })
});


console.time('add')
renderComponent(App(), domElement);
console.timeEnd('add')

function forceUpdate() {
  renderComponent(App(), domElement);
}

// setTimeout(() => renderComponent(App({ isOpen: false }), domElement), 2000)
// setTimeout(() => renderComponent(App({ isOpen: true }), domElement), 4000)
