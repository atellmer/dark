/** @jsx h */

import { h, component, useState, detectIsArray } from '@dark-engine/core';
import { dom, createEnv, mockPlatformRaf } from '@test-utils';

import { type SpringValue } from '../shared';
import { type SpringApi } from '../use-springs';
import { Animated } from '../animated';
import { Spring } from '../spring';
import { range } from '../utils';
import { useTrail } from './use-trail';

let { host, render } = createEnv();

beforeEach(() => {
  ({ host, render } = createEnv());
  mockPlatformRaf();
});

describe('[@animations/use-trail]', () => {
  test('returns springs and an api', () => {
    type SpringProps = 'scale';
    let springs: Array<Spring<SpringProps>> = null;
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [_springs, _api] = useTrail<SpringProps>(1, () => ({
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

  test('can animate a value via api', () => {
    jest.useFakeTimers();
    const count = 4;
    const items = range(count);
    const content = (scale: number) =>
      items
        .map(
          (_, idx) => dom`
            <div style="transform: scale(${scale});">${idx}</div>
          `,
        )
        .join('');
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useTrail<SpringProps>(count, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFns[idx]}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const spies = items.map(() => jest.fn());
    const styleFns = items.map((_, idx) => (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spies[idx](value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    spies.forEach((spy, idx) => spies[idx + 1] && expect(spy.mock.calls).not.toEqual(spies[idx + 1].mock.calls));
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.0435 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.0019 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.0001 });
    expect(spies[3]).toHaveBeenCalledWith({ scale: 0.0001 });
  });

  test('can animate a value via state', () => {
    jest.useFakeTimers();
    const count = 4;
    const items = range(count);
    const content = (scale: number) =>
      items
        .map(
          (_, idx) => dom`
            <div style="transform: scale(${scale});">${idx}</div>
          `,
        )
        .join('');
    type SpringProps = 'scale';
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [springs] = useTrail<SpringProps>(
        count,
        () => ({
          from: { scale: 0 },
          to: { scale: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      setIsOpen = _setIsOpen;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFns[idx]}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const spies = items.map(() => jest.fn());
    const styleFns = items.map((_, idx) => (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spies[idx](value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    spies.forEach((spy, idx) => spies[idx + 1] && expect(spy.mock.calls).not.toEqual(spies[idx + 1].mock.calls));
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.1106 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.0048 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.0002 });
    expect(spies[3]).toHaveBeenCalledWith({ scale: 0.0002 });
    spies.forEach(spy => spy.mockClear());

    setIsOpen(false);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));
    spies.forEach((spy, idx) => spies[idx + 1] && expect(spy.mock.calls).not.toEqual(spies[idx + 1].mock.calls));
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.9565 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.9981 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.9999 });
    expect(spies[3]).toHaveBeenCalledWith({ scale: 0.9999 });
  });
});
