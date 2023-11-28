/** @jsx h */
import { h, component, useState } from '@dark-engine/core';
import { dom, createEnv, mockPlatformRaf } from '@test-utils';

import { type SpringApi } from '../use-springs';
import { type SpringValue } from '../shared';
import { Animated } from '../animated';
import { Spring } from '../spring';
import { useSpring } from './use-spring';

let { host, render } = createEnv();

beforeEach(() => {
  ({ host, render } = createEnv());
  mockPlatformRaf();
});

describe('[@animations/use-spring]', () => {
  test('returns the spring value and the api', () => {
    type SpringProps = 'scale';
    let spring: Spring<SpringProps> = null;
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [_spring, _api] = useSpring<SpringProps>({
        from: { scale: 0 },
        to: { scale: 1 },
      });

      spring = _spring;
      api = _api;

      return null;
    });

    render(<App />);
    expect(spring).toBeDefined();
    expect(spring).toBeInstanceOf(Spring);
    expect(spring.value()).toEqual({ scale: 0 });
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

  test('can animate the value via api', () => {
    jest.useFakeTimers();
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'scale' | 'opacity';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [spring, _api] = useSpring<SpringProps>({
        from: { scale: 0, opacity: 0 },
        to: { scale: 2, opacity: 1 },
      });

      api = _api;

      return (
        <Animated spring={spring} fn={styleFn}>
          <div>A</div>
        </Animated>
      );
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

  test('can animate the value via state', () => {
    jest.useFakeTimers();
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'scale' | 'opacity';
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [spring] = useSpring<SpringProps>(
        {
          from: { scale: 0, opacity: 0 },
          to: { scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 },
        },
        [isOpen],
      );

      setIsOpen = _setIsOpen;

      return (
        <Animated spring={spring} fn={styleFn}>
          <div>A</div>
        </Animated>
      );
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
});
