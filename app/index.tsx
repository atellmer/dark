// import runBench from './benchmark/dark';

// runBench();

import { createComponent, Fragment, h, Text, View } from '../src/core';
import { renderComponent, createPortal } from '../src/platform/browser';

const domElement = document.getElementById('app');
const domElement2 = document.getElementById('app2');
const domElement3 = document.getElementById('app3');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });

const SomeComponent = createComponent(({ value }) => {
  return [
    div({ slot: Text('I am Portal component: ' + value) }),
  ]
});

const App = createComponent(({ value = '' }) => {
  return [
    input({
      value,
      onInput: (e) => renderComponent(App({ value: e.target.value }), domElement),
    }),
    div({ slot: Text('header') }),
    div({
      slot: [
        div({ slot: Text('content') }),
        value !== 'close' && createPortal(
          SomeComponent({ value }),
          domElement2,
        ),
        createPortal(
          [[Text('portal text: ' + value)]],
          domElement3,
        ),
      ]
    }),
    div({ slot: Text('footer') }),
  ]
})

renderComponent(App(), domElement);
