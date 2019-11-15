import runBench from './benchmark/dark';

//runBench();
import { createComponent, Fragment, h, Text, View, memo, useState } from '../src/core';
import { renderComponent, createPortal } from '../src/platform/browser';

const domElement1 = document.getElementById('app');
const domElementPortal = document.getElementById('portal');
const domElement2 = document.getElementById('app2');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });


const TextItem = createComponent(({ value }) => {
  return [
    div({
      slot: [
        div({ slot: Text(`xxx: ${value}`) })
      ]
    }) 
  ];
});

const MemoTextItem = memo(TextItem);

const App = createComponent(() => {
  const [value, setValue] = useState<string>('');

  return [
    MemoTextItem({ value }),
    input({
      value: value,
      onInput: (e) => setValue(e.target.value),
    }),
    //Text(`value: ${value}`),
  ]
})

renderComponent(App(), domElement1);

renderComponent(App(), domElement2);
