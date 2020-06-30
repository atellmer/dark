import {
  createComponent,
  detectIsComponentFactory,
  getComponentFactoryKey,
} from './component';
import { View, detectIsVirtualNode } from '../view/view';
import { VirtualNode } from '../view';


const div = (props = {}) => View({ ...props, as: 'div' });

test('[Component]: createComponent do not throws error', () => {
  const compile = () => {
    const Component = createComponent(() => null);
    Component();
  };

  expect(compile).not.toThrowError();
});

test('[Component]: type do not throws error', () => {
  const compile = () => {
    const Component = createComponent(() => null);
    Component().type({});
  };

  expect(compile).not.toThrowError();
});

test('[Component]: type returns virtual node correctly', () => {
  const Component = createComponent(() => div());
  const vNode = Component().type({}) as VirtualNode;

  expect(vNode).toBeTruthy();
  expect(detectIsVirtualNode(vNode)).toBeTruthy();
});

test('[Component]: type returns null correctly', () => {
  const Component = createComponent(() => null);
  const element = Component().type({});

  expect(element).toBeNull();
});

test('[Component]: pass props to component correctly', () => {
  const compile = () => {
    const Component = createComponent(({ one, two }) => {
      expect(one).toBe('hello');
      expect(two).toBe('world');
      return null;
    });
    const factory = Component({ one: 'hello', two: 'world' });

    factory.type(factory.props);
  };

  compile();
});

test('[Component]: createElement provide correct displayName', () => {
  const displayName = 'MyComponent';
  const Component = createComponent(() => null, { displayName });

  expect(Component().displayName).toBe(displayName);
});

test('[Component]: createComponent provide token correctly', () => {
  const token = Symbol();
  const Component = createComponent(() => null, { token });

  expect(Component().token).toBe(token);
});

test('[Component]: detectIsComponentFactory works correctly', () => {
  const Component = createComponent(() => null);

  expect(detectIsComponentFactory(Component())).toBeTruthy();
});

test('[Component]: getComponentFactoryKey works correctly', () => {
  const Component = createComponent(() => null);
  const key = 'somekey';

  expect(getComponentFactoryKey(Component({ key }))).toBe(key);
});
