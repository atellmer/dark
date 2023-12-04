/** @jsx h */
import { h, component, useState, useLayoutEffect, detectIsArray, scheduler } from '@dark-engine/core';
import { renderToString } from '@dark-engine/platform-server';
import { dom, createEnv, mockPlatformRaf, getSpyLength, time, replacer } from '@test-utils';

import { type SpringValue } from '../shared';
import { Animated } from '../animated';
import { Spring } from '../spring';
import { range } from '../utils';
import { type SpringApi, useSprings } from './use-springs';

let { host, render } = createEnv();

beforeEach(() => {
  jest.useFakeTimers();
  scheduler.setupPorts();
  ({ host, render } = createEnv());
  mockPlatformRaf();
});

afterEach(() => {
  scheduler.unrefPorts();
});

describe('[@animations/use-springs]', () => {
  test('returns the springs and the api', () => {
    type SpringProps = 'scale';
    let springs: Array<Spring<SpringProps>> = null;
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [_springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      springs = _springs;
      api = _api;

      return null;
    });

    render(<App />);
    expect(springs).toBeDefined();
    expect(detectIsArray(springs)).toBeTruthy();
    expect(springs[0]).toBeInstanceOf(Spring);
    expect(springs[0].value()).toEqual({ scale: 0 });
    expect(api).toBeDefined();
    expect(api.start).toBeDefined();
    expect(api.pause).toBeDefined();
    expect(api.reset).toBeDefined();
    expect(api.resume).toBeDefined();
    expect(api.cancel).toBeDefined();
    expect(api.chain).toBeDefined();
    expect(api.delay).toBeDefined();
    expect(api.on).toBeDefined();
  });

  test('can animate the simple value via api', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.2692 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6093 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
  });

  test('can animate the value without render', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});"></div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const renderSpy = jest.fn();
    const styleSpy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;
      renderSpy();

      return (
        <Animated spring={springs[0]} fn={styleFn}>
          <div />
        </Animated>
      );
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      styleSpy(element, value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(styleSpy).toHaveBeenCalledTimes(1);
    renderSpy.mockClear();
    styleSpy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(renderSpy).toHaveBeenCalledTimes(0);
    expect(styleSpy).toHaveBeenCalledTimes(51);
  });

  test('can animate the complex value via api', () => {
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'scale' | 'opacity';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0, opacity: 0 },
        to: { scale: 2, opacity: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2, 1));
    expect(spy).toHaveBeenCalledTimes(56);
    expect(spy).toHaveBeenCalledWith({ scale: 0.3768, opacity: 0.1884 });
    expect(spy).toHaveBeenCalledWith({ scale: 1.7782, opacity: 0.8891 });
    expect(spy).toHaveBeenCalledWith({ scale: 1.9701, opacity: 0.985 });
    expect(spy).toHaveBeenCalledWith({ scale: 2, opacity: 1 });
  });

  test('can animate the simple value via state', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [springs] = useSprings<SpringProps>(
        1,
        () => ({
          from: { scale: 0 },
          to: { scale: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      setIsOpen = _setIsOpen;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6589 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
    spy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.9565 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5087 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.0543 });
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5535 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.9964 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
  });

  test('can animate the complex value via state', () => {
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'scale' | 'opacity';
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [springs] = useSprings<SpringProps>(
        1,
        () => ({
          from: { scale: 0, opacity: 0 },
          to: { scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      setIsOpen = _setIsOpen;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();

    expect(host.innerHTML).toBe(content(1, 1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106, opacity: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6589, opacity: 0.6589 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721, opacity: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1, opacity: 1 });
    spy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0, 0));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.9565, opacity: 0.9565 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5087, opacity: 0.5087 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.0543, opacity: 0.0543 });
    expect(spy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1, 1));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106, opacity: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5535, opacity: 0.5535 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.9964, opacity: 0.9964 });
    expect(spy).toHaveBeenCalledWith({ scale: 1, opacity: 1 });
  });

  test('can animate the value without the initial "to" parameter', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start(() => ({ to: { scale: 1 } }));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.2692 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6093 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
    spy.mockClear();

    api.start(() => ({ to: { scale: 0.5 } }));
    jest.runAllTimers();

    expect(host.innerHTML).toBe(content(0.5));
    expect(spy).toHaveBeenCalledTimes(47);
    expect(spy).toHaveBeenCalledWith({ scale: 0.5 });
  });

  test('can use a custom spring config', () => {
    const content = (x: number) => dom`
      <div style="transform: translate3d(${x}px, 0, 0);">A</div>
    `;
    type SpringProps = 'x';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { x: 0 },
        to: { x: 50 },
        config: () => ({ mass: 5, tension: 1000, friction: 20, fix: 0 }),
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `translate3d(${value.x}px, 0, 0)`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(50));
    expect(spy).toHaveBeenCalledTimes(186);
    expect(spy).toHaveBeenCalledWith({ x: 3 });
    expect(spy).toHaveBeenCalledWith({ x: 22 });
    expect(spy).toHaveBeenCalledWith({ x: 41 });
    expect(spy).toHaveBeenCalledWith({ x: 50 });
  });

  test('can use a different spring config', () => {
    const content = (x: number, y: number) => dom`
      <div style="transform: translate3d(${x}px, ${y}px, 0);">A</div>
    `;
    type SpringProps = 'x' | 'y';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { x: 0, y: 0 },
        to: { x: 50, y: 50 },
        config: key => ({ mass: 5, tension: key === 'x' ? 1000 : 2000, friction: 20, fix: 0 }),
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `translate3d(${value.x}px, ${value.y}px, 0)`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(50, 50));
    expect(spy).toHaveBeenCalledTimes(227);
    expect(spy).toHaveBeenCalledWith({ x: 3, y: 5 });
    expect(spy).toHaveBeenCalledWith({ x: 22, y: 41 });
    expect(spy).toHaveBeenCalledWith({ x: 41, y: 68 });
    expect(spy).toHaveBeenCalledWith({ x: 50, y: 50 });
  });

  test('can animate the value via api with many controllers #1', () => {
    const count = 4;
    const content = (scale: number) =>
      range(count)
        .map(
          (_, idx) => dom`
            <div style="transform: scale(${scale});">${idx}</div>
          `,
        )
        .join('');
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(count, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1 * count);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51 * count);
  });

  test('can animate the value via api with many controllers #2', () => {
    let count = 4;
    const content = (scale: number) =>
      range(count)
        .map(
          (_, idx) => dom`
            <div style="transform: scale(${scale});">${idx}</div>
          `,
        )
        .join('');
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(count, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1 * count);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51 * count);
    spy.mockClear();

    count += 2;
    render(<App />);
    api.start(() => ({ to: { scale: 0 } }));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(216);
    spy.mockClear();

    count -= 1;
    render(<App />);
    api.start(() => ({ to: { scale: 2 } }));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2));
    expect(spy).toHaveBeenCalledTimes(290);
  });

  test('passes the index to the configurator', () => {
    const count = 4;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(count, idx => {
        spy(idx);
        return {
          from: { scale: 0 },
          to: { scale: 1 },
        };
      });

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    api.start();
    jest.runAllTimers();

    range(count).forEach((_, idx) => expect(spy).toHaveBeenCalledWith(idx));
  });

  test(`doesn't throw an exception without Animated`, () => {
    const make = () => {
      const count = 4;
      let api: SpringApi = null;
      const App = component(() => {
        const [_, _api] = useSprings(count, () => ({
          from: { scale: 0 },
          to: { scale: 1 },
        }));

        api = _api;

        return null;
      });

      render(<App />);
      api.start();
      jest.runAllTimers();
    };

    expect(make).not.toThrow();
  });

  test('can pause the animation correctly', () => {
    let api: SpringApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    api.start();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBeGreaterThan(0);

    const length = getSpyLength(spy);

    api.pause();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBe(length);

    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBe(length);
  });

  test('can resume the animation after pause correctly', () => {
    let api: SpringApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    api.start();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBeGreaterThan(0);

    const length = getSpyLength(spy);

    api.pause();
    jest.advanceTimersByTime(20);
    api.resume();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBeGreaterThan(length);
  });

  test('can delay the animation correctly', () => {
    let api: SpringApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    spy.mockClear();
    api.delay(50);
    api.start();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBe(0);

    jest.advanceTimersByTime(100);
    expect(getSpyLength(spy)).toBeGreaterThan(0);
  });

  test('can reset the animation correctly', () => {
    let api: SpringApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    api.start();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledWith({ scale: 1 });

    api.reset();
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
  });

  test('can cancel the animation correctly', () => {
    let api: SpringApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    api.delay(20);
    api.start();
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spy)).toBeGreaterThan(0);

    const length = getSpyLength(spy);

    api.cancel();
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spy)).toBe(length);
  });

  test('can subscribe on events correctly', () => {
    let api: SpringApi = null;
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    let seriesStartTime = null;
    let itemStartTime = null;
    let itemEndTime = null;
    let seriesEndTime = null;
    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      useLayoutEffect(() => {
        api.on('series-start', () => {
          seriesStartTime = time();
          seriesStartSpy();
        });
        api.on('item-start', () => {
          itemStartTime = time();
          itemStartSpy();
        });
        api.on('item-change', itemChangeSpy);
        api.on('item-end', () => {
          itemEndTime = time();
          itemEndSpy();
        });
        api.on('series-end', () => {
          seriesEndTime = time();
          seriesEndSpy();
        });
      }, []);

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={() => {}}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    jest.runAllTimers();
    api.start();
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(itemStartSpy).toHaveBeenCalledTimes(1);
    expect(itemChangeSpy).toHaveBeenCalledTimes(51);
    expect(itemEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndTime).toBeGreaterThan(seriesStartTime);
    expect(itemEndTime).toBeGreaterThan(itemStartTime);
  });

  test('the "on" method returns the off function', () => {
    let api: SpringApi = null;
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    let seriesStartOff: Function = null;
    let itemStartOff: Function = null;
    let itemChangeOff: Function = null;
    let itemEndOff: Function = null;
    let seriesEndOff: Function = null;

    const App = component(() => {
      const [springs, _api] = useSprings(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      useLayoutEffect(() => {
        seriesStartOff = api.on('series-start', seriesStartSpy);
        itemStartOff = api.on('item-start', itemStartSpy);
        itemChangeOff = api.on('item-change', itemChangeSpy);
        itemEndOff = api.on('item-end', itemEndSpy);
        seriesEndOff = api.on('series-end', seriesEndSpy);
      }, []);

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={() => {}}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    jest.runAllTimers();

    expect(typeof seriesStartOff).toBe('function');
    expect(typeof itemStartOff).toBe('function');
    expect(typeof itemChangeOff).toBe('function');
    expect(typeof itemEndOff).toBe('function');
    expect(typeof seriesEndOff).toBe('function');

    seriesStartOff();
    itemStartOff();
    itemChangeOff();
    itemEndOff();
    seriesEndOff();

    api.start();
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
    expect(itemStartSpy).toHaveBeenCalledTimes(0);
    expect(itemChangeSpy).toHaveBeenCalledTimes(0);
    expect(itemEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
  });

  test('cancels the animation at unmounting correctly', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let springs: Array<Spring<SpringProps>> = null;
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [_springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;
      springs = _springs;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    api.start();
    render(null);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(replacer);
    expect(api.isCanceled()).toBe(true);
  });

  test('supports SSR', async () => {
    const content = (opacity: number) => dom`
      <div style="opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'opacity';
    const App = component(() => {
      const [springs] = useSprings<SpringProps>(1, () => ({
        from: { opacity: 0 },
        to: { opacity: 1 },
      }));

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div style={`opacity: ${spring.prop('opacity')};`}>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    expect(await renderToString(<App />)).toBe(content(0));
    expect(spy).not.toHaveBeenCalled();
  });
});
