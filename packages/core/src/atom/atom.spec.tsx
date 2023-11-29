/** @jsx h */
import { dom, createEnv } from '@test-utils';

import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component';
import { type Atom, atom, useAtom } from './atom';

let { host, render } = createEnv();

beforeEach(() => {
  ({ host, render } = createEnv());
});

describe('[@core/atom]', () => {
  test('has required methods', () => {
    const count$ = atom(0);

    expect(count$.val).toBeDefined();
    expect(count$.get).toBeDefined();
    expect(count$.set).toBeDefined();
    expect(count$.kill).toBeDefined();
    expect(count$.on).toBeDefined();
    expect(count$.toString).toBeDefined();
    expect(count$.toJSON).toBeDefined();
    expect(count$.valueOf).toBeDefined();
  });

  test('can trigger render and update a state correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      return <div>{count$.val()}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
  });

  test('can use multiple atoms', () => {
    const content = (count1: number, count2: number) => dom`
      <div>${count1}</div>
      <div>${count2}</div>
    `;
    const count1$ = atom(0);
    const count2$ = atom(100);
    const App = component(() => {
      return (
        <>
          <div>{count1$.val()}</div>
          <div>{count2$.val()}</div>
        </>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 100));

    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1, 101));

    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2, 102));

    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3, 103));
  });

  test('can skip the update if needed', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      const count = count$.val((p, n) => n !== 2);

      return <div>{count}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3));
  });

  test('useAtom works correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    let count$: Atom<number> = null;
    const App = component(() => {
      count$ = useAtom(0);

      return <div>{count$.val()}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3));
  });

  test('renders only the consumer', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    let count$: Atom<number> = null;
    type ChildProps = {
      count$: Atom<number>;
    };
    const Child = component<ChildProps>(({ count$ }) => {
      fn2();
      return <div>{count$.val()}</div>;
    });

    const App = component(() => {
      count$ = useAtom(0);
      fn1();
      return <Child count$={count$} />;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(3);
  });

  test('removes the connections if their fibers are deleted', () => {
    jest.useFakeTimers();
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      return <div>{count$.val()}</div>;
    });

    render(<App />);
    expect(count$.getSize()).toBe(1);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    render(null);
    jest.runAllTimers();
    expect(count$.getSize()).toBe(0);
  });

  test('the kill method works correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      return <div>{count$.val()}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.kill();
    count$.set(10);
    expect(host.innerHTML).toBe(content(1));
  });

  test('the on method works correctly', () => {
    const count$ = atom(0);
    const spy = jest.fn();
    const off = count$.on(spy);

    expect(typeof off).toBe('function');

    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(1);

    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(2);

    off();
    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('the toString method works correctly', () => {
    const count$ = atom(0);

    count$.set(x => x + 1);
    expect('count is ' + count$).toBe('count is 1');
  });

  test('the toJSON method works correctly', () => {
    const atom$ = atom({ x: 1 });

    atom$.set({ x: 2 });
    expect(JSON.stringify(atom$)).toBe(JSON.stringify({ x: 2 }));
  });

  test('the valueOf method works correctly', () => {
    const count$ = atom(0);

    count$.set(10);
    expect((count$ as unknown as number) + 2).toBe(12);
  });
});
