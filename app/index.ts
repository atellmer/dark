import { createComponent, Text, View } from '../src/core';
import { renderComponent } from '../src/platform/browser';

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });


const list = [...Array(10).fill(0)];

const Component = createComponent(({ text }) => {
  return (
    div({
      children: [
        button({
          onClick: () => {
            list.pop();
            console.log('text: ', text)
            renderComponent(App({ isOpen: true, count: text, list }), document.getElementById('app'));
          },
          children: [
            Text(text),
          ],
        }),
      ],
    })
  )
});

const App = createComponent(({ isOpen, list, count = 0 }) => {
  const renderList = () => [
    ...list.map((_, idx) => Component({ text: idx })),
  ];

  return [
    Text(`current: ${count}`),
    button({
      style: 'color: red',
      onClick: () => {
        console.log('click');
        renderComponent(App({ isOpen: true, count: 'text', list }), document.getElementById('app'));
      },
      children: [Text('click me')],
    }),
    renderList(),
  ]
});

renderComponent(App({ isOpen: true, list }), document.getElementById('app'));

// setTimeout(() => {
//   renderComponent(App({ isOpen: false }), document.getElementById('app'));
// }, 2000)

// setTimeout(() => {
//   renderComponent(App({ isOpen: true }), document.getElementById('app'));
// }, 4000)
