import { type DarkElement, component } from '@dark-engine/core';

import { createBrowserEnv, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { useMatch, type Match } from './use-match';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/use-match', () => {
  test('works correctly by default', () => {
    let history: RouterHistory = null;
    let match: Match = null;
    const routes: Routes = [
      {
        path: '',
        component: component(() => {
          history = useHistory();
          match = useMatch();

          return <div>root</div>;
        }),
      },
      {
        path: 'second/:id',
        component: component(() => {
          match = useMatch();

          return <div>second</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    expect(match).toBeTruthy();
    expect(match.path).toBe('');
    expect(match.url).toBe('');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>root</div>"`);

    history.push('/second/10');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('second/:id');
    expect(match.url).toBe('/second/10');
  });

  test('matches routes with different spellings #1', () => {
    let history: RouterHistory = null;
    let match: Match = null;
    const routes: Routes = [
      {
        path: '/first/',
        component: component(() => {
          match = useMatch();

          return <div>first</div>;
        }),
      },
      {
        path: '/second/',
        component: component(() => {
          match = useMatch();

          return <div>second</div>;
        }),
      },
      {
        path: '/',
        component: component(() => {
          history = useHistory();
          match = useMatch();

          return <div>root</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    expect(match).toBeTruthy();
    expect(match.path).toBe('');
    expect(match.url).toBe('');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>root</div>"`);

    history.push('/first');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>first</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('first');
    expect(match.url).toBe('/first');

    history.push('/second');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('second');
    expect(match.url).toBe('/second');
  });

  test('matches routes with different spellings #2', () => {
    let history: RouterHistory = null;
    let match: Match = null;
    const routes: Routes = [
      {
        path: '/first',
        component: component(() => {
          match = useMatch();

          return <div>first</div>;
        }),
      },
      {
        path: '/second',
        component: component(() => {
          match = useMatch();

          return <div>second</div>;
        }),
      },
      {
        path: '/',
        component: component(() => {
          history = useHistory();
          match = useMatch();

          return <div>root</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    expect(match).toBeTruthy();
    expect(match.path).toBe('');
    expect(match.url).toBe('');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>root</div>"`);

    history.push('/first/');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>first</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('first');
    expect(match.url).toBe('/first');

    history.push('/second/');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('second');
    expect(match.url).toBe('/second');
  });

  test('matches routes with different spellings #3', () => {
    let history: RouterHistory = null;
    let match: Match = null;
    const routes: Routes = [
      {
        path: 'first/',
        component: component(() => {
          match = useMatch();

          return <div>first</div>;
        }),
      },
      {
        path: '/second/',
        component: component(() => {
          match = useMatch();

          return <div>second</div>;
        }),
      },
      {
        path: '',
        component: component(() => {
          history = useHistory();
          match = useMatch();

          return <div>root</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    expect(match).toBeTruthy();
    expect(match.path).toBe('');
    expect(match.url).toBe('');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>root</div>"`);

    history.push('/first');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>first</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('first');
    expect(match.url).toBe('/first');

    history.push('/second');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second</div>"`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('second');
    expect(match.url).toBe('/second');
  });

  test('matches nested routes correctly', () => {
    let history: RouterHistory = null;
    let match1: Match = null;
    let match2: Match = null;
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => {
          match1 = useMatch();

          return <div>second: {slot}</div>;
        }),
        children: [
          {
            path: 'child',
            component: component(() => {
              match2 = useMatch();

              return <div>child</div>;
            }),
          },
        ],
      },
      {
        path: '',
        component: component(() => {
          history = useHistory();

          return <div>root</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);

    history.push('/second/child');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second: <div>child</div></div>"`);
    expect(match1).toBeTruthy();
    expect(match1.path).toBe('second');
    expect(match1.url).toBe('/second');
    expect(match2).toBeTruthy();
    expect(match2.path).toBe('second/child');
    expect(match2.url).toBe('/second/child');
  });

  test('matches deeply nested routes correctly', () => {
    let history: RouterHistory = null;
    let match1: Match = null;
    let match2: Match = null;
    let match3: Match = null;
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => {
          match1 = useMatch();

          return <div>second: {slot}</div>;
        }),
        children: [
          {
            path: 'child',
            component: component<{ slot: DarkElement }>(({ slot }) => {
              match2 = useMatch();

              return <div>child: {slot}</div>;
            }),
            children: [
              {
                path: 'another',
                component: component(() => {
                  match3 = useMatch();

                  return <div>another</div>;
                }),
              },
            ],
          },
        ],
      },
      {
        path: '',
        component: component(() => {
          history = useHistory();

          return <div>root</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);

    history.push('/second/child/another');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second: <div>child: <div>another</div></div></div>"`);
    expect(match1).toBeTruthy();
    expect(match1.path).toBe('second');
    expect(match1.url).toBe('/second');
    expect(match2).toBeTruthy();
    expect(match2.path).toBe('second/child');
    expect(match2.url).toBe('/second/child');
    expect(match3).toBeTruthy();
    expect(match3.path).toBe('second/child/another');
    expect(match3.url).toBe('/second/child/another');
  });

  test('matches deeply nested routes with parameters correctly', () => {
    let history: RouterHistory = null;
    let match1: Match = null;
    let match2: Match = null;
    let match3: Match = null;
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => {
          match1 = useMatch();

          return <div>second: {slot}</div>;
        }),
        children: [
          {
            path: 'child/:id',
            component: component<{ slot: DarkElement }>(({ slot }) => {
              match2 = useMatch();

              return <div>child: {slot}</div>;
            }),
            children: [
              {
                path: 'another',
                component: component(() => {
                  match3 = useMatch();

                  return <div>another</div>;
                }),
              },
            ],
          },
        ],
      },
      {
        path: '',
        component: component(() => {
          history = useHistory();

          return <div>root</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);

    history.push('/second/child/10/another');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second: <div>child: <div>another</div></div></div>"`);
    expect(match1).toBeTruthy();
    expect(match1.path).toBe('second');
    expect(match1.url).toBe('/second');
    expect(match2).toBeTruthy();
    expect(match2.path).toBe('second/child/:id');
    expect(match2.url).toBe('/second/child/10');
    expect(match3).toBeTruthy();
    expect(match3.path).toBe('second/child/:id/another');
    expect(match3.url).toBe('/second/child/10/another');

    history.push('/second/child/20/another?q=xxx');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>second: <div>child: <div>another</div></div></div>"`);
    expect(match1).toBeTruthy();
    expect(match1.path).toBe('second');
    expect(match1.url).toBe('/second');
    expect(match2).toBeTruthy();
    expect(match2.path).toBe('second/child/:id');
    expect(match2.url).toBe('/second/child/20');
    expect(match3).toBeTruthy();
    expect(match3.path).toBe('second/child/:id/another');
    expect(match3.url).toBe('/second/child/20/another');
  });
});
