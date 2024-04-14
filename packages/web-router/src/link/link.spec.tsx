import { component } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';

import { createBrowserEnv, click, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { Link } from './link';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/link', () => {
  test('can navigate by routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        component: component(() => null),
      },
    ];

    const App = component(() => {
      return (
        <Router routes={routes}>
          {slot => {
            return (
              <>
                <header>
                  <Link to='/first'>first</Link>
                  <Link to='/second'>second</Link>
                  <Link to='/third'>third</Link>
                </header>
                <main>{slot}</main>
              </>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third">third</a></header><main><!--dark:matter--></main>"`,
    );

    const link1 = host.querySelector('a[href="/first"]');
    const link2 = host.querySelector('a[href="/second"]');
    const link3 = host.querySelector('a[href="/third"]');

    click(link1);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third">third</a></header><main><div>first</div></main>"`,
    );

    click(link1);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third">third</a></header><main><div>first</div></main>"`,
    );

    click(link2);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third">third</a></header><main><div>second</div></main>"`,
    );

    click(link3);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third">third</a></header><main><div>third</div></main>"`,
    );
  });

  test('can work with custom classes correctly', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => null),
      },
    ];

    const App = component(() => {
      return (
        <Router routes={routes}>
          {() => {
            return (
              <Link to='/' className='my-link'>
                first
              </Link>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<a href="/" class="my-link">first</a>"`);
  });

  test('prevent default click event', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => null),
      },
    ];

    let defaultPrevented = false;

    const App = component(() => {
      const handleClick = (e: SyntheticEvent<MouseEvent>) => {
        defaultPrevented = e.sourceEvent.defaultPrevented;
      };

      return (
        <Router routes={routes}>
          {() => {
            return (
              <Link to='/' onClick={handleClick}>
                first
              </Link>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<a href="/">first</a>"`);

    click(host.querySelector('a'));
    expect(defaultPrevented).toBe(true);
  });
});
