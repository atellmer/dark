import { View, VirtualNode } from '../vdom';
import { createComponent } from './component';

const div = (props = {}) => View({ ...props, as: 'div' });

test('[Component]: createComponent do not throws error', () => {
  const compile = () => {
    const Component = createComponent(() => div());
    Component();
  };

  expect(compile).not.toThrowError();
});

test('[Component]: createElement do not throws error', () => {
  const compile = () => {
    const Component = createComponent(() => div());
    Component().createElement();
  };

  expect(compile).not.toThrowError();
});

test('[Component]: createElement returns virtual node', () => {
  const Component = createComponent(() => div());
  const vNode = Component().createElement() as VirtualNode;

  expect(vNode).toBeTruthy();
  expect(vNode.isVirtualNode).toBe(true);
});

test('[Component]: pass props to component correctly', () => {
  const Component = createComponent(({ one, two }) => {
    expect(one).toBe('hello');
    expect(two).toBe('world');
    return div();
  });
  Component({ one: 'hello', two: 'world' }).createElement() as VirtualNode;
});
