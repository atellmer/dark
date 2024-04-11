import { component, useInsertionEffect, useLayoutEffect, useEffect, useState } from '@dark-engine/core';

import { click, dom, createBrowserEnv } from '@test-utils';
import { hydrateRoot } from './hydrate-root';

let { host } = createBrowserEnv();

beforeEach(() => {
  ({ host } = createBrowserEnv());
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  jest.useFakeTimers();
});

describe('@platform-browser/hydrate-root', () => {
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

  test('can hydrate an entire document', () => {
    // https://github.com/atellmer/dark/issues/44
    let root: { unmount: () => void } = null;
    const headContent = (x: number) =>
      `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Test: ${x}</title>`;
    const bodyContent = (x: number) => `<div>${x}</div><button>click</button>`;

    document.head.innerHTML = headContent(0);
    document.body.innerHTML = bodyContent(0);

    const button = document.querySelector('button');
    const App = component(() => {
      const [count, setCount] = useState(0);

      return (
        <html>
          <head>
            <meta charset='UTF-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Test: {count}</title>
          </head>
          <body>
            <div>{count}</div>
            <button onClick={() => setCount(x => x + 1)}>click</button>
          </body>
        </html>
      );
    });

    expect(() => (root = hydrateRoot(document, <App />))).not.toThrowError();
    expect(document.head.innerHTML).toBe(headContent(0));
    expect(document.body.innerHTML).toBe(bodyContent(0));

    click(button);
    expect(document.head.innerHTML).toBe(headContent(1));
    expect(document.body.innerHTML).toBe(bodyContent(1));

    click(button);
    expect(document.head.innerHTML).toBe(headContent(2));
    expect(document.body.innerHTML).toBe(bodyContent(2));

    root.unmount();
  });
});
