import { createComponent, Fragment, h, Text, View } from '../src/core';
import { renderComponent } from '../src/platform/browser';

const domElement = document.getElementById('app');
const domElement2 = document.getElementById('app2');
const domElement3 = document.getElementById('app3');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });

type ContainerProp = {
  value: string;
};

const Container = createComponent<ContainerProp>(({ slot, value }) => {
  // return div({
  //   style: 'color: red',
  //   slot: slot(5)
  // });

  return (
    <div style='color: green'>
      {typeof slot === 'function' && slot('render props pattern')}
      value: {value}
    </div>
  );
});

type ButtonProps = {
  fullWidth?: boolean;
  onClick: (e) => void;
};

const Button = createComponent<ButtonProps>(({ slot, fullWidth, onClick }) => {
  return (
    <button data-test='xxxxx' style={`width: ${fullWidth ? '100%' : 'auto'}`} onClick={onClick}>
      {slot}
    </button>
  );
});

type AppProps = {
  isOpen?: boolean;
  value: string;
};

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

const Component = createComponent(() => {
  return [
    div({ slot: Text('1') }),
    div({ slot: Text('2') }),
    div({ slot: Text('3') }),
  ]
})
const App = createComponent(() => {
  return div({
    slot: [
      [
        Component(),
        Component(),
        Component(),
      ],
      [
        Component(),
      ],
      Text('xxx'),
      Text('zzz'),
    ],
  })
});

renderComponent(App(), domElement);
