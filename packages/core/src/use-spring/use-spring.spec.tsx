/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { waitNextTick } from '@test-utils';
import { component } from '../component';
import { useSpring } from './use-spring';
import { useState } from '../use-state';
import { platform } from '../platform';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
  jest.spyOn(platform, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback): number => {
    return setTimeout(() => cb(0));
  });
});

describe('[use-spring]', () => {
  test('can make updates with spring values', () => {
    const mockFn = jest.fn();
    let x: number;
    const forward: Array<number> = [];
    const backward: Array<number> = [];
    const mirrored: Array<number> = [];
    let state: boolean = null;
    let setState: (value: boolean) => void = null;
    const App = component(() => {
      [state, setState] = useState(false);
      const {
        values: [x1],
      } = useSpring(
        {
          state,
          getAnimations: ({ state }) => {
            return [
              {
                name: 'test',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
                direction: state ? 'forward' : state === null ? 'mirrored' : 'backward',
              },
            ];
          },
        },
        [],
      );

      x = x1;

      if (state === true) {
        forward.push(x1);
      } else if (state === false) {
        backward.push(x1);
      } else {
        mirrored.push(x1);
      }

      mockFn();

      return null;
    });

    const FORWARD = [
      0, 0, 0.0016, 0.004, 0.0071, 0.011, 0.0156, 0.0209, 0.0269, 0.0337, 0.0411, 0.0492, 0.0579, 0.0673, 0.0773,
      0.0879, 0.0991, 0.1109, 0.1233, 0.1362, 0.1497, 0.1637, 0.1782, 0.1933, 0.2088, 0.2249, 0.2414, 0.2583, 0.2758,
      0.2936, 0.3119, 0.3306, 0.3496, 0.3691, 0.389, 0.4092, 0.4297, 0.4506, 0.4718, 0.4934, 0.5152, 0.5374, 0.5598,
      0.5825, 0.6055, 0.6287, 0.6521, 0.6758, 0.6997, 0.7238, 0.7481, 0.7726, 0.7973, 0.8221, 0.8471, 0.8723, 0.8976,
      0.923, 0.9486, 0.9742, 1,
    ];

    const BACKWARD = [
      0, 1, 1, 0.9984, 0.996, 0.9929, 0.989, 0.9844, 0.9791, 0.9731, 0.9663, 0.9589, 0.9508, 0.9421, 0.9327, 0.9227,
      0.9121, 0.9009, 0.8891, 0.8767, 0.8638, 0.8503, 0.8363, 0.8218, 0.8067, 0.7912, 0.7751, 0.7586, 0.7417, 0.7242,
      0.7064, 0.6881, 0.6694, 0.6504, 0.6309, 0.611, 0.5908, 0.5703, 0.5494, 0.5282, 0.5066, 0.4848, 0.4626, 0.4402,
      0.4175, 0.3945, 0.3713, 0.3479, 0.3242, 0.3003, 0.2762, 0.2519, 0.2274, 0.2027, 0.1779, 0.1529, 0.1277, 0.1024,
      0.077, 0.0514, 0.0258, 0,
    ];

    const MIRRORED = [
      0, 1, 0.9742, 0.9486, 0.923, 0.8976, 0.8723, 0.8471, 0.8221, 0.7973, 0.7726, 0.7481, 0.7238, 0.6997, 0.6758,
      0.6521, 0.6287, 0.6055, 0.5825, 0.5598, 0.5374, 0.5152, 0.4934, 0.4718, 0.4506, 0.4297, 0.4092, 0.389, 0.3691,
      0.3496, 0.3306, 0.3119, 0.2936, 0.2758, 0.2583, 0.2414, 0.2249, 0.2088, 0.1933, 0.1782, 0.1637, 0.1497, 0.1362,
      0.1233, 0.1109, 0.0991, 0.0879, 0.0773, 0.0673, 0.0579, 0.0492, 0.0411, 0.0337, 0.0269, 0.0209, 0.0156, 0.011,
      0.0071, 0.004, 0.0016, 0,
    ];

    render(App(), host);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(x).toBe(0);

    setState(true);
    jest.runAllTimers();
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(60);
    expect(x).toBe(1);
    expect(forward).toEqual(FORWARD);

    setState(false);
    jest.runAllTimers();
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(120);
    expect(x).toBe(0);
    expect(backward).toEqual(BACKWARD);

    setState(null);
    jest.runAllTimers();
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(180);
    expect(x).toBe(0);
    expect(mirrored).toEqual(MIRRORED);
  });

  test('can run array of animations', async () => {
    const mockFn = jest.fn();
    let x1: number;
    let x2: number;
    let state: boolean = null;
    let setState: (value: boolean) => void = null;
    const App = component(() => {
      [state, setState] = useState<boolean>(null);
      const {
        values: [x11, x22],
      } = useSpring(
        {
          state,
          getAnimations: () => {
            return [
              {
                name: 'test-1',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
              },
              {
                name: 'test-2',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
              },
            ];
          },
        },
        [],
      );

      x1 = x11;
      x2 = x22;

      mockFn();

      return null;
    });

    render(App(), host);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(x1).toBe(0);
    expect(x2).toBe(0);

    setState(true);
    jest.runAllTimers();
    expect(x1).toBe(1);
    expect(x2).toBe(0);
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(60);

    await waitNextTick();
    jest.runAllTimers();
    expect(x1).toBe(1);
    expect(x2).toBe(1);
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(120);

    setState(false);
    jest.runAllTimers();
    expect(x1).toBe(1);
    expect(x2).toBe(0);
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(180);

    await waitNextTick();
    jest.runAllTimers();
    expect(x1).toBe(0);
    expect(x2).toBe(0);
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(240);
  });

  test('can run outside', () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    let x: number;
    let state: boolean = null;
    let setState: (value: boolean) => void = null;
    const App = component(() => {
      [state, setState] = useState<boolean>(null);
      useSpring(
        {
          state,
          outside: ([x1]) => {
            x = x1;
          },
          getAnimations: () => {
            return [
              {
                name: 'test',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
              },
            ];
          },
        },
        [],
      );

      mockFn();

      return null;
    });

    render(App(), host);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(x).toBe(undefined);

    setState(true);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(x).toBe(1);

    setState(false);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(x).toBe(0);
  });

  test('can update animations when deps changed', () => {
    const mockFn = jest.fn();
    let state: boolean = null;
    let setState: (value: boolean) => void = null;

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      [state, setState] = useState(false);
      useSpring(
        {
          state,
          getAnimations: () => {
            mockFn();
            return [
              {
                name: 'test',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
              },
            ];
          },
        },
        [state],
      );

      return null;
    });

    render$();
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(3);

    render$();
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(3);

    setState(true);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(6);

    setState(false);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(9);
  });

  test('can rerun animations when deps changed', () => {
    const mockFn = jest.fn();
    let count: number = null;
    let setCount: (value: number) => void = null;

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      [count, setCount] = useState(0);
      useSpring(
        {
          state: null,
          deps: [count],
          getAnimations: () => {
            return [
              {
                name: 'test',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
              },
            ];
          },
        },
        [],
      );

      mockFn();

      return null;
    });

    render$();
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(1);

    render$();
    jest.runAllTimers();
    expect(mockFn).toBeCalledTimes(2);

    setCount(1);
    jest.runAllTimers();
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(60);
  });

  test('can run animations on mount event', () => {
    const mockFn = jest.fn();

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useSpring(
        {
          state: true,
          mount: true,
          getAnimations: () => {
            return [
              {
                name: 'test',
                mass: 1,
                stiffness: 1,
                damping: 1,
                duration: 1000,
              },
            ];
          },
        },
        [],
      );

      mockFn();

      return null;
    });

    render$();
    jest.runAllTimers();
    expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(60);
  });
});
