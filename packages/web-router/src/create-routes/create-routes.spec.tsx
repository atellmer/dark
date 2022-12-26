/** @jsx h */
import { Routes } from './types';
import { createRoutes, renderRoot } from './create-routes';

describe('[router/create-routes]', () => {
  test('can match simple routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
      },
      {
        path: 'third',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/first', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
    renderRoot('/first/', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
    renderRoot('/second', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/second/', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/third', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/third/');
    });
    renderRoot('/third/', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/third/');
    });
  });

  test('can match incorrect routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
      },
      {
        path: 'third',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/', routes$, matched => {
      expect(matched).toBe(null);
    });
    renderRoot('', routes$, matched => {
      expect(matched).toBe(null);
    });
    renderRoot('/xxx', routes$, matched => {
      expect(matched).toBe(null);
    });
    renderRoot('/second1', routes$, matched => {
      expect(matched).toBe(null);
    });
    renderRoot('/second/1', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/first/1/xxx', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
    renderRoot('/some/broken/url', routes$, matched => {
      expect(matched).toBe(null);
    });
  });

  test('can match nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
          },
          {
            path: 'child-b',
            render: () => null,
          },
        ],
      },
      {
        path: 'third',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/first', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
    renderRoot('/second', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/child-b', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/');
    });
    renderRoot('/second/child-b/some/broken/route', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/');
    });
    renderRoot('/third', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/third/');
    });
  });

  test('can match deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
            children: [
              {
                path: 'child-a-1',
                render: () => null,
              },
              {
                path: 'child-a-2',
                render: () => null,
              },
            ],
          },
          {
            path: 'child-b',
            render: () => null,
            children: [
              {
                path: 'child-b-1',
                render: () => null,
              },
              {
                path: 'child-b-2',
                render: () => null,
              },
            ],
          },
        ],
      },
      {
        path: 'third',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/first', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
    renderRoot('/second', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/third', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/third/');
    });
    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/child-a/child-a-1', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/child-a-1/');
    });
    renderRoot('/second/child-a/child-a-2', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/child-a-2/');
    });
    renderRoot('/second/child-b', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/');
    });
    renderRoot('/second/child-b/child-b-1', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/child-b-1/');
    });
    renderRoot('/second/child-b/child-b-2', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/child-b-2/');
    });
  });

  test('can work with redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        render: () => null,
      },
      {
        path: 'third',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/first', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/second', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/');
    });
    renderRoot('/third', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/third/');
    });
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
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/first', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/fourth/');
    });
    renderRoot('/second', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/fourth/');
    });
    renderRoot('/third', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/fourth/');
    });
    renderRoot('/fourth', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/fourth/');
    });
  });

  test('can work with redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            redirectTo: 'child-b',
          },
          {
            path: 'child-b',
            redirectTo: 'child-c',
          },
          {
            path: 'child-c',
            render: () => null,
          },
        ],
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-c/');
    });
    renderRoot('/second/child-b', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-c/');
    });
    renderRoot('/second/child-c', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-c/');
    });
  });

  test('can work with root redirect correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: '',
        redirectTo: 'first',
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
  });

  test('can work with root redirect with full path strategy correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: '/',
        redirectTo: '/first',
        pathMatch: 'full',
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
  });

  test('can work combined path match strategies correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: '/second/child-a',
            redirectTo: '/second/child-b',
            pathMatch: 'full',
          },
          {
            path: 'child-b',
            render: () => null,
          },
        ],
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/');
    });
  });

  test('can work with wildcard routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
          },
          {
            path: 'child-b',
            render: () => null,
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/**/');
    });
  });

  test('can work with wildcard in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
          },
          {
            path: 'child-b',
            render: () => null,
          },
          {
            path: '**',
            render: () => null,
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        render: () => null,
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/**/');
    });
    renderRoot('/second/child-a/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/**/');
    });
  });

  test('can conbine wildcard routes and redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
          },
          {
            path: 'child-b',
            render: () => null,
          },
          {
            path: '**',
            redirectTo: 'child-a',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/child-a/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
  });

  test('can conbine wildcard routes and redirects in deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
          },
          {
            path: 'child-b',
            render: () => null,
            children: [
              {
                path: 'child-b-1',
                render: () => null,
              },
              {
                path: 'child-b-2',
                render: () => null,
              },
              {
                path: '**',
                redirectTo: 'child-b-1',
              },
            ],
          },
          {
            path: '**',
            redirectTo: 'child-a',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];
    const routes$ = createRoutes(routes);

    renderRoot('/second/child-a', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/child-a/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-a/');
    });
    renderRoot('/second/child-b/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/child-b-1/');
    });
    renderRoot('/second/child-b/child-b-1/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/child-b-1/');
    });
    renderRoot('/second/child-b/child-b-2/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/second/child-b/child-b-2/');
    });
    renderRoot('/broken/url', routes$, matched => {
      expect(matched.cursor.fullPath).toBe('/first/');
    });
  });
});
