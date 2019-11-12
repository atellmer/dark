import runBench from './benchmark/dark';

//runBench();
import { createComponent, Fragment, h, Text, View, memo, useState } from '../src/core';
import { renderComponent, createPortal } from '../src/platform/browser';

const domElement = document.getElementById('app');
const domElement1 = document.getElementById('portal');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });



const TextItem = createComponent(({ value }) => {
  console.log('render');

  return [
    div({
      slot: [
        value !== 'close' && createPortal(
          div({ slot: Text(`xxx: ${value}`) }),
          domElement1,
        ),
      ]
    }) 
  ];
});

//const MemoTextItem = memo(TextItem);
const MemoTextItem = memo(TextItem, () => false);

const App = createComponent(() => {
  const [value, setValue] = useState<string>('');

  return [
    MemoTextItem({ value }),
    input({
      value: value,
      onInput: (e) => setValue(e.target.value),
    }),
    // Text(`value: ${value}`),
  ]
})

renderComponent(App(), domElement);
