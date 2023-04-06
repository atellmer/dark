/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { component } from '../component/component';
import { type Atom, atom } from '../atom';
import { useReactiveState, detectIsProxy } from './use-reactive-state';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-reactive-state]', () => {
  test('can trigger render and update state correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    type State = { count: number };

    let state: State;

    const App = component(() => {
      state = useReactiveState<State>({ count: 0 });

      return <div>{state.count}</div>;
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(0));

    state.count++;
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));

    state.count++;
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2));
  });

  test('can works with nested objects', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    type State = {
      child: {
        child: {
          count: number;
        };
      };
    };

    let state: State;

    const App = component(() => {
      state = useReactiveState<State>({
        child: {
          child: {
            count: 0,
          },
        },
      });

      return <div>{state.child.child.count}</div>;
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(0));

    state.child.child.count++;
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));

    state.child.child.count++;
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2));
  });

  test('can works with arrays', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    type State = Array<number>;

    let state: State;

    const App = component(() => {
      state = useReactiveState<State>([]);

      return <div>{state.length}</div>;
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(0));

    state.push(0);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));

    state.push(0);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2));
  });

  test('throws exception when initial state is no defined', () => {
    let error = null;

    const App = component(() => {
      try {
        useReactiveState(null);
      } catch (err) {
        error = err;
      }

      return null;
    });

    render(App(), host);
    expect(error).toBeTruthy();
  });

  test('skip atoms', () => {
    type State = {
      proxy: object;
      atom: Atom;
    };

    let state: State;

    const App = component(() => {
      state = useReactiveState<State>({ atom: atom(), proxy: {} });

      return null;
    });

    render(App(), host);
    expect(detectIsProxy(state)).toBe(true);
    expect(detectIsProxy(state.proxy)).toBe(true);
    expect(detectIsProxy(state.atom)).toBe(false);
  });
});
