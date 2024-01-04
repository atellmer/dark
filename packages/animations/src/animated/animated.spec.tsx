/** @jsx h */
import { h, Fragment, component, useState } from '@dark-engine/core';
import { dom, createBrowserEnv, replacer } from '@test-utils';

import { type SpringApi } from '../use-springs';
import { type SpringValue } from '../shared';
import { Animated } from '../animated';
import { useSpring } from '../use-spring';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  jest.useFakeTimers();
});

describe('@animations/animated', () => {
  test('can animate the value', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});"></div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [spring, _api] = useSpring<SpringProps>({
        from: { scale: 0 },
        to: { scale: 1 },
      });

      api = _api;

      return (
        <Animated spring={spring} fn={styleFn}>
          <div />
        </Animated>
      );
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(element, value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
  });

  test('can animate the value with the deep nested element', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});"></div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [spring, _api] = useSpring<SpringProps>({
        from: { scale: 0 },
        to: { scale: 1 },
      });

      api = _api;

      return (
        <Animated spring={spring} fn={styleFn}>
          <>
            <>
              <div />
            </>
          </>
        </Animated>
      );
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(element, value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
  });

  test('can animate the value of the first element found', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">
        <span></span>
      </div>
      <div></div>
      <div></div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [spring, _api] = useSpring<SpringProps>({
        from: { scale: 0 },
        to: { scale: 1 },
      });

      api = _api;

      return (
        <Animated spring={spring} fn={styleFn}>
          <>
            <div>
              <span></span>
            </div>
            <div />
            <div />
          </>
        </Animated>
      );
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(element, value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
  });

  test('nested animated elements works correcrly', () => {
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};"></div>
    `;
    type SpringProps1 = 'scale';
    type SpringProps2 = 'opacity';
    let api1: SpringApi<SpringProps1> = null;
    let api2: SpringApi<SpringProps2> = null;
    const App = component(() => {
      const [spring1, _api1] = useSpring<SpringProps1>({
        from: { scale: 0 },
        to: { scale: 1 },
      });
      const [spring2, _api2] = useSpring<SpringProps2>({
        from: { opacity: 0 },
        to: { opacity: 1 },
      });

      api1 = _api1;
      api2 = _api2;

      return (
        <Animated spring={spring1} fn={styleFn1}>
          <Animated spring={spring2} fn={styleFn2}>
            <div />
          </Animated>
        </Animated>
      );
    });

    const styleFn1 = (element: HTMLDivElement, value: SpringValue<SpringProps1>) => {
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    const styleFn2 = (element: HTMLDivElement, value: SpringValue<SpringProps2>) => {
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));

    api1.start();
    api2.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1, 1));
  });

  test('unmounts correctly', () => {
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});"></div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(true);
      const [spring, _api] = useSpring<SpringProps>({
        from: { scale: 0 },
        to: { scale: 1 },
      });

      api = _api;
      setIsOpen = _setIsOpen;

      if (!isOpen) return null;

      return (
        <Animated spring={spring} fn={styleFn}>
          <div />
        </Animated>
      );
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(element, value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();

    setIsOpen(false);

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(replacer);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
