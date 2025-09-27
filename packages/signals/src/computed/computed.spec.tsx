import { component } from '@dark-engine/core';
import { createBrowserEnv } from '@test-utils';

import { signal } from '../signal';
import { computed } from './computed';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  jest.useFakeTimers();
});

describe('@signals/computed', () => {
  test('computed has required public methods', () => {
    const computed$ = computed(() => 0);

    expect(computed$.get).toBeDefined();
    expect(computed$.peek).toBeDefined();
    expect(computed$.toString).toBeDefined();
    expect(computed$.toJSON).toBeDefined();
    expect(computed$.valueOf).toBeDefined();
  });

  test('computed gives the correct value', () => {
    const computed$ = computed(() => 10);

    expect(computed$.get()).toBe(10);
    expect(computed$.peek()).toBe(10);
  });

  test('computed transforms to primitive value correctly', () => {
    const computed$ = computed(() => 10);

    expect(`computed is ${computed$}`).toBe('computed is 10');
    expect(Number(computed$)).toBe(10);
    expect(JSON.stringify(computed$)).toBe('10');
  });

  test('computed updates value with source signals correctly', () => {
    const count1$ = signal(1);
    const count2$ = signal(10);
    const computed$ = computed(() => count1$.get() + count2$.get());

    expect(computed$.get()).toBe(11);
    count1$.set(2);
    expect(computed$.get()).toBe(12);
    expect(computed$.get()).toBe(12);
    count1$.set(x => x + 1);
    expect(computed$.get()).toBe(13);
    count2$.set(20);
    expect(computed$.get()).toBe(23);
  });

  test('computed triggers render and updates component correctly #1', () => {
    const count$ = signal(0);
    const computed$ = computed(() => count$.get() + 1);
    const App = component(() => {
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

  test('computed triggers render and updates component correctly #2', () => {
    const count$ = signal(0);
    const computed$ = computed(() => count$.get() + 1);
    const App = component(() => {
      return (
        <div>
          {count$.get()}:{computed$.get()}
        </div>
      );
    });

    render(<App />);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>0:1</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1:2</div>"`);

    count$.set(x => x + 1);
    jest.runAllTimers();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>2:3</div>"`);
  });
});
