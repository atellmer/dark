/** @jsx h */
import { h, component, useState, useLayoutEffect } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';
import { dom, createBrowserEnv, createServerEnv, replacer, time, getSpyLength } from '@test-utils';

import { type SpringValue } from '../shared';
import { Animated } from '../animated';
import { range } from '../utils';
import { type TransitionApi, type TransitionFn, useTransition } from './use-transition';

type Item<T = string | number> = { id: number; data: T };

const generate = (size: number): Array<Item> => range(size).map((_, idx) => ({ id: idx, data: idx }));
let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
});

describe('[@animations/use-transition]', () => {
  test('returns the transition function and the api', () => {
    type SpringProps = 'opacity';
    let transition: TransitionFn<SpringProps, Item> = null;
    let api: TransitionApi<SpringProps> = null;
    const App = component(() => {
      const [_transition, _api] = useTransition<SpringProps, Item>(
        generate(1),
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

      transition = _transition;
      api = _api;

      return null;
    });

    render(<App />);
    expect(typeof transition).toBe('function');
    expect(api).toBeDefined();
    expect(api.start).toBeDefined();
    expect(api.pause).toBeDefined();
    expect(api.resume).toBeDefined();
    expect(api.cancel).toBeDefined();
    expect(api.chain).toBeDefined();
    expect(api.delay).toBeDefined();
    expect(api.on).toBeDefined();
  });

  test('can animate the items', () => {
    const content = (items: Array<Item>, opacity: number) =>
      items
        .map(
          x => dom`
              <div style="opacity: ${opacity};">${x.data}</div>
            `,
        )
        .join('');
    let items: Array<Item> = null;
    type SpringProps = 'opacity';
    type AppProps = { items: Array<Item> };
    const App = component<AppProps>(({ items }) => {
      const [transition] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div>{item.data}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    items = generate(1);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(58);
    expect(spy).toHaveBeenCalledWith({ opacity: 0 });
    expect(spy).toHaveBeenCalledWith({ opacity: 0.1884 });
    expect(spy).toHaveBeenCalledWith({ opacity: 0.7749 });
    expect(spy).toHaveBeenCalledWith({ opacity: 0.9927 });
    expect(spy).toHaveBeenCalledWith({ opacity: 1 });
    expect(host.innerHTML).toBe(content(items, 1));
  });

  test('can animate the dynamic items', () => {
    const content = (items: Array<Item>, scale: number) =>
      items
        .map(
          x => dom`
              <div style="transform: scale(${scale});">${x.data}</div>
            `,
        )
        .join('');
    let items: Array<Item> = null;
    const spies: Record<string, jest.Mock> = {};
    const renderSpy = jest.fn();
    type SpringProps = 'scale';
    type AppProps = { items: Array<Item> };
    const App = component<AppProps>(({ items }) => {
      const [transition] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
          leave: { scale: 0 },
          update: { scale: 2 },
        }),
      );

      renderSpy();

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn(item.id)}>
            <div>{item.data}</div>
          </Animated>
        );
      });
    });

    const styleFn = (id: number) => (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spies[id] && spies[id](value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    const sync = (items: Array<Item>) => {
      items.forEach(x => {
        !spies[x.id] && (spies[x.id] = jest.fn());
      });
      Object.keys(spies).forEach(key => {
        spies[key].mockClear();
      });
    };

    items = generate(1);
    sync(items);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(spies[0]).toHaveBeenCalledTimes(58);
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0 });
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.1884 });
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.7749 });
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.9927 });
    expect(spies[0]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[0]).not.toHaveBeenCalledWith({ scale: 2 });
    expect(host.innerHTML).toBe(content(items, 1));
    renderSpy.mockClear();

    items = generate(3);
    sync(items);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(spies[0]).toHaveBeenCalledTimes(59);
    expect(spies[1]).toHaveBeenCalledTimes(56);
    expect(spies[2]).toHaveBeenCalledTimes(56);
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.1884 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.7749 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.9927 });
    expect(spies[1]).not.toHaveBeenCalledWith({ scale: 2 });
    expect(spies[1]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.1884 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.7749 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.9927 });
    expect(spies[2]).not.toHaveBeenCalledWith({ scale: 2 });
    expect(spies[2]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(host.innerHTML).toBe(content(items, 1));
    renderSpy.mockClear();

    items = [...items.reverse()];
    sync(items);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(host.innerHTML).toBe(content(items, 1));
    expect(spies[0]).toHaveBeenCalledTimes(59);
    expect(spies[1]).toHaveBeenCalledTimes(59);
    expect(spies[2]).toHaveBeenCalledTimes(59);
    expect(spies[0]).toHaveBeenCalledWith({ scale: 2 });
    expect(spies[0]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 2 });
    expect(spies[1]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 2 });
    expect(spies[2]).toHaveBeenLastCalledWith({ scale: 1 });
    renderSpy.mockClear();

    items = [items[1], items[2]];
    sync(items);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(spies[0]).toHaveBeenCalledTimes(59);
    expect(spies[1]).toHaveBeenCalledTimes(59);
    expect(spies[2]).toHaveBeenCalledTimes(55);
    expect(spies[2]).toHaveBeenCalledWith({ scale: 1 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.7308 });
    expect(spies[2]).toHaveBeenLastCalledWith({ scale: 0 });
    expect(host.innerHTML).toBe(content(items, 1));
    renderSpy.mockClear();
    delete spies[2];

    items = [...items];
    sync(items);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(spies[0]).toHaveBeenCalledTimes(57);
    expect(spies[1]).toHaveBeenCalledTimes(57);
    expect(spies[0]).toHaveBeenCalledWith({ scale: 2 });
    expect(spies[0]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 2 });
    expect(spies[1]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(host.innerHTML).toBe(content(items, 1));
    renderSpy.mockClear();

    items = [];
    sync(items);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(spies[0]).toHaveBeenLastCalledWith({ scale: 0 });
    expect(spies[1]).toHaveBeenLastCalledWith({ scale: 0 });
    expect(host.innerHTML).toBe(replacer);
  });

  test('can toggle items', () => {
    const content = (isOpen: boolean) =>
      isOpen
        ? dom`
            <div style="transform: scale(1);"></div>
          `
        : replacer;
    const renderSpy = jest.fn();
    let setIsOpen: (x: boolean) => void = null;
    type SpringProps = 'scale';
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [transition] = useTransition<SpringProps, number>(
        isOpen ? [1] : [],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
          leave: { scale: 0 },
        }),
      );

      setIsOpen = _setIsOpen;
      renderSpy();

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div />
          </Animated>
        );
      });
    });

    const styleSpy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      styleSpy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(styleSpy).toHaveBeenCalledTimes(0);
    expect(host.innerHTML).toBe(content(false));
    renderSpy.mockClear();
    styleSpy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(styleSpy).toHaveBeenCalledTimes(56);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0 });
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0.7412 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 1 });
    expect(host.innerHTML).toBe(content(true));
    renderSpy.mockClear();
    styleSpy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(styleSpy).toHaveBeenCalledTimes(55);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 1 });
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0.8116 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 0 });
    expect(host.innerHTML).toBe(content(false));
  });

  test('can use a custom  spring config', () => {
    const content = (isOpen: boolean) =>
      isOpen
        ? dom`
            <div style="transform: scale(1);"></div>
          `
        : replacer;
    let setIsOpen: (x: boolean) => void = null;
    type SpringProps = 'scale';
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [transition] = useTransition<SpringProps, number>(
        isOpen ? [1] : [],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
          leave: { scale: 0 },
          config: () => ({ mass: 5, tension: 1000, friction: 20 }),
        }),
      );

      setIsOpen = _setIsOpen;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div />
          </Animated>
        );
      });
    });

    const styleSpy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      styleSpy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(0);
    expect(host.innerHTML).toBe(content(false));
    styleSpy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(122);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 1 });
    expect(host.innerHTML).toBe(content(true));
    styleSpy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(121);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 1 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 0 });
    expect(host.innerHTML).toBe(content(false));
  });

  test('can use a different spring config', () => {
    const content = (isOpen: boolean) =>
      isOpen
        ? dom`
            <div style="transform: scale(1); opacity: 1;"></div>
          `
        : replacer;
    let setIsOpen: (x: boolean) => void = null;
    type SpringProps = 'scale' | 'opacity';
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [transition] = useTransition<SpringProps, number>(
        isOpen ? [1] : [],
        x => x,
        () => ({
          from: { scale: 0, opacity: 0 },
          enter: { scale: 1, opacity: 1 },
          leave: { scale: 0, opacity: 0 },
          config: key => ({ mass: 5, tension: key === 'scale' ? 100 : 200, friction: 20 }),
        }),
      );

      setIsOpen = _setIsOpen;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div />
          </Animated>
        );
      });
    });

    const styleSpy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      styleSpy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(0);
    expect(host.innerHTML).toBe(content(false));
    styleSpy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(121);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    expect(styleSpy).toHaveBeenCalledWith({ scale: 1, opacity: 0.8952 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 1, opacity: 1 });
    expect(host.innerHTML).toBe(content(true));
    styleSpy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(120);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 1, opacity: 1 });
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0, opacity: 0.1134 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 0, opacity: 0 });
    expect(host.innerHTML).toBe(content(false));
  });

  test('can set the immediate value', () => {
    const content = (isOpen: boolean) =>
      isOpen
        ? dom`
            <div style="transform: scale(1); z-index: 1;"></div>
          `
        : replacer;
    let setIsOpen: (x: boolean) => void = null;
    type SpringProps = 'scale' | 'zIndex';
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [transition] = useTransition<SpringProps, number>(
        isOpen ? [1] : [],
        x => x,
        () => ({
          from: { scale: 0, zIndex: 0 },
          enter: { scale: 1, zIndex: 1 },
          leave: { scale: 0, zIndex: 0 },
          immediate: key => key === 'zIndex',
        }),
      );

      setIsOpen = _setIsOpen;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div />
          </Animated>
        );
      });
    });

    const styleSpy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      styleSpy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
      element.style.setProperty('z-index', `${value.zIndex}`);
    };

    render(<App />);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(0);
    expect(host.innerHTML).toBe(content(false));
    styleSpy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(56);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0, zIndex: 0 });
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0.0435, zIndex: 1 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 1, zIndex: 1 });
    expect(host.innerHTML).toBe(content(true));
    styleSpy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(styleSpy).toHaveBeenCalledTimes(56);
    expect(styleSpy).toHaveBeenCalledWith({ scale: 1, zIndex: 1 });
    expect(styleSpy).toHaveBeenCalledWith({ scale: 0, zIndex: 1 });
    expect(styleSpy).toHaveBeenLastCalledWith({ scale: 0, zIndex: 0 });
    expect(host.innerHTML).toBe(content(false));
  });

  test('can animate items via api', () => {
    const content = (isOpen: boolean, scale: number) =>
      isOpen
        ? dom`
            <div style="transform: scale(${scale});"></div>
          `
        : replacer;
    type SpringProps = 'scale';
    let api: TransitionApi<SpringProps> = null;
    const App = component(() => {
      const [transition, _api] = useTransition<SpringProps, number>(
        [1],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
          leave: { scale: 0 },
        }),
      );

      api = _api;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div />
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
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(58);
    expect(host.innerHTML).toBe(content(true, 1));
    spy.mockClear();

    api.start(() => ({ to: { scale: 2 } }));
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(51);
    expect(host.innerHTML).toBe(content(true, 2));
  });

  test('can pause the animation correctly', () => {
    type SpringProps = 'scale';
    let api: TransitionApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [transition, _api] = useTransition<SpringProps, number>(
        [1],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
        }),
      );

      api = _api;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    jest.runAllTimers();
    spy.mockClear();
    api.start(() => ({ to: { scale: 2 } }));
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
    type SpringProps = 'scale';
    let api: TransitionApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [transition, _api] = useTransition<SpringProps, number>(
        [1],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
        }),
      );

      api = _api;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    jest.runAllTimers();
    spy.mockClear();
    api.start(() => ({ to: { scale: 2 } }));
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
    type SpringProps = 'scale';
    let api: TransitionApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [transition, _api] = useTransition<SpringProps, number>(
        [1],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
        }),
      );

      api = _api;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    jest.runAllTimers();
    spy.mockClear();
    api.delay(50);
    api.start(() => ({ to: { scale: 2 } }));
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spy)).toBe(0);

    jest.advanceTimersByTime(100);
    expect(getSpyLength(spy)).toBeGreaterThan(0);
  });

  test('can cancel the animation correctly', () => {
    type SpringProps = 'scale';
    let api: TransitionApi = null;
    const spy = jest.fn();
    const App = component(() => {
      const [transition, _api] = useTransition<SpringProps, number>(
        [1],
        x => x,
        () => ({
          from: { scale: 0 },
          enter: { scale: 1 },
        }),
      );

      api = _api;

      return transition(({ spring }) => {
        return (
          <Animated spring={spring} fn={(_, x) => spy(x)}>
            <div />
          </Animated>
        );
      });
    });

    render(<App />);
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spy)).toBeGreaterThan(0);

    const length = getSpyLength(spy);

    api.cancel();
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spy)).toBe(length);
  });

  test('can subscribe on events correctly', () => {
    let items: Array<Item> = null;
    type SpringProps = 'opacity';
    type AppProps = { items: Array<Item> };
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    let seriesStartTime = null;
    let itemStartTime = null;
    let itemEndTime = null;
    let seriesEndTime = null;
    const App = component<AppProps>(({ items }) => {
      const [transition, api] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

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

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div>{item.data}</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    items = generate(1);
    render(<App items={items} />);
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(itemStartSpy).toHaveBeenCalledTimes(1);
    expect(itemChangeSpy).toHaveBeenCalledTimes(52);
    expect(itemEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndTime).toBeGreaterThan(seriesStartTime);
    expect(itemEndTime).toBeGreaterThan(itemStartTime);
  });

  test('the "on" method returns the off function', () => {
    let items: Array<Item> = null;
    type SpringProps = 'opacity';
    type AppProps = { items: Array<Item> };
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
    const App = component<AppProps>(({ items }) => {
      const [transition, api] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

      useLayoutEffect(() => {
        seriesStartOff = api.on('series-start', seriesStartSpy);
        itemStartOff = api.on('item-start', itemStartSpy);
        itemChangeOff = api.on('item-change', itemChangeSpy);
        itemEndOff = api.on('item-end', itemEndSpy);
        seriesEndOff = api.on('series-end', seriesEndSpy);
      }, []);

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div>{item.data}</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    items = generate(1);
    render(<App items={items} />);

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
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
    expect(itemStartSpy).toHaveBeenCalledTimes(0);
    expect(itemChangeSpy).toHaveBeenCalledTimes(0);
    expect(itemEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
  });

  test('cancels the animation at unmounting correctly', () => {
    const content = (items: Array<Item>, opacity: number) =>
      items
        .map(
          x => dom`
              <div style="opacity: ${opacity};">${x.data}</div>
            `,
        )
        .join('');
    let items: Array<Item> = null;
    type SpringProps = 'opacity';
    type AppProps = { items: Array<Item> };
    let api: TransitionApi<SpringProps> = null;
    const App = component<AppProps>(({ items }) => {
      const [transition, _api] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

      api = _api;

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div>{item.data}</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    items = generate(1);
    render(<App items={items} />);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items, 1));

    render(null);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(replacer);
    expect(api.isCanceled()).toBe(true);
  });

  test('passes the index and the item to the configurator', () => {
    const count = 4;
    type SpringProps = 'scale';
    let items: Array<Item> = null;
    let api: TransitionApi<SpringProps> = null;
    const spy = jest.fn();
    const App = component(() => {
      const [transition, _api] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        (idx, item) => {
          spy(idx, item);
          return {
            from: { scale: 0 },
            enter: { scale: 1 },
            leave: { scale: 0 },
            update: { scale: 1 },
          };
        },
      );

      api = _api;

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div>{item.data}</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    items = generate(count);
    render(<App />);
    api.start();
    jest.runAllTimers();

    items.forEach((x, idx) => expect(spy).toHaveBeenCalledWith(idx, x));
  });

  test(`doesn't throw an exception without the transition call`, () => {
    const count = 4;
    type SpringProps = 'scale';
    let items: Array<Item> = null;
    let api: TransitionApi<SpringProps> = null;
    const make = () => {
      const App = component(() => {
        const [_, _api] = useTransition<SpringProps, Item>(
          items,
          x => x.id,
          () => ({
            from: { scale: 0 },
            enter: { scale: 1 },
            leave: { scale: 0 },
            update: { scale: 1 },
          }),
        );

        api = _api;

        return null;
      });

      items = generate(count);
      render(<App />);
      api.start();
      jest.runAllTimers();
    };

    expect(make).not.toThrow();
  });

  test('supports SSR', async () => {
    const content = (items: Array<Item>, opacity: number) =>
      items
        .map(
          x => dom`
              <div style="opacity: ${opacity};">${x.data}</div>
            `,
        )
        .join('');
    let items: Array<Item> = null;
    type SpringProps = 'opacity';
    type AppProps = { items: Array<Item> };
    const App = component<AppProps>(({ items }) => {
      const [transition, _api] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div style={`opacity: ${spring.prop('opacity')};`}>{item.data}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    items = generate(3);

    const { renderToString } = createServerEnv();
    const html = await renderToString(<App items={items} />);

    expect(html).toBe(content(items, 0));
    expect(spy).not.toHaveBeenCalled();
  });

  test('supports hydration', async () => {
    const content = (items: Array<Item>, opacity: number) =>
      items
        .map(
          x => dom`
              <div style="opacity: ${opacity};">${x.data}</div>
            `,
        )
        .join('');
    let items: Array<Item> = null;
    type SpringProps = 'opacity';
    type AppProps = { items: Array<Item> };
    const App = component<AppProps>(({ items }) => {
      const [transition, _api] = useTransition<SpringProps, Item>(
        items,
        x => x.id,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          update: { opacity: 1 },
        }),
      );

      return transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <div style={`opacity: ${spring.prop('opacity')};`}>{item.data}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    items = generate(3);

    const { renderToString } = createServerEnv();
    const html = await renderToString(<App items={items} />);

    expect(html).toBe(content(items, 0));
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();

    const { host, render } = createBrowserEnv();

    host.innerHTML = html;

    hydrateRoot(host, <App items={items} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe(content(items, 1));
    expect(spy).toHaveBeenCalledTimes(174);
    spy.mockClear();

    items = generate(5);
    render(<App items={items} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe(content(items, 1));
    expect(spy).toHaveBeenCalledTimes(139);
  });
});
