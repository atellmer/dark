/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component/component';
import { signal } from './signal';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[signal]', () => {
  test('can trigger render and update a state correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    const count$ = signal(0);

    const App = component(() => {
      return <div>{count$.get()}</div>;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(2));
  });

  test('can use multiple signals', () => {
    const content = (count1: number, count2: number) => dom`
      <div>${count1}</div>
      <div>${count2}</div>
    `;

    const count1$ = signal(0);
    const count2$ = signal(100);

    const App = component(() => {
      return (
        <>
          <div>{count1$.get()}</div>
          <div>{count2$.get()}</div>
        </>
      );
    });

    render(App(), host);
    jest.runAllTimers();
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

    const count$ = signal(0);

    const App = component(() => {
      const count = count$.get((p, n) => n !== 2);

      return <div>{count}</div>;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(x => x + 1);
    expect(host.innerHTML).toBe(content(3));
  });
});
