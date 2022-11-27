/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { createComponent } from '../component';
import { useLayoutEffect } from './use-layout-effect';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-layout-effect]', () => {
  test('use-layout-effect fires on mount event correctly', () => {
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

  test('use-layout-effect works correctly with deps', () => {
    const mockFn = jest.fn();
    const App = createComponent<{ x: number }>(({ x }) => {
      useLayoutEffect(() => mockFn(), [x]);

      return null;
    });

    render(App({ x: 1 }), host);
    expect(mockFn).toBeCalledTimes(1);

    render(App({ x: 1 }), host);
    expect(mockFn).toBeCalledTimes(1);

    render(App({ x: 2 }), host);
    expect(mockFn).toBeCalledTimes(2);
  });

  test('use-layout-effect fires on every render without deps', () => {
    const mockFn = jest.fn();
    const App = createComponent(() => {
      useLayoutEffect(() => mockFn());

      return null;
    });

    render(App(), host);
    expect(mockFn).toBeCalledTimes(1);

    render(App(), host);
    expect(mockFn).toBeCalledTimes(2);

    render(App(), host);
    expect(mockFn).toBeCalledTimes(3);
  });

  test('use-layout-effect drops effect on unmount event correctly', () => {
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
});
