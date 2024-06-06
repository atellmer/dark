import { render } from '@dark-engine/platform-browser';

import { View, detectIsVirtualNode, VirtualNodeFactory } from '../view';
import { useEffect } from '../use-effect';
import { component, detectIsComponent } from './component';

let host: HTMLElement = null;
const div = (props = {}) => View({ ...props, as: 'div' });

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/component', () => {
  test('does not throw error', () => {
    const compile = () => {
      const Component = component(() => null);
      Component();
    };

    expect(compile).not.toThrowError();
  });

  test('type call does not throw error', () => {
    const compile = () => {
      const Component = component(() => null);
      Component().kind({});
    };

    expect(compile).not.toThrowError();
  });

  test('type returns virtual node factory', () => {
    const Component = component(() => div());
    const vNodeFactory = Component().kind({}) as VirtualNodeFactory;

    expect(vNodeFactory).toBeInstanceOf(Function);
    expect(detectIsVirtualNode(vNodeFactory())).toBeTruthy();
  });

  test('type can return null', () => {
    const Component = component(() => null);
    const element = Component().kind({});

    expect(element).toBeNull();
  });

  test('can pass props to component correctly', () => {
    type ComponentProps = {
      one: string;
      two: string;
    };
    const Component = component<ComponentProps>(({ one, two }) => {
      expect(one).toBe('hello');
      expect(two).toBe('world');

      return null;
    });
    const instance = Component({ one: 'hello', two: 'world' });

    instance.kind(instance.props);
  });

  test('provides correct displayName', () => {
    const displayName = 'MyComponent';
    const Component = component(() => null, { displayName });

    expect(Component().displayName).toBe(displayName);
  });

  test('provides token correctly', () => {
    const token = Symbol();
    const Component = component(() => null, { token });

    expect(Component().token).toBe(token);
  });

  test('detectIsComponent works correctly', () => {
    const Component = component(() => null);

    expect(detectIsComponent(Component())).toBeTruthy();
  });

  test('component unmounts when key changed', () => {
    const dropFn = jest.fn();

    type AppProps = {
      x: number;
    };

    const $render = (props: AppProps) => {
      render(App(props), host);
    };

    const Child = component(() => {
      useEffect(() => {
        return () => dropFn();
      }, []);

      return <div>child</div>;
    });

    const App = component<AppProps>(({ x }) => {
      return <Child key={x} />;
    });

    $render({ x: 1 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(0);

    $render({ x: 1 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(0);

    $render({ x: 2 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(1);

    $render({ x: 3 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(2);

    $render({ x: 3 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(2);
  });
});
