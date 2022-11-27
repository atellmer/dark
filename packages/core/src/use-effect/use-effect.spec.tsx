/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useEffect } from './use-effect';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-effect]', () => {
  test('use-effect fires on mount event correctly', () => {
    const mockFn = jest.fn();
    const App = createComponent(() => {
      useEffect(() => mockFn(), []);

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(1);
    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(1);
  });

  test('use-effect works correctly with deps', () => {
    const mockFn = jest.fn();
    const App = createComponent<{ x: number }>(({ x }) => {
      useEffect(() => mockFn(), [x]);

      return null;
    });

    render(App({ x: 1 }), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(1);
    render(App({ x: 1 }), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(1);
    render(App({ x: 2 }), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(2);
  });

  test('use-effect fires on every render without deps', () => {
    const mockFn = jest.fn();
    const App = createComponent(() => {
      useEffect(() => mockFn());

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(1);
    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(2);
    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(3);
  });

  test('use-effect drops effect on unmount event correctly', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();
    const App = createComponent(() => {
      useEffect(() => {
        effectFn();
        return () => dropFn();
      }, []);

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render(null, host);
    jest.runAllTimers();
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(1);

    render(App(), host);
    jest.runAllTimers();
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);
  });
});
