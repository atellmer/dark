import { component } from '@dark-engine/core';
import { createBrowserEnv, replacer } from '@test-utils';

import { signal } from '../signal';
import { useComputed } from '../use-computed';
import { useWatch } from './use-watch';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  jest.useFakeTimers();
});

describe('@signals/use-watch', () => {
  test('use-watch triggers render and update component correctly #1', () => {
    const count$ = signal(0);
    const App = component(() => {
      useWatch([count$]);

      return <div>{count$.get()}</div>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>0</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>2</div>"`);
  });

  test('use-watch triggers render and update component correctly #2', () => {
    const count$ = signal(0);
    const App = component(() => {
      const computed$ = useComputed(() => count$.get() + 1);

      useWatch([computed$]);

      return <div>{computed$.get()}</div>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>2</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>3</div>"`);
  });

  test('use-watch can tracks multiple signals', () => {
    const count1$ = signal(0);
    const count2$ = signal(10);
    const spy = jest.fn();
    const App = component(() => {
      useWatch([count1$, count2$]);
      spy();

      return (
        <div>
          {count1$.get()}:{count2$.get()}
        </div>
      );
    });

    render(<App />);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>0:10</div>"`);

    count1$.set(x => x + 1);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1:10</div>"`);

    count2$.set(x => x + 1);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1:11</div>"`);

    spy.mockClear();
    count1$.set(x => x + 1);
    count2$.set(x => x + 1);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>2:12</div>"`);
  });

  test('use-watch unmounts correctly', () => {
    const count$ = signal(0);
    const App = component(() => {
      useWatch([count$]);

      return <div>{count$.get()}</div>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(count$.__getSize()).toBe(1);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>0</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(count$.__getSize()).toBe(1);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1</div>"`);

    render(null);
    jest.runAllTimers();
    expect(count$.__getSize()).toBe(0);
    expect(host.innerHTML).toBe(replacer);
  });
});
