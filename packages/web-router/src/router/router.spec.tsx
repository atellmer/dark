/** @jsx h */
import { type DarkElement, type MutableRef, h, component, useRef } from '@dark-engine/core';

import { createBrowserEnv, replacer, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { type RouterRef, Router } from './router';

type AppProps = {
  url: string;
};

let { host, render: $render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render: $render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

const render = (element: DarkElement) => {
  $render(element);
  jest.runAllTimers();
};

describe('@web-router/router', () => {
  test('can render simple routes correctly', () => {
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
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render incorrect routes correctly', () => {
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
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/xxx' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second1' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/second/1' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/first/1/xxx' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/some/broken/url' />);
    expect(host.innerHTML).toBe(replacer);
  });

  test('can render nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
        ],
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<second>${replacer}</second>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    render(<App url='/second/b/some/broken/route' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component<{ slot: DarkElement }>(({ slot }) => <a>{slot}</a>),
            children: [
              {
                path: '1',
                component: component(() => <div>1</div>),
              },
              {
                path: '2',
                component: component(() => <div>2</div>),
              },
            ],
          },
          {
            path: 'b',
            component: component<{ slot: DarkElement }>(({ slot }) => <b>{slot}</b>),
            children: [
              {
                path: '1',
                component: component(() => <div>1</div>),
              },
              {
                path: '2',
                component: component(() => <div>2</div>),
              },
            ],
          },
        ],
      },
      {
        path: 'third',
        component: () => <div>third</div>,
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<second>${replacer}</second>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><a>${replacer}</a></second>`);

    render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<second><a><div>1</div></a></second>`);

    render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<second><a><div>2</div></a></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    render(<App url='/second/b/1' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/2' />);
    expect(host.innerHTML).toBe(`<second><b><div>2</div></b></second>`);
  });

  test('can work with redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can work with chained redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        redirectTo: 'third',
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        component: component(() => <div>fourth</div>),
      },
    ];
    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    render(<App url='/fourth' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);
  });

  test('can work with redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            redirectTo: 'b',
          },
          {
            path: 'b',
            redirectTo: 'c',
          },
          {
            path: 'c',
            component: component(() => <div>c</div>),
          },
        ],
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        component: component(() => <div>fourth</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    render(<App url='/second/c' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);
  });

  test('can work with root redirect correctly #1', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: '',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can work with root redirect correctly #2', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => <div>root</div>),
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
        redirectTo: '',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    render(<App url='' />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    render(<App url='/broken' />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can work with root redirect with full path strategy correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: '/',
        redirectTo: '/first',
        pathMatch: 'full',
      },
    ];
    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can combine match strategies correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: '/second/a',
            redirectTo: '/second/b',
            pathMatch: 'full',
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
        ],
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);
  });

  test('can work with wildcard routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => <div>404</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>404</div>`);
  });

  test('can work with wildcard in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
          {
            path: '**',
            component: component(() => <div>404</div>),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => <div>404</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>404</div></second>`);

    render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>404</div></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>404</div>`);
  });

  test('can combine wildcard routes and redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
          {
            path: '**',
            redirectTo: 'a',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can combine wildcard routes and redirects in deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component<{ slot: DarkElement }>(({ slot }) => <b>{slot}</b>),
            children: [
              {
                path: '1',
                component: component(() => <div>1</div>),
              },
              {
                path: '2',
                component: component(() => <div>2</div>),
              },
              {
                path: '**',
                redirectTo: '1',
              },
            ],
          },
          {
            path: '**',
            redirectTo: 'a',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    render(<App url='/second/b/' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    render(<App url='/second/b/1' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/1/' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/1/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/2/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can work with parameters correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second/:id',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b/:id',
            component: component(() => <div>b</div>),
          },
        ],
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/1/a/' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/2/a/' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/1/b/2' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    render(<App url='/second/100/b/2000' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);
  });

  test('can render flatten tree routes', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second/a/1',
        component: component(() => <div>second/a/1</div>),
      },
      {
        path: 'second/a/2',
        component: component(() => <div>second/a/2</div>),
      },
      {
        path: 'second/a',
        component: component(() => <div>second/a</div>),
      },
      {
        path: 'second/b',
        redirectTo: 'third',
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
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<div>second/a</div>`);

    render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<div>second/a/1</div>`);

    render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<div>second/a/2</div>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render combined tree strategies', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second/a',
        component: component<{ slot: DarkElement }>(({ slot }) => <second:a>{slot}</second:a>),
        children: [
          {
            path: '1',
            component: component(() => <div>1</div>),
          },
          {
            path: '2',
            component: component(() => <div>2</div>),
          },
          {
            path: '',
            redirectTo: '2',
          },
          {
            path: '**',
            redirectTo: '2',
          },
        ],
      },
      {
        path: 'second/b',
        redirectTo: 'third',
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
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second:a><div>2</div></second:a>`);

    render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<second:a><div>1</div></second:a>`);

    render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<second:a><div>2</div></second:a>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render combined roots, wildcards and parameters', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component<{ slot: DarkElement }>(({ slot }) => <first>{slot}</first>),
        children: [
          {
            path: 'nested',
            component: component(() => <div>nested</div>),
          },
          {
            path: ':id',
            component: component(() => <div>:id</div>),
          },
          {
            path: '',
            component: component(() => <div>root</div>),
          },
          {
            path: '**',
            redirectTo: '',
          },
        ],
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
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);

    render(<App url='/first/666' />);
    expect(host.innerHTML).toBe(`<first><div>:id</div></first>`);

    render(<App url='/first/666/broken' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);
  });

  test('a history updates correctly with wildcard routing', () => {
    let routerRef: MutableRef<RouterRef> = null;
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
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => <div>404</div>),
      },
    ];

    const App = component(() => {
      routerRef = useRef<RouterRef>(null);

      return (
        <Router ref={routerRef} routes={routes}>
          {slot => slot}
        </Router>
      );
    });

    render(<App />);

    routerRef.current.navigateTo('/broken/');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>404</div>`);
    expect(location.href).toBe('http://localhost/broken/');
  });
});
