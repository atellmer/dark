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

import { dom, sleep, replacer } from '@test-utils';
import { renderToString, renderToStream } from './render';

describe('[SSR]', () => {
  test('can render text correctly', async () => {
    expect(await renderToString(<>hello</>)).toBe('hello');
    expect(await renderToString(Text('world'))).toBe('world');
    expect(await renderToString(Text('😈'))).toBe('😈');
  });

  test('can render comment correctly', async () => {
    expect(await renderToString(Comment('Hey baby 😍'))).toBe('<!--Hey baby 😍-->');
  });

  test('can render nullable correctly', async () => {
    expect(await renderToString(null)).toBe(replacer);
    expect(await renderToString('')).toBe(replacer);
    expect(await renderToString(0)).toBe(replacer);
    expect(await renderToString(false)).toBe(replacer);
    expect(await renderToString(undefined)).toBe(replacer);
  });

  test('can prevent xss attacks', async () => {
    expect(await renderToString(Text(`<script>alert('xss')</script>`))).toBe(
      `&lt;script&gt;alert('xss')&lt;/script&gt;`,
    );
  });

  test('can render to string correctly', async () => {
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

    expect(await renderToString(App())).toBe(content(0));
  });

  test('can not fire effects', async () => {
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

    const app = await renderToString(App());

    await sleep(10);
    expect(effectFn).toBeCalledTimes(0);
    expect(app).toBe(replacer);
  });

  test('can render to stream correctly', done => {
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
      done();
    });
  });
});
