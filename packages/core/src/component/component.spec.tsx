import { View, detectIsVirtualNode, VirtualNodeFactory } from '../view';
import { createComponent, detectIsComponentFactory, getComponentFactoryKey } from './component';

const div = (props = {}) => View({ ...props, as: 'div' });

describe('[create-component]', () => {
  test('does not throw error', () => {
    const compile = () => {
      const Component = createComponent(() => null);
      Component();
    };

    expect(compile).not.toThrowError();
  });

  test('type call does not throw error', () => {
    const compile = () => {
      const Component = createComponent(() => null);
      Component().type({});
    };

    expect(compile).not.toThrowError();
  });

  test('type returns virtual node factory correctly', () => {
    const Component = createComponent(() => div());
    const vNodeFactory = Component().type({}) as VirtualNodeFactory;

    expect(typeof vNodeFactory).toBe('function');
    expect(detectIsVirtualNode(vNodeFactory())).toBeTruthy();
  });

  test('type returns null correctly', () => {
    const Component = createComponent(() => null);
    const element = Component().type({});

    expect(element).toBeNull();
  });

  test('pass props to component correctly', () => {
    const compile = () => {
      const Component = createComponent<{ one: string; two: string }>(({ one, two }) => {
        expect(one).toBe('hello');
        expect(two).toBe('world');
        return null;
      });
      const factory = Component({ one: 'hello', two: 'world' });

      factory.type(factory.props);
    };

    compile();
  });

  test('createElement provides correct displayName', () => {
    const displayName = 'MyComponent';
    const Component = createComponent(() => null, { displayName });

    expect(Component().displayName).toBe(displayName);
  });

  test('provides token correctly', () => {
    const token = Symbol();
    const Component = createComponent(() => null, { token });

    expect(Component().token).toBe(token);
  });

  test('detectIsComponentFactory works correctly', () => {
    const Component = createComponent(() => null);

    expect(detectIsComponentFactory(Component())).toBeTruthy();
  });

  test('getComponentFactoryKey works correctly', () => {
    const Component = createComponent(() => null);
    const key = 'somekey';

    expect(getComponentFactoryKey(Component({ key }))).toBe(key);
  });
});
