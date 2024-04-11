import { createRoot } from '@dark-engine/platform-browser';

import { component } from '../component';
import { useInsertionEffect } from '../use-insertion-effect';
import { useLayoutEffect } from '../use-layout-effect';
import { useEffect } from '../use-effect';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/unmount', () => {
  test('clears all effects correctly', () => {
    const dropFn = jest.fn();

    const Child = component(() => {
      useInsertionEffect(() => {
        return () => dropFn();
      }, []);

      useLayoutEffect(() => {
        return () => dropFn();
      }, []);

      useEffect(() => {
        return () => dropFn();
      }, []);

      return null;
    });

    const App = component(() => {
      useInsertionEffect(() => {
        return () => dropFn();
      }, []);

      useLayoutEffect(() => {
        return () => dropFn();
      }, []);

      useEffect(() => {
        return () => dropFn();
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
    expect(dropFn).toBeCalledTimes(12);
  });
});
