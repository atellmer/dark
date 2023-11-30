/** @jsx h */
import * as core from '@dark-engine/core';
import { h, Fragment, component, useState } from '@dark-engine/core';
import { dom, createEnv, mockPlatformRaf, replacer } from '@test-utils';

import { type SpringValue } from '../shared';
import { Animated } from '../animated';
import { type SpringApi } from '../use-springs';
import { useSpring } from '../use-spring';
import { useTrail } from '../use-trail';
import { useSprings } from '../use-springs';
import { useChain } from './use-chain';
import { type TransitionApi, useTransition } from '../use-transition';

jest.mock('@dark-engine/core', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@dark-engine/core'),
  };
});

jest.spyOn(core, 'nextTick').mockImplementation(cb => setTimeout(cb));

let { host, render } = createEnv();

beforeEach(() => {
  ({ host, render } = createEnv());
  mockPlatformRaf();
});

describe('[@animations/use-chain]', () => {
  test('can run animations in the sequence via events', () => {
    jest.useFakeTimers();
    const content = (isOpen: boolean, opacity1: number, opacity2: number, opacity3: number, opacity4: number) => dom`
      <div style="opacity: ${opacity1};">A</div>
      <div style="opacity: ${opacity2};">B</div>
      ${isOpen ? `<div style="opacity: ${opacity3};">C</div>` : replacer}
      <div style="opacity: ${opacity4};">D</div>
    `;
    type SpringProps = 'opacity';
    let setIsOpen: (x: boolean) => void = null;
    let api1: SpringApi = null;
    let api2: SpringApi = null;
    let api3: TransitionApi = null;
    let api4: SpringApi = null;
    let off1: Function = null;
    let off2: Function = null;
    let off3: Function = null;
    let off4: Function = null;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [spring1, _api1] = useSpring<SpringProps>(
        {
          from: { opacity: 0 },
          to: { opacity: isOpen ? 1 : 0 },
        },
        [isOpen],
      );
      const [spring2, _api2] = useSprings<SpringProps>(
        1,
        () => ({
          from: { opacity: 0 },
          to: { opacity: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );
      const [transition, _api3] = useTransition<SpringProps, number>(
        isOpen ? [1] : [],
        x => x,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: isOpen ? 1 : 0 },
        }),
      );
      const [spring3, _api4] = useTrail<SpringProps>(
        1,
        () => ({
          from: { opacity: 0 },
          to: { opacity: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      useChain(isOpen ? [_api1, _api2, _api3, _api4] : [_api4, _api3, _api2, _api1]);

      setIsOpen = _setIsOpen;
      api1 = _api1;
      api2 = _api2;
      api3 = _api3;
      api4 = _api4;

      return (
        <>
          <Animated spring={spring1} fn={styleFn}>
            <div>A</div>
          </Animated>
          <Animated spring={spring2[0]} fn={styleFn}>
            <div>B</div>
          </Animated>
          {transition(({ spring }) => {
            return (
              <Animated spring={spring} fn={styleFn}>
                <div>C</div>
              </Animated>
            );
          })}
          <Animated spring={spring3[0]} fn={styleFn}>
            <div>D</div>
          </Animated>
        </>
      );
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(false, 0, 0, 0, 0));

    off1 = api1.on('series-end', () => {
      off1();
      expect(host.innerHTML).toBe(content(false, 1, 0, 0, 0));
    });
    off2 = api2.on('series-end', () => {
      off2();
      expect(host.innerHTML).toBe(content(false, 1, 1, 0, 0));
    });
    off3 = api3.on('series-end', () => {
      off3();
      expect(host.innerHTML).toBe(content(true, 1, 1, 1, 0));
    });
    off4 = api4.on('series-end', () => {
      off4();
      expect(host.innerHTML).toBe(content(true, 1, 1, 1, 1));
    });

    setIsOpen(true);
    jest.runAllTimers();

    off4 = api4.on('series-end', () => {
      off4();
      expect(host.innerHTML).toBe(content(true, 1, 1, 1, 0));
    });
    off3 = api3.on('series-end', () => {
      off3();
      expect(host.innerHTML).toBe(content(true, 1, 1, 0, 0));
    });
    off2 = api2.on('series-end', () => {
      off2();
      expect(host.innerHTML).toBe(content(false, 1, 0, 0, 0));
    });
    off1 = api1.on('series-end', () => {
      off1();
      expect(host.innerHTML).toBe(content(false, 0, 0, 0, 0));
    });

    setIsOpen(false);
    jest.runAllTimers();
  });

  test('can run animations in the sequence via timesteps', () => {
    jest.useFakeTimers();
    const content = (isOpen: boolean, opacity1: number, opacity2: number, opacity3: number, opacity4: number) => dom`
      <div style="opacity: ${opacity1};">A</div>
      <div style="opacity: ${opacity2};">B</div>
      ${isOpen ? `<div style="opacity: ${opacity3};">C</div>` : replacer}
      <div style="opacity: ${opacity4};">D</div>
    `;
    type SpringProps = 'opacity';
    let setIsOpen: (x: boolean) => void = null;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [spring1, api1] = useSpring<SpringProps>(
        {
          from: { opacity: 0 },
          to: { opacity: isOpen ? 1 : 0 },
        },
        [isOpen],
      );
      const [spring2, api2] = useSprings<SpringProps>(
        1,
        () => ({
          from: { opacity: 0 },
          to: { opacity: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );
      const [transition, api3] = useTransition<SpringProps, number>(
        isOpen ? [1] : [],
        x => x,
        () => ({
          from: { opacity: 0 },
          enter: { opacity: isOpen ? 1 : 0 },
        }),
      );
      const [spring3, api4] = useTrail<SpringProps>(
        1,
        () => ({
          from: { opacity: 0 },
          to: { opacity: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      useChain(isOpen ? [api1, api2, api3, api4] : [api4, api3, api2, api1], [0, 0.05, 0.05, 0.05]);

      setIsOpen = _setIsOpen;

      return (
        <>
          <Animated spring={spring1} fn={styleFn}>
            <div>A</div>
          </Animated>
          <Animated spring={spring2[0]} fn={styleFn}>
            <div>B</div>
          </Animated>
          {transition(({ spring }) => {
            return (
              <Animated spring={spring} fn={styleFn}>
                <div>C</div>
              </Animated>
            );
          })}
          <Animated spring={spring3[0]} fn={styleFn}>
            <div>D</div>
          </Animated>
        </>
      );
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(false, 0, 0, 0, 0));

    setIsOpen(true);
    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(false, 0.1884, 0, 0, 0));

    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(false, 0.4227, 0.1884, 0, 0));

    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(true, 0.6093, 0.4227, 0.1884, 0));

    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(true, 0.7412, 0.6093, 0.4227, 0.1106));

    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(true, 1, 1, 1, 1));

    setIsOpen(false);
    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(true, 1, 1, 1, 0.8116));

    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(true, 1, 1, 0.8116, 0.5773));

    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(true, 1, 0.8116, 0.5773, 0.3907));

    jest.advanceTimersByTime(50);
    expect(host.innerHTML).toBe(content(true, 0.8894, 0.5773, 0.3907, 0.2588));

    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(false, 0, 0, 0, 0));
  });
});
