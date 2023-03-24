/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { h } from '../element';
import { component } from '../component';
import { useUpdate } from '../use-update';
import { useLayoutEffect } from '../use-layout-effect';
import { useEffect } from '../use-effect';
import { useInsertionEffect } from './use-insertion-effect';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-insertion-effect]', () => {
  test('runs sync', () => {
    const effectFn = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => effectFn(), []);

      return null;
    });

    render(App(), host);
    expect(effectFn).toBeCalledTimes(1);
  });

  test('fires on mount event', () => {
    const mockFn = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useInsertionEffect(() => mockFn(), []);

      return null;
    });

    render$();
    expect(mockFn).toBeCalledTimes(1);

    render$();
    expect(mockFn).toBeCalledTimes(1);
  });

  test('works correctly with deps', () => {
    type AppProps = {
      x: number;
    };
    const effectFn = jest.fn();
    const dropFn = jest.fn();

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const App = component<AppProps>(({ x }) => {
      useInsertionEffect(() => {
        effectFn();
        return () => dropFn();
      }, [x]);

      return null;
    });

    render$({ x: 1 });
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render$({ x: 1 });
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render$({ x: 2 });
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);

    render$({ x: 3 });
    expect(effectFn).toBeCalledTimes(3);
    expect(dropFn).toBeCalledTimes(2);
  });

  test('fires on every render without deps', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useInsertionEffect(() => {
        effectFn();
        return () => dropFn();
      });

      return null;
    });

    render$();
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render$();
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);

    render$();
    expect(effectFn).toBeCalledTimes(3);
    expect(dropFn).toBeCalledTimes(2);
  });

  test('drops effect on unmount event', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();
    const App = component(() => {
      useInsertionEffect(() => {
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

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useInsertionEffect(() => {
        effectFn1();
        return () => dropFn1();
      });
      useInsertionEffect(() => {
        effectFn2();
        return () => dropFn2();
      });

      return null;
    });

    render$();
    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    expect(dropFn1).toBeCalledTimes(0);
    expect(dropFn2).toBeCalledTimes(0);

    render$();
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
    expect(dropFn1).toBeCalledTimes(1);
    expect(dropFn2).toBeCalledTimes(1);

    render$();
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

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const Child = component(() => {
      useInsertionEffect(() => {
        effectFn2();
        return () => dropFn2();
      });

      return null;
    });

    const App = component(() => {
      useInsertionEffect(() => {
        effectFn1();
        return () => dropFn1();
      });

      return <Child />;
    });

    render$();
    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    expect(dropFn1).toBeCalledTimes(0);
    expect(dropFn2).toBeCalledTimes(0);
    expect(effectFn1.mock.invocationCallOrder[0]).toBeLessThan(effectFn2.mock.invocationCallOrder[0]);

    render$();
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
    expect(dropFn1).toBeCalledTimes(1);
    expect(dropFn2).toBeCalledTimes(1);
    expect(effectFn1.mock.invocationCallOrder[1]).toBeLessThan(effectFn2.mock.invocationCallOrder[1]);
    expect(dropFn1.mock.invocationCallOrder[0]).toBeLessThan(dropFn2.mock.invocationCallOrder[0]);

    render$();
    expect(effectFn1).toBeCalledTimes(3);
    expect(effectFn2).toBeCalledTimes(3);
    expect(dropFn1).toBeCalledTimes(2);
    expect(dropFn2).toBeCalledTimes(2);
    expect(effectFn1.mock.invocationCallOrder[2]).toBeLessThan(effectFn2.mock.invocationCallOrder[2]);
    expect(dropFn1.mock.invocationCallOrder[1]).toBeLessThan(dropFn2.mock.invocationCallOrder[1]);
  });

  test('runs before useLayoutEffect and useEffect', () => {
    const effectFn1 = jest.fn();
    const effectFn2 = jest.fn();
    const effectFn3 = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useEffect(() => {
        effectFn3();
      });

      useLayoutEffect(() => {
        effectFn2();
      });

      useInsertionEffect(() => {
        effectFn1();
      });

      return null;
    });

    render$();
    jest.runAllTimers();
    expect(effectFn1.mock.invocationCallOrder[0]).toBeLessThan(effectFn2.mock.invocationCallOrder[0]);
    expect(effectFn2.mock.invocationCallOrder[0]).toBeLessThan(effectFn3.mock.invocationCallOrder[0]);

    render$();
    jest.runAllTimers();
    expect(effectFn1.mock.invocationCallOrder[1]).toBeLessThan(effectFn2.mock.invocationCallOrder[1]);
    expect(effectFn2.mock.invocationCallOrder[1]).toBeLessThan(effectFn3.mock.invocationCallOrder[1]);
  });

  test('drop effects call in order of placement when render regardless of type', () => {
    const dropFn1 = jest.fn();
    const dropFn2 = jest.fn();
    const dropFn3 = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useEffect(() => {
        return () => dropFn3();
      });

      useLayoutEffect(() => {
        return () => dropFn2();
      });

      useInsertionEffect(() => {
        return () => dropFn1();
      });

      return null;
    });

    render$();
    jest.runAllTimers();
    render$();
    jest.runAllTimers();
    expect(dropFn1.mock.invocationCallOrder[0]).toBeGreaterThan(dropFn2.mock.invocationCallOrder[0]);
    expect(dropFn2.mock.invocationCallOrder[0]).toBeGreaterThan(dropFn3.mock.invocationCallOrder[0]);

    render$();
    jest.runAllTimers();
    expect(dropFn1.mock.invocationCallOrder[1]).toBeGreaterThan(dropFn2.mock.invocationCallOrder[1]);
    expect(dropFn2.mock.invocationCallOrder[1]).toBeGreaterThan(dropFn3.mock.invocationCallOrder[1]);
  });

  test('drop effects call in order of type when unmount', () => {
    const dropFn1 = jest.fn();
    const dropFn2 = jest.fn();
    const dropFn3 = jest.fn();

    const App = component(() => {
      useEffect(() => {
        return () => dropFn3();
      }, []);

      useLayoutEffect(() => {
        return () => dropFn2();
      }, []);

      useInsertionEffect(() => {
        return () => dropFn1();
      }, []);

      return null;
    });

    render(App(), host);
    jest.runAllTimers();

    render(null, host);
    jest.runAllTimers();
    expect(dropFn1.mock.invocationCallOrder[0]).toBeLessThan(dropFn2.mock.invocationCallOrder[0]);
    expect(dropFn2.mock.invocationCallOrder[0]).toBeLessThan(dropFn3.mock.invocationCallOrder[0]);
  });

  test('can not call render #1', () => {
    const mockFn = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useInsertionEffect(() => {
        render$();
      }, []);

      mockFn();

      return null;
    });

    render$();
    expect(mockFn).toBeCalledTimes(1);
  });

  test('can not call render #2', () => {
    const mockFn = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      const update = useUpdate();

      useInsertionEffect(() => {
        update();
      }, []);

      mockFn();

      return null;
    });

    render$();
    expect(mockFn).toBeCalledTimes(1);
  });
});
