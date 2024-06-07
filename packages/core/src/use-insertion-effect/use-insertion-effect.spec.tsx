import { createBrowserEnv } from '@test-utils';

import { component } from '../component';
import { useUpdate } from '../use-update';
import { useLayoutEffect } from '../use-layout-effect';
import { useEffect } from '../use-effect';
import { useInsertionEffect } from './use-insertion-effect';

let { render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ render } = createBrowserEnv());
});

describe('@core/use-insertion-effect', () => {
  test('runs sync', () => {
    const effectFn = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => effectFn(), []);

      return null;
    });

    render(<App />);
    expect(effectFn).toBeCalledTimes(1);
  });

  test('fires on mount event', () => {
    const spy = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => spy(), []);

      return null;
    });

    render(<App />);
    expect(spy).toBeCalledTimes(1);

    render(<App />);
    expect(spy).toBeCalledTimes(1);
  });

  test('works correctly with deps', () => {
    const effectSpy = jest.fn();
    const dropSpy = jest.fn();
    const App = component<{ x: number }>(({ x }) => {
      useInsertionEffect(() => {
        effectSpy();
        return () => dropSpy();
      }, [x]);

      return null;
    });

    render(<App x={1} />);
    expect(effectSpy).toBeCalledTimes(1);
    expect(dropSpy).toBeCalledTimes(0);

    render(<App x={1} />);
    expect(effectSpy).toBeCalledTimes(1);
    expect(dropSpy).toBeCalledTimes(0);

    render(<App x={2} />);
    expect(effectSpy).toBeCalledTimes(2);
    expect(dropSpy).toBeCalledTimes(1);

    render(<App x={3} />);
    expect(effectSpy).toBeCalledTimes(3);
    expect(dropSpy).toBeCalledTimes(2);
  });

  test('fires on every render without deps', () => {
    const effectSpy = jest.fn();
    const dropSpy = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => {
        effectSpy();
        return () => dropSpy();
      });

      return null;
    });

    render(<App />);
    expect(effectSpy).toBeCalledTimes(1);
    expect(dropSpy).toBeCalledTimes(0);

    render(<App />);
    expect(effectSpy).toBeCalledTimes(2);
    expect(dropSpy).toBeCalledTimes(1);

    render(<App />);
    expect(effectSpy).toBeCalledTimes(3);
    expect(dropSpy).toBeCalledTimes(2);
  });

  test('drops effect on unmount event', () => {
    const effectSpy = jest.fn();
    const dropSpy = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => {
        effectSpy();
        return () => dropSpy();
      }, []);

      return null;
    });

    render(<App />);
    expect(effectSpy).toBeCalledTimes(1);
    expect(dropSpy).toBeCalledTimes(0);

    render(null);
    expect(effectSpy).toBeCalledTimes(1);
    expect(dropSpy).toBeCalledTimes(1);

    render(<App />);
    expect(effectSpy).toBeCalledTimes(2);
    expect(dropSpy).toBeCalledTimes(1);
  });

  test('can trigger many effects', () => {
    const effectSpy1 = jest.fn();
    const dropSpy1 = jest.fn();
    const effectSpy2 = jest.fn();
    const dropSpy2 = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => {
        effectSpy1();
        return () => dropSpy1();
      });
      useInsertionEffect(() => {
        effectSpy2();
        return () => dropSpy2();
      });

      return null;
    });

    render(<App />);
    expect(effectSpy1).toBeCalledTimes(1);
    expect(effectSpy2).toBeCalledTimes(1);
    expect(dropSpy1).toBeCalledTimes(0);
    expect(dropSpy2).toBeCalledTimes(0);

    render(<App />);
    expect(effectSpy1).toBeCalledTimes(2);
    expect(effectSpy2).toBeCalledTimes(2);
    expect(dropSpy1).toBeCalledTimes(1);
    expect(dropSpy2).toBeCalledTimes(1);

    render(<App />);
    expect(effectSpy1).toBeCalledTimes(3);
    expect(effectSpy2).toBeCalledTimes(3);
    expect(dropSpy1).toBeCalledTimes(2);
    expect(dropSpy2).toBeCalledTimes(2);
  });

  test('can work with nested components correctly', () => {
    const effectSpy = jest.fn();
    const dropSpy = jest.fn();
    const Child = component(() => {
      useInsertionEffect(() => {
        effectSpy(2);
        return () => dropSpy(2);
      });

      return null;
    });

    const App = component(() => {
      useInsertionEffect(() => {
        effectSpy(1);
        return () => dropSpy(1);
      });

      return <Child />;
    });

    render(<App />);
    expect(effectSpy).toBeCalledTimes(2);
    expect(dropSpy).toBeCalledTimes(0);
    expect(effectSpy.mock.calls).toEqual([[1], [2]]);
    effectSpy.mockClear();
    dropSpy.mockClear();

    render(<App />);
    expect(effectSpy).toBeCalledTimes(2);
    expect(dropSpy).toBeCalledTimes(2);
    expect(effectSpy.mock.calls).toEqual([[1], [2]]);
    effectSpy.mockClear();
    dropSpy.mockClear();

    render(<App />);
    expect(effectSpy).toBeCalledTimes(2);
    expect(dropSpy).toBeCalledTimes(2);
    expect(effectSpy.mock.calls).toEqual([[1], [2]]);
  });

  test('runs before useLayoutEffect and useEffect', () => {
    const spy = jest.fn();
    const App = component(() => {
      useEffect(() => {
        spy(1);
      });

      useLayoutEffect(() => {
        spy(2);
      });

      useInsertionEffect(() => {
        spy(3);
      });

      return null;
    });

    render(<App />);
    jest.runAllTimers();
    expect(spy.mock.calls).toEqual([[3], [2], [1]]);
    spy.mockClear();

    render(<App />);
    jest.runAllTimers();
    expect(spy.mock.calls).toEqual([[3], [2], [1]]);
  });

  test('drop effects call in order of placement when render regardless of type', () => {
    const spy = jest.fn();
    const App = component(() => {
      useEffect(() => {
        return () => spy(1);
      });

      useLayoutEffect(() => {
        return () => spy(2);
      });

      useInsertionEffect(() => {
        return () => spy(3);
      });

      return null;
    });

    render(<App />);
    jest.runAllTimers();
    render(<App />);
    jest.runAllTimers();

    expect(spy.mock.calls).toEqual([[1], [2], [3]]);
    spy.mockClear();

    render(<App />);
    jest.runAllTimers();
    expect(spy.mock.calls).toEqual([[1], [2], [3]]);
  });

  test('drop effects call in order of type when unmount', () => {
    const spy = jest.fn();
    const App = component(() => {
      useEffect(() => {
        return () => spy(1);
      }, []);

      useLayoutEffect(() => {
        return () => spy(2);
      }, []);

      useInsertionEffect(() => {
        return () => spy(3);
      }, []);

      return null;
    });

    render(<App />);
    jest.runAllTimers();

    render(null);
    jest.runAllTimers();
    expect(spy.mock.calls).toEqual([[1], [2], [3]]);
  });

  test('can not call render #1', () => {
    const spy = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => {
        render(<App />);
      }, []);

      spy();

      return null;
    });

    render(<App />);
    expect(spy).toBeCalledTimes(1);
  });

  test('can not call render #2', () => {
    const spy = jest.fn();
    const App = component(() => {
      const update = useUpdate();

      useInsertionEffect(() => {
        update();
      }, []);

      spy();

      return null;
    });

    render(<App />);
    expect(spy).toBeCalledTimes(1);
  });
});
