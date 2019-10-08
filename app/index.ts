import { createComponent, Text, View } from '../src/core';
import { renderComponent } from '../src/platform/browser';

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });

const Component = createComponent(({ text }) => {
  return div({
    children: [
      button({
        onClick: () => {
          console.log(text);
          renderComponent(App({ isOpen: true, count: text }), document.getElementById('app'));
        },
        children: [
          Text(text),
        ],
      }),
    ],
  })
});

const App = createComponent(({ isOpen, count = 0 }) => {
  const renderList = () => [
    ...Array(1000)
      .fill(0)
      .map((_, idx) => Component({ text: idx })),
  ];

  // renderComponent(Component({ text: isOpen ? 'on' : 'off' }), document.getElementById('app2'));

  return [
    Text(`current: ${count}`),
    renderList(),
  ]
});

renderComponent(App({ isOpen: true }), document.getElementById('app'));

// setTimeout(() => {
//   renderComponent(App({ isOpen: false }), document.getElementById('app'));
// }, 2000)

// setTimeout(() => {
//   renderComponent(App({ isOpen: true }), document.getElementById('app'));
// }, 4000)
