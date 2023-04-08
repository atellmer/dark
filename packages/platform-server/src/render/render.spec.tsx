/** @jsx h */
import {
  h,
  Fragment,
  Text,
  Comment,
  component,
  useState,
  useInsertionEffect,
  useLayoutEffect,
  useEffect,
} from '@dark-engine/core';

import { dom, createReplacerString } from '@test-utils';
import { renderToString, renderToStringAsync, renderToStream } from './render';

jest.useFakeTimers();

const replacer = createReplacerString();

describe('[SSR]', () => {
  test('can render text correctly', () => {
    expect(renderToString(<>hello</>)).toBe('hello');
    expect(renderToString(Text('world'))).toBe('world');
    expect(renderToString(Text('😈'))).toBe('😈');
  });

  test('can render comment correctly', () => {
    expect(renderToString(Comment('Hey baby 😍'))).toBe('<!--Hey baby 😍-->');
  });

  test('can render nullable correctly', () => {
    expect(renderToString(null)).toBe(replacer);
    expect(renderToString('')).toBe(replacer);
    expect(renderToString(0)).toBe(replacer);
    expect(renderToString(false)).toBe(replacer);
    expect(renderToString(undefined)).toBe(replacer);
  });

  test('can prevent xss attacks', () => {
    expect(renderToString(Text(`<script>alert('xss')</script>`))).toBe(`&lt;script&gt;alert('xss')&lt;/script&gt;`);
  });

  test('can render to string correctly', () => {
    const content = (x: number) =>
      dom`
        <div class="app">
          <div>Hello World</div>
          <div>count: ${x}</div>
          <button class="button">increment</button>
        </div>
      `;

    const App = component(() => {
      const [count, setCount] = useState(0);

      return (
        <>
          <div class='app'>
            <div>Hello World</div>
            <div>count: {count}</div>
            <button class='button' onClick={() => setCount(count + 1)}>
              increment
            </button>
          </div>
        </>
      );
    });

    expect(renderToString(App())).toBe(content(0));
  });

  test('can not fire effects', () => {
    const effectFn = jest.fn();

    const App = component(() => {
      useInsertionEffect(() => {
        effectFn();
      }, []);

      useLayoutEffect(() => {
        effectFn();
      }, []);

      useEffect(() => {
        effectFn();
      }, []);

      return null;
    });

    const app = renderToString(App());

    jest.runAllTimers();
    expect(effectFn).toBeCalledTimes(0);
    expect(app).toBe(replacer);
  });

  test('can render to string async correctly', async () => {
    const content = (x: number) =>
      dom`
        <div class="app">
          <div>Hello World</div>
          <div>count: ${x}</div>
          <button class="button">increment</button>
        </div>
      `;

    const App = component(() => {
      const [count, setCount] = useState(0);

      return (
        <>
          <div class='app'>
            <div>Hello World</div>
            <div>count: {count}</div>
            <button class='button' onClick={() => setCount(count + 1)}>
              increment
            </button>
          </div>
        </>
      );
    });

    expect(await renderToStringAsync(App())).toBe(content(0));
  });

  test('can render to stream correctly', () => {
    const content = (x: number) =>
      dom`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Hello</title>
        </head>
        <body>
          <div class="app">
            <div>Hello World</div>
            <div>count: ${x}</div>
            <button class="button">increment</button>
          </div>
          <script src="./build.js" defer></script>
        </body>
        </html>
      `;

    const App = component(() => {
      const [count, setCount] = useState(0);

      return (
        <html>
          <head>
            <title>Hello</title>
          </head>
          <body>
            <div class='app'>
              <div>Hello World</div>
              <div>count: {count}</div>
              <button class='button' onClick={() => setCount(count + 1)}>
                increment
              </button>
            </div>
          </body>
        </html>
      );
    });

    let data = '';
    const stream = renderToStream(App(), { bootstrapScripts: ['./build.js'] });

    stream.on('data', chunk => {
      data += chunk;
    });

    stream.on('end', () => {
      expect(data).toBe(content(0));
    });
  });
});
