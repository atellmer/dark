/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component/component';
import { atom, useAtom } from '../use-atom';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-atom]', () => {
  test('can trigger render and update state correctly', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    const count$ = atom(0);

    const App = component(() => {
      const [count] = useAtom([[count$]]);

      return <div>{count}</div>;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));

    count$.set(count$.get() + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(count$.get() + 1);
    expect(host.innerHTML).toBe(content(2));
  });

  test('can skip update if need', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;

    const count$ = atom(0);

    const App = component(() => {
      const [count] = useAtom([[count$, (p, n) => n !== 2]]);

      return <div>{count}</div>;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));

    count$.set(count$.get() + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(count$.get() + 1);
    expect(host.innerHTML).toBe(content(1));

    count$.set(count$.get() + 1);
    expect(host.innerHTML).toBe(content(3));
  });

  test('can use multiple atoms', () => {
    const content = (count1: number, count2: number) => dom`
      <div>${count1}</div>
      <div>${count2}</div>
    `;

    const count1$ = atom(0);
    const count2$ = atom(100);

    const App = component(() => {
      const [count1, count2] = useAtom([[count1$], [count2$]]);

      return (
        <>
          <div>{count1}</div>
          <div>{count2}</div>
        </>
      );
    });

    render(App(), host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0, 100));

    count1$.set(count1$.get() + 1);
    count2$.set(count2$.get() + 1);
    expect(host.innerHTML).toBe(content(1, 101));

    count1$.set(count1$.get() + 1);
    count2$.set(count2$.get() + 1);
    expect(host.innerHTML).toBe(content(2, 102));

    count1$.set(count1$.get() + 1);
    count2$.set(count2$.get() + 1);
    expect(host.innerHTML).toBe(content(3, 103));
  });
});
