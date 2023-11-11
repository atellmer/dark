/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component/component';
import { type Atom, atom, useAtom } from './atom';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
  jest.useFakeTimers();
});

describe('[atom]', () => {
  test('atom has required methods', () => {
    const count$ = atom(0);

    expect(count$.value).toBeDefined();
    expect(count$.get).toBeDefined();
    expect(count$.set).toBeDefined();
    expect(count$.off).toBeDefined();
  });

  test('can trigger render and update a state correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    const count$ = atom(0);

    const App = component(() => {
      return <div>{count$.value()}</div>;
    });

    render(App(), host);
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
          <div>{count1$.value()}</div>
          <div>{count2$.value()}</div>
        </>
      );
    });

    render(App(), host);
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
      const count = count$.value((p, n) => n !== 2);

      return <div>{count}</div>;
    });

    render(App(), host);
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

    type Tuple = ReturnType<typeof useAtom<number>>;

    let count$: Tuple[0] = null;
    let setCount$: Tuple[1] = null;

    const App = component(() => {
      [count$, setCount$] = useAtom(0);

      return <div>{count$.value()}</div>;
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(0));

    setCount$(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    setCount$(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    setCount$(x => x + 1);
    expect(host.innerHTML).toBe(content(3));
  });

  test('renders only the consumer', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    const fn1 = jest.fn();
    const fn2 = jest.fn();

    type Tuple = ReturnType<typeof useAtom<number>>;

    let count$: Tuple[0] = null;
    let setCount$: Tuple[1] = null;

    type ChildProps = {
      count$: Atom<number>;
    };

    const Child = component<ChildProps>(({ count$ }) => {
      fn2();
      return <div>{count$.value()}</div>;
    });

    const App = component(() => {
      [count$, setCount$] = useAtom(0);
      fn1();
      return <Child count$={count$} />;
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(0));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    setCount$(x => x + 1);
    expect(host.innerHTML).toBe(content(1));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);

    setCount$(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(3);
  });

  test('removes the subscribers if their fibers are deleted', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    const count$ = atom(0);

    const App = component(() => {
      return <div>{count$.value()}</div>;
    });

    render(App(), host);
    expect(count$['subs'].size).toBe(1);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    render(null, host);
    jest.runAllTimers();
    expect(count$['subs'].size).toBe(0);
  });
});
