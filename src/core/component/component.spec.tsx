import {
  createComponent,
  detectIsComponentFactory,
  getComponentFactoryKey,
} from './component';
import { View, detectIsVirtualNode } from '../view/view';
import { VirtualNode } from '../view/model';


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
    Component().createElement({});
  };

  expect(compile).not.toThrowError();
});

test('[Component]: createElement returns virtual node', () => {
  const Component = createComponent(() => div());
  const vNode = Component().createElement({}) as VirtualNode;

  expect(vNode).toBeTruthy();
  expect(detectIsVirtualNode(vNode)).toBe(true);
});

test('[Component]: pass props to component correctly', () => {
  const compile = () => {
    const Component = createComponent(({ one, two }) => {
      expect(one).toBe('hello');
      expect(two).toBe('world');
      return div();
    });
    const factory = Component({ one: 'hello', two: 'world' });

    factory.createElement(factory.props);
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

test('[Component]: createComponent provide type as function', () => {
  const Component = createComponent(() => null);

  expect(typeof Component().type).toBe('function');
});

test('[Component]: detectIsComponentFactory works correctly', () => {
  const Component = createComponent(() => null);

  expect(detectIsComponentFactory(Component())).toBe(true);
});

test('[Component]: getComponentFactoryKey works correctly', () => {
  const Component = createComponent(() => null);
  const key = 'somekey';

  expect(getComponentFactoryKey(Component({ key }))).toBe(key);
});
