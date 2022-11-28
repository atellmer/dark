/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useLayoutEffect } from './use-layout-effect';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-layout-effect]', () => {
  test('fires on mount event', () => {
    const mockFn = jest.fn();
    const App = createComponent(() => {
      useLayoutEffect(() => mockFn(), []);

      return null;
    });

    render(App(), host);
    expect(mockFn).toBeCalledTimes(1);

    render(App(), host);
    expect(mockFn).toBeCalledTimes(1);
  });

  test('works correctly with deps', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();
    const App = createComponent<{ x: number }>(({ x }) => {
      useLayoutEffect(() => {
        effectFn();
        return () => dropFn();
      }, [x]);

      return null;
    });

    render(App({ x: 1 }), host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render(App({ x: 1 }), host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render(App({ x: 2 }), host);
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);

    render(App({ x: 3 }), host);
    expect(effectFn).toBeCalledTimes(3);
    expect(dropFn).toBeCalledTimes(2);
  });

  test('fires on every render without deps', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();
    const App = createComponent(() => {
      useLayoutEffect(() => {
        effectFn();
        return () => dropFn();
      });

      return null;
    });

    render(App(), host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render(App(), host);
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);

    render(App(), host);
    expect(effectFn).toBeCalledTimes(3);
    expect(dropFn).toBeCalledTimes(2);
  });

  test('drops effect on unmount event', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();
    const App = createComponent(() => {
      useLayoutEffect(() => {
        effectFn();
        return () => dropFn();
      }, []);

      return null;
    });

    render(App(), host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render(null, host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(1);

    render(App(), host);
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);
  });

  test('can trigger many effects', () => {
    const effectFn1 = jest.fn();
    const dropFn1 = jest.fn();
    const effectFn2 = jest.fn();
    const dropFn2 = jest.fn();
    const App = createComponent(() => {
      useLayoutEffect(() => {
        effectFn1();
        return () => dropFn1();
      });
      useLayoutEffect(() => {
        effectFn2();
        return () => dropFn2();
      });

      return null;
    });

    render(App(), host);
    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    expect(dropFn1).toBeCalledTimes(0);
    expect(dropFn2).toBeCalledTimes(0);

    render(App(), host);
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
    expect(dropFn1).toBeCalledTimes(1);
    expect(dropFn2).toBeCalledTimes(1);

    render(App(), host);
    expect(effectFn1).toBeCalledTimes(3);
    expect(effectFn2).toBeCalledTimes(3);
    expect(dropFn1).toBeCalledTimes(2);
    expect(dropFn2).toBeCalledTimes(2);
  });

  test('can work with nested components correctly', () => {
    const effectFn1 = jest.fn();
    const dropFn1 = jest.fn();
    const effectFn2 = jest.fn();
    const dropFn2 = jest.fn();

    const Child = createComponent(() => {
      useLayoutEffect(() => {
        effectFn2();
        return () => dropFn2();
      });

      return null;
    });

    const App = createComponent(() => {
      useLayoutEffect(() => {
        effectFn1();
        return () => dropFn1();
      });

      return <Child />;
    });

    render(App(), host);
    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    expect(dropFn1).toBeCalledTimes(0);
    expect(dropFn2).toBeCalledTimes(0);
    expect(effectFn1.mock.invocationCallOrder[0]).toBeLessThan(effectFn2.mock.invocationCallOrder[0]);

    render(App(), host);
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
    expect(dropFn1).toBeCalledTimes(1);
    expect(dropFn2).toBeCalledTimes(1);
    expect(effectFn1.mock.invocationCallOrder[1]).toBeLessThan(effectFn2.mock.invocationCallOrder[1]);
    expect(dropFn1.mock.invocationCallOrder[0]).toBeLessThan(dropFn2.mock.invocationCallOrder[0]);

    render(App(), host);
    expect(effectFn1).toBeCalledTimes(3);
    expect(effectFn2).toBeCalledTimes(3);
    expect(dropFn1).toBeCalledTimes(2);
    expect(dropFn2).toBeCalledTimes(2);
    expect(effectFn1.mock.invocationCallOrder[2]).toBeLessThan(effectFn2.mock.invocationCallOrder[2]);
    expect(dropFn1.mock.invocationCallOrder[1]).toBeLessThan(dropFn2.mock.invocationCallOrder[1]);
  });
});
