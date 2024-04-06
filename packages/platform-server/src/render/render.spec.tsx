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
import { dom, sleep, replacer, convertStreamToPromise } from '@test-utils';

import { renderToString, renderToStream } from './render';

describe('@platform-server/render', () => {
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

    expect(await renderToString(<App />)).toBe(content(0));
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
    const app = await renderToString(<App />);

    await sleep(10);
    expect(effectFn).toBeCalledTimes(0);
    expect(app).toBe(replacer);
  });

  test('can render to stream correctly via bootstrapScripts', done => {
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
    const stream = renderToStream(<App />, { bootstrapScripts: ['./build.js'] });

    stream.on('data', chunk => {
      data += chunk;
    });

    stream.on('end', () => {
      expect(data).toBe(content(0));
      done();
    });
  });

  test('can render to stream correctly via bootstrapModules', done => {
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
          <script type="module" src="./index.js" defer></script>
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
    const stream = renderToStream(<App />, { bootstrapModules: ['./index.js'] });

    stream.on('data', chunk => {
      data += chunk;
    });

    stream.on('end', () => {
      expect(data).toBe(content(0));
      done();
    });
  });

  test('can render dangerous html content via renderToString', async () => {
    const App = component(() => {
      return (
        <div>
          <div>header</div>
          <div __danger={`<p>inner html</p>`}></div>
          <div>footer</div>
        </div>
      );
    });
    const content = await renderToString(<App />);

    expect(content).toMatchInlineSnapshot(
      `"<div><div>header</div><div><p>inner html</p></div><div>footer</div></div>"`,
    );
  });

  test('can render dangerous html content via renderToStream', async () => {
    const App = component(() => {
      return (
        <div>
          <div>header</div>
          <div __danger={`<p>inner html</p>`}></div>
          <div>footer</div>
        </div>
      );
    });
    const content = await convertStreamToPromise(renderToStream(<App />));

    expect(content).toMatchInlineSnapshot(
      `"<!DOCTYPE html><div><div>header</div><div><p>inner html</p></div><div>footer</div></div>"`,
    );
  });

  test('throws an error when an element with dangerous content has child elements via renderToString', async () => {
    const App = component(() => {
      return <div __danger={`<p>inner html</p>`}>1</div>;
    });

    try {
      await renderToString(<App />);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  test('throws an error when an element with dangerous content has child elements via renderToStream', async () => {
    const App = component(() => {
      return <div __danger={`<p>inner html</p>`}>1</div>;
    });

    try {
      await convertStreamToPromise(renderToStream(<App />));
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
