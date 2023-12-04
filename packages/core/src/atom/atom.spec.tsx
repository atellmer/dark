/** @jsx h */
import { dom, createBrowserEnv } from '@test-utils';

import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component';
import { type WritableAtom, type ReadableAtom, atom, computed, useAtom, useComputed } from './atom';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('[@core/atom]', () => {
  test('the writable atom has required public methods', () => {
    const atom$ = atom(0);

    expect(atom$.val).toBeDefined();
    expect(atom$.get).toBeDefined();
    expect(atom$.set).toBeDefined();
    expect(atom$.kill).toBeDefined();
    expect(atom$.on).toBeDefined();
    expect(atom$.toString).toBeDefined();
    expect(atom$.toJSON).toBeDefined();
    expect(atom$.valueOf).toBeDefined();
  });

  test('the readable atom has required public methods', () => {
    const atom$ = atom(0);
    const computed$ = computed([atom$], x => x + 1);

    expect(computed$.val).toBeDefined();
    expect(computed$.get).toBeDefined();
    expect(computed$.kill).toBeDefined();
    expect(computed$.on).toBeDefined();
    expect(computed$.toString).toBeDefined();
    expect(computed$.toJSON).toBeDefined();
    expect(computed$.valueOf).toBeDefined();
  });

  test('the wriable atom can trigger render and update the state correctly', () => {
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

  test('the readable atom can trigger render and update the state correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);
    const App = component(() => {
      return <div>{computed$.val()}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3));
  });

  test('can use multiple writable atoms', () => {
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

  test('can use multiple readable atoms', () => {
    const content = (count1: number, count2: number) => dom`
      <div>${count1}</div>
      <div>${count2}</div>
    `;
    const count1$ = atom(0);
    const count2$ = atom(100);
    const computed1$ = computed([count1$], x => x + 1);
    const computed2$ = computed([count2$], x => x + 1);
    const App = component(() => {
      return (
        <>
          <div>{computed1$.val()}</div>
          <div>{computed2$.val()}</div>
        </>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(1, 101));

    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2, 102));

    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3, 103));

    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(4, 104));
  });

  test('the writable atom can skip the update if necessary', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      const count = count$.val((p, n) => n === 2);

      return <div>{count}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
  });

  test('the readable atom can skip the update if necessary', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);
    const App = component(() => {
      const computed = computed$.val((p, n) => n === 4);

      return <div>{computed}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(4));
  });

  test('the useAtom works correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    let count$: WritableAtom<number> = null;
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

  test('the useComputed works correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      const computed$ = useComputed([count$], x => x + 1);

      return <div>{computed$.val()}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(4));
  });

  test('the writable atom triggers the render only for the consumer', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    let count$: WritableAtom<number> = null;
    type ChildProps = {
      count$: WritableAtom<number>;
    };
    const Child = component<ChildProps>(({ count$ }) => {
      spy2();
      return <div>{count$.val()}</div>;
    });

    const App = component(() => {
      count$ = useAtom(0);
      spy1();
      return <Child count$={count$} />;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(2);

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(3);
  });

  test('the readable atom triggers the render only for the consumer', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const count$ = atom(0);
    type ChildProps = {
      computed$: ReadableAtom<number>;
    };
    const Child = component<ChildProps>(({ computed$ }) => {
      spy2();
      return <div>{computed$.val()}</div>;
    });

    const App = component(() => {
      const computed$ = useComputed([count$], x => x + 1);
      spy1();
      return <Child computed$={computed$} />;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(1));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(2);

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(3);
  });

  test('the writable atom removes the connections if their fibers are deleted', () => {
    jest.useFakeTimers();
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const App = component(() => {
      return <div>{count$.val()}</div>;
    });

    render(<App />);
    expect(count$.__getSize()).toBe(1);
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    render(null);
    jest.runAllTimers();
    expect(count$.__getSize()).toBe(0);
  });

  test('the readable atom removes the connections if their fibers are deleted', () => {
    jest.useFakeTimers();
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);
    const App = component(() => {
      return <div>{computed$.val()}</div>;
    });

    render(<App />);
    expect(computed$.__getSize()).toBe(1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    render(null);
    jest.runAllTimers();
    expect(computed$.__getSize()).toBe(0);
  });

  test('the kill method of the writable atom works correctly', () => {
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

  test('the kill method of the readable atom works correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);
    const App = component(() => {
      return <div>{computed$.val()}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    computed$.kill();
    count$.set(10);
    expect(host.innerHTML).toBe(content(2));
  });

  test('the on method of the writable atom works correctly', () => {
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

  test('the on method of the readable atom works correctly', () => {
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);
    const spy = jest.fn();
    const off = computed$.on(spy);

    expect(typeof off).toBe('function');

    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(1);

    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(2);

    off();
    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('the toString method of the writebale atom works correctly', () => {
    const count$ = atom(0);

    count$.set(x => x + 1);
    expect('count is ' + count$).toBe('count is 1');
  });

  test('the toString method of the readable atom works correctly', () => {
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);

    count$.set(x => x + 1);
    expect('computed is ' + computed$).toBe('computed is 2');
  });

  test('the toJSON method of the writable atom works correctly', () => {
    type Value = { x: number };
    const atom$ = atom<Value>({ x: 1 });

    atom$.set({ x: 2 });
    expect(JSON.stringify(atom$)).toBe(JSON.stringify({ x: 2 }));
  });

  test('the toJSON method of the readable atom works correctly', () => {
    type Value = { x: number };
    const atom$ = atom<Value>({ x: 1 });
    const computed$ = computed([atom$], value => ({ x: value.x + 1 }));

    atom$.set({ x: 2 });
    expect(JSON.stringify(computed$)).toBe(JSON.stringify({ x: 3 }));
  });

  test('the valueOf method of the writable atom works correctly', () => {
    const count$ = atom(0);

    count$.set(10);
    expect((count$ as unknown as number) + 2).toBe(12);
  });

  test('the valueOf method of the readable atom works correctly', () => {
    const count$ = atom(0);
    const computed$ = computed([count$], x => x + 1);

    count$.set(10);
    expect((computed$ as unknown as number) + 2).toBe(13);
  });

  test('the readable atom can depend on multiple deps', () => {
    const a$ = atom(0);
    const b$ = atom(0);
    const computed$ = computed([a$, b$], (a, b) => a + b);
    const spy = jest.fn();

    computed$.on(spy);

    a$.set(1);
    expect(computed$.get()).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ prev: 0, next: 1 });
    spy.mockReset();
    b$.set(1);
    expect(computed$.get()).toBe(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ prev: 1, next: 2 });
    spy.mockReset();
    a$.set(1);
    b$.set(1);
    expect(computed$.get()).toBe(2);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockReset();
    a$.set(2);
    b$.set(3);
    expect(computed$.get()).toBe(5);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({ prev: 2, next: 3 });
    expect(spy).toHaveBeenCalledWith({ prev: 3, next: 5 });
  });

  test('the computed flow has the strict determined order', () => {
    const spy = jest.fn();
    {
      const a$ = atom(0);
      const b$ = atom(0);
      const c$ = computed([a$, b$], (a, b) => a + b);
      const d$ = computed([c$], c => c + 1);

      d$.on(({ next }) => spy(next));
      c$.on(({ next }) => spy(next));

      a$.set(1);
      b$.set(2);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.mock.calls[0][0]).toBe(1);
      expect(spy.mock.calls[1][0]).toBe(2);
      expect(spy.mock.calls[2][0]).toBe(3);
      expect(spy.mock.calls[3][0]).toBe(4);
      spy.mockClear();
    }
    {
      const a$ = atom(0);
      const b$ = atom(0);
      const c$ = computed([a$, b$], (a, b) => a + b);
      const d$ = computed([c$], c => c + 1);

      c$.on(({ next }) => spy(next));
      d$.on(({ next }) => spy(next));

      a$.set(1);
      b$.set(2);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.mock.calls[0][0]).toBe(1);
      expect(spy.mock.calls[1][0]).toBe(2);
      expect(spy.mock.calls[2][0]).toBe(3);
      expect(spy.mock.calls[3][0]).toBe(4);
      spy.mockClear();
    }
    {
      const a$ = atom(0);
      const b$ = atom(0);
      const c$ = computed([a$, b$], (a, b) => a + b);

      c$.on(({ next }) => spy(next));

      const d$ = computed([c$], c => c + 1);

      d$.on(({ next }) => spy(next));

      a$.set(1);
      b$.set(2);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.mock.calls[0][0]).toBe(1);
      expect(spy.mock.calls[1][0]).toBe(2);
      expect(spy.mock.calls[2][0]).toBe(3);
      expect(spy.mock.calls[3][0]).toBe(4);
      spy.mockClear();
    }
  });
});
