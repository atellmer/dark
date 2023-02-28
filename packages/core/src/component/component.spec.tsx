/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { h } from '../element';
import { View, detectIsVirtualNode, VirtualNodeFactory } from '../view';
import { useEffect } from '../use-effect';
import { createComponent, detectIsComponent, getComponentKey } from './component';

let host: HTMLElement = null;
const div = (props = {}) => View({ ...props, as: 'div' });

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

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

  test('type returns virtual node factory', () => {
    const Component = createComponent(() => div());
    const vNodeFactory = Component().type({}) as VirtualNodeFactory;

    expect(vNodeFactory).toBeInstanceOf(Function);
    expect(detectIsVirtualNode(vNodeFactory())).toBeTruthy();
  });

  test('type can return null', () => {
    const Component = createComponent(() => null);
    const element = Component().type({});

    expect(element).toBeNull();
  });

  test('can pass props to component correctly', () => {
    type ComponentProps = {
      one: string;
      two: string;
    };
    const Component = createComponent<ComponentProps>(({ one, two }) => {
      expect(one).toBe('hello');
      expect(two).toBe('world');

      return null;
    });
    const component = Component({ one: 'hello', two: 'world' });

    component.type(component.props);
  });

  test('provides correct displayName', () => {
    const displayName = 'MyComponent';
    const Component = createComponent(() => null, { displayName });

    expect(Component().displayName).toBe(displayName);
  });

  test('provides token correctly', () => {
    const token = Symbol();
    const Component = createComponent(() => null, { token });

    expect(Component().token).toBe(token);
  });

  test('detectIsComponent works correctly', () => {
    const Component = createComponent(() => null);

    expect(detectIsComponent(Component())).toBeTruthy();
  });

  test('getComponentKey works correctly', () => {
    const Component = createComponent(() => null);
    const key = 'somekey';

    expect(getComponentKey(Component({ key }))).toBe(key);
  });

  test('component unmounts when key changed', () => {
    const dropFn = jest.fn();

    type AppProps = {
      x: number;
    };

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const Child = createComponent(() => {
      useEffect(() => {
        return () => dropFn();
      }, []);

      return <div>child</div>;
    });

    const App = createComponent<AppProps>(({ x }) => {
      return <Child key={x} />;
    });

    render$({ x: 1 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(0);

    render$({ x: 1 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(0);

    render$({ x: 2 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(1);

    render$({ x: 3 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(2);

    render$({ x: 3 });
    jest.runAllTimers();
    expect(dropFn).toHaveBeenCalledTimes(2);
  });
});
