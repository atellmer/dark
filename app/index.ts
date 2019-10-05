import { createComponent, View, Text } from '../src';

const div = (props = {}) => View({ ...props, as: 'div' });

const App = createComponent(({ color }) => {
  return (
    div({
      style: `color: ${color}`,
      onClick: () => {},
      children: [
        Text('hello'),
      ],
    })
  );
});

console.log('App: ', App({ color: 'pink' }).createElement())
