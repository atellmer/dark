/** @jsx h */
import { h, component, useInsertionEffect, useLayoutEffect, useEffect } from '@dark-engine/core';

import { createRoot } from './create-root';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[@platform-browser/create-root]', () => {
  test('has methods', () => {
    const App = component(() => null);
    const root = createRoot(host);

    root.render(App());
    expect(root.render).toBeInstanceOf(Function);
    expect(root.unmount).toBeInstanceOf(Function);
    root.unmount();
  });

  test('unmount clears all effects and unmounts root node correctly', () => {
    const spy = jest.fn();
    const Child = component(() => {
      useInsertionEffect(() => {
        return () => spy();
      }, []);

      useLayoutEffect(() => {
        return () => spy();
      }, []);

      useEffect(() => {
        return () => spy();
      }, []);

      return <div>child</div>;
    });
    const App = component(() => {
      useInsertionEffect(() => {
        return () => spy();
      }, []);

      useLayoutEffect(() => {
        return () => spy();
      }, []);

      useEffect(() => {
        return () => spy();
      }, []);

      return (
        <div>
          <Child />
          <Child />
          <Child />
        </div>
      );
    });

    const root = createRoot(host);

    root.render(App());
    jest.runAllTimers();
    root.unmount();
    expect(spy).toBeCalledTimes(12);
    expect(host.innerHTML).toBe('');
    expect(root.unmount).not.toThrowError();
  });
});
