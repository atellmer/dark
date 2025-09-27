import { component } from '@dark-engine/core';
import { createBrowserEnv, replacer } from '@test-utils';

import { signal } from './signal';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  jest.useFakeTimers();
});

describe('@signals/signal', () => {
  test('signal has required public methods', () => {
    const signal$ = signal(0);

    expect(signal$.get).toBeDefined();
    expect(signal$.peek).toBeDefined();
    expect(signal$.set).toBeDefined();
    expect(signal$.toString).toBeDefined();
    expect(signal$.toJSON).toBeDefined();
    expect(signal$.valueOf).toBeDefined();
  });

  test('signal gives the correct value', () => {
    const signal$ = signal(10);

    expect(signal$.get()).toBe(10);
    expect(signal$.peek()).toBe(10);
    signal$.set(20);
    expect(signal$.get()).toBe(20);
    expect(signal$.peek()).toBe(20);
    signal$.set(x => x + 10);
    expect(signal$.get()).toBe(30);
    expect(signal$.peek()).toBe(30);
  });

  test('signal transforms to primitive value correctly', () => {
    const signal$ = signal(10);

    expect(`signal is ${signal$}`).toBe('signal is 10');
    expect(Number(signal$)).toBe(10);
    expect(JSON.stringify(signal$)).toBe('10');
  });

  test('signal can accept equality function', () => {
    const signal1$ = signal(10);
    const signal2$ = signal(10, { equal: () => false });
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    signal1$.__on(spy1);
    signal2$.__on(spy2);

    signal1$.set(10);
    signal2$.set(10);

    expect(spy1).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test('signal triggers render and updates component correctly #1', () => {
    const count$ = signal(0);
    const App = component(() => {
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

  test('signal triggers render and updates component correctly #2', () => {
    const count1$ = signal(0);
    const count2$ = signal(10);
    const spy = jest.fn();
    const App = component(() => {
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

  test('signal unmounts from component correctly', () => {
    const count$ = signal(0);
    const App = component(() => {
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
