import { component, useState } from '@dark-engine/core';

import { createBrowserEnv, createBrowserHydrateEnv, replacer } from '@test-utils';
import { hydrateRoot } from '../hydrate-root';
import { Metatags } from './metatags';

let { host, render } = createBrowserEnv();
const { head, body } = document;

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  head.innerHTML = '';
  body.innerHTML = '';
});

describe('@platform-browser/metatags', () => {
  test(`doesn't render slot`, () => {
    const App = component<{ title: string }>(({ title }) => {
      return (
        <Metatags>
          <title>{title}</title>
        </Metatags>
      );
    });

    render(<App title='Hello' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<!--dark:matter-->"`);
  });

  test('can update tags correctly', () => {
    head.innerHTML = `<title>...</title><meta name="description" content="...">`;
    const App = component<{ title: string }>(({ title }) => {
      return (
        <Metatags>
          <title>{title}</title>
          <meta name='description' content={`Description for ${title}`} />
        </Metatags>
      );
    });

    render(<App title='Hello' />);
    expect(head.innerHTML).toMatchInlineSnapshot(
      `"<title>Hello</title><meta name="description" content="Description for Hello">"`,
    );

    render(<App title='World' />);
    expect(head.innerHTML).toMatchInlineSnapshot(
      `"<title>World</title><meta name="description" content="Description for World">"`,
    );
  });

  test('can hydrate app correctly #1', () => {
    head.innerHTML = `<title>Hello</title>`;
    let setTitle: (x: string) => void = null;
    const { host, hydrate } = createBrowserHydrateEnv(`<div>${replacer}</div>`);
    const App = component(() => {
      const [title, _setTitle] = useState('Hello');

      setTitle = _setTitle;

      return (
        <div>
          <Metatags>
            <title>{title}</title>
          </Metatags>
        </div>
      );
    });

    hydrate(<App />);
    expect(head.innerHTML).toMatchInlineSnapshot(`"<title>Hello</title>"`);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div><!--dark:matter--></div>"`);

    setTitle('World');
    expect(head.innerHTML).toMatchInlineSnapshot(`"<title>World</title>"`);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div><!--dark:matter--></div>"`);
  });

  test('can hydrate app correctly #2', () => {
    head.innerHTML = `<title>Hello</title>`;
    body.innerHTML = `<div>App</div>${replacer}`;
    let setTitle: (x: string) => void = null;
    const App = component(() => {
      const [title, _setTitle] = useState('Hello');

      setTitle = _setTitle;

      return (
        <html>
          <head>
            <title>Hello</title>
          </head>
          <body>
            <div>App</div>
            <Metatags>
              <title>{title}</title>
            </Metatags>
          </body>
        </html>
      );
    });

    const root = hydrateRoot(document, <App />);

    expect(head.innerHTML).toMatchInlineSnapshot(`"<title>Hello</title>"`);
    expect(body.innerHTML).toMatchInlineSnapshot(`"<div>App</div><!--dark:matter-->"`);

    setTitle('World');
    expect(head.innerHTML).toMatchInlineSnapshot(`"<title>World</title>"`);
    expect(body.innerHTML).toMatchInlineSnapshot(`"<div>App</div><!--dark:matter-->"`);

    root.unmount();
  });
});
