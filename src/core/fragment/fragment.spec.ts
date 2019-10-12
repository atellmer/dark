import { Text, VirtualNode } from '../vdom';
import { Fragment } from './fragment';


test('[Fragment]: Fragment wrap children correctly', () => {
  const compile = Fragment({
    slot: [
      Text('1'),
      Text('2'),
      Text('3'),
    ],
  }).createElement() as Array<VirtualNode>;

  expect(Array.isArray(compile)).toBe(true);
  expect(compile.length).toBe(3);
});
