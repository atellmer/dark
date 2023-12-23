/** @jsx h */
import { h, Fragment, component, useInsertionEffect, useLayoutEffect, useEffect, useState } from '@dark-engine/core';

import { click, dom } from '@test-utils';
import { hydrateRoot } from './hydrate-root';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[@platform-browser/hydrate-root]', () => {
  test('has methods', () => {
    const App = component(() => {
      return null;
    });
    const root = hydrateRoot(host, <App />);

    expect(root.unmount).toBeInstanceOf(Function);
  });

  test('unmount clears all effects and unmounts root node correctly', () => {
    const fn = jest.fn();
    const Child = component(() => {
      useInsertionEffect(() => {
        return () => fn();
      }, []);

      useLayoutEffect(() => {
        return () => fn();
      }, []);

      useEffect(() => {
        return () => fn();
      }, []);

      return <div>child</div>;
    });
    const App = component(() => {
      useInsertionEffect(() => {
        return () => fn();
      }, []);

      useLayoutEffect(() => {
        return () => fn();
      }, []);

      useEffect(() => {
        return () => fn();
      }, []);

      return (
        <div>
          <Child />
          <Child />
          <Child />
        </div>
      );
    });

    const root = hydrateRoot(host, <App />);

    jest.runAllTimers();
    root.unmount();
    expect(fn).toBeCalledTimes(12);
    expect(host.innerHTML).toBe('');
    expect(root.unmount).not.toThrowError();
  });

  test('can reuse DOM', () => {
    const App = component(() => {
      const [x, setX] = useState(0);

      const handleClick = () => setX(x + 1);

      return (
        <>
          <div class='app'>
            <div>Hello World</div>
            <div>count: {x}</div>
            <button class='button' onClick={handleClick}>
              increment
            </button>
          </div>
        </>
      );
    });

    const host1 = document.createElement('div');
    const host2 = document.createElement('div');
    const host3 = document.createElement('div');

    document.body.appendChild(host1);

    const createDOM = (host: Element, x: number) => {
      const container = document.createElement('div');

      container.setAttribute('class', 'app');
      host.appendChild(container);

      const line1 = document.createElement('div');

      line1.innerHTML = 'Hello World';
      container.appendChild(line1);

      const line2 = document.createElement('div');

      line2.innerHTML = `count: ${x}`;
      container.appendChild(line2);

      const button = document.createElement('button');

      button.setAttribute('class', 'button');
      button.innerHTML = 'increment';
      container.appendChild(button);

      return host.innerHTML;
    };

    const innerHTML1 = createDOM(host1, 0);
    const innerHTML2 = createDOM(host2, 1);
    const innerHTML3 = createDOM(host3, 2);
    const button = host1.querySelector('button');

    const content = (x: number) =>
      dom`
        <div class="app">
          <div>Hello World</div>
          <div>count: ${x}</div>
          <button class="button">increment</button>
        </div>
      `;

    expect(innerHTML1).toBe(content(0));
    expect(innerHTML2).toBe(content(1));
    expect(innerHTML3).toBe(content(2));

    const root = hydrateRoot(host1, <App />);

    expect(host1.innerHTML).toBe(innerHTML1);
    expect(button).toBe(host1.querySelector('button'));

    click(button);
    expect(host1.innerHTML).toBe(innerHTML2);
    expect(button).toBe(host1.querySelector('button'));

    click(button);
    expect(host1.innerHTML).toBe(innerHTML3);
    expect(button).toBe(host1.querySelector('button'));
    root.unmount();
  });
});
