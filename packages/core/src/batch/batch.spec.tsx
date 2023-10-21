/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { component } from '../component';
import { useEffect } from '../use-effect';
import { useUpdate } from '../use-update';
import { useState } from '../use-state';
import { batch } from './batch';

let host: HTMLElement = null;

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  host = document.createElement('div');
});

afterAll(() => {
  jest.useRealTimers();
});

describe('[batch]', () => {
  test('component renders many times after several updates without batch', () => {
    const spy = jest.fn();
    const App = component(() => {
      const update = useUpdate();

      useEffect(() => {
        update();
        update();
        update();
      }, []);

      spy();

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(4);
  });

  test('component renders one time after batch', () => {
    const spy = jest.fn();
    const App = component(() => {
      const update = useUpdate();

      useEffect(() => {
        batch(() => {
          update();
          update();
          update();
        });
      }, []);

      spy();

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('cumulates changes of an internal state correctly', () => {
    let x$ = 0;
    let y$ = 0;
    const spy = jest.fn();
    const App = component(() => {
      const [x, setX] = useState(0);
      const [y, setY] = useState(0);

      x$ = x;
      y$ = y;

      useEffect(() => {
        batch(() => {
          setX(1);
          setY(2);
          setX(x => x + 1);
          setY(x => x + 1);
        });
      }, []);

      spy();

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(x$).toBe(2);
    expect(y$).toBe(3);
  });

  test('forces updates even if the state has not changed', () => {
    let x$ = 0;
    let y$ = 0;
    const spy = jest.fn();
    const App = component(() => {
      const [x, setX] = useState(0);
      const [y, setY] = useState(0);

      x$ = x;
      y$ = y;

      useEffect(() => {
        batch(() => {
          setX(1);
          setY(0);
        });
      }, []);

      spy();

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(x$).toBe(1);
    expect(y$).toBe(0);
  });
});
