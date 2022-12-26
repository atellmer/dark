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

    expect(renderRoot('/first', routes$)[0].cursor.fullPath).toBe('/first/');
    expect(renderRoot('/first/', routes$)[0].cursor.fullPath).toBe('/first/');
    expect(renderRoot('/second', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/second/', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/third', routes$)[0].cursor.fullPath).toBe('/third/');
    expect(renderRoot('/third/', routes$)[0].cursor.fullPath).toBe('/third/');
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

    expect(renderRoot('/', routes$)[0]).toBe(null);
    expect(renderRoot('', routes$)[0]).toBe(null);
    expect(renderRoot('/xxx', routes$)[0]).toBe(null);
    expect(renderRoot('/second1', routes$)[0]).toBe(null);
    expect(renderRoot('/second/1', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/first/1/xxx', routes$)[0].cursor.fullPath).toBe('/first/');
    expect(renderRoot('/some/broken/url', routes$)[0]).toBe(null);
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

    expect(renderRoot('/first', routes$)[0].cursor.fullPath).toBe('/first/');
    expect(renderRoot('/second', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/child-b', routes$)[0].cursor.fullPath).toBe('/second/child-b/');
    expect(renderRoot('/second/child-b/some/broken/route', routes$)[0].cursor.fullPath).toBe('/second/child-b/');
    expect(renderRoot('/third', routes$)[0].cursor.fullPath).toBe('/third/');
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

    expect(renderRoot('/first', routes$)[0].cursor.fullPath).toBe('/first/');
    expect(renderRoot('/second', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/third', routes$)[0].cursor.fullPath).toBe('/third/');
    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/child-a/child-a-1', routes$)[0].cursor.fullPath).toBe('/second/child-a/child-a-1/');
    expect(renderRoot('/second/child-a/child-a-2', routes$)[0].cursor.fullPath).toBe('/second/child-a/child-a-2/');
    expect(renderRoot('/second/child-b', routes$)[0].cursor.fullPath).toBe('/second/child-b/');
    expect(renderRoot('/second/child-b/child-b-1', routes$)[0].cursor.fullPath).toBe('/second/child-b/child-b-1/');
    expect(renderRoot('/second/child-b/child-b-2', routes$)[0].cursor.fullPath).toBe('/second/child-b/child-b-2/');
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

    expect(renderRoot('/first', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/second', routes$)[0].cursor.fullPath).toBe('/second/');
    expect(renderRoot('/third', routes$)[0].cursor.fullPath).toBe('/third/');
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

    expect(renderRoot('/first', routes$)[0].cursor.fullPath).toBe('/fourth/');
    expect(renderRoot('/second', routes$)[0].cursor.fullPath).toBe('/fourth/');
    expect(renderRoot('/third', routes$)[0].cursor.fullPath).toBe('/fourth/');
    expect(renderRoot('/fourth', routes$)[0].cursor.fullPath).toBe('/fourth/');
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

    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-c/');
    expect(renderRoot('/second/child-b', routes$)[0].cursor.fullPath).toBe('/second/child-c/');
    expect(renderRoot('/second/child-c', routes$)[0].cursor.fullPath).toBe('/second/child-c/');
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

    expect(renderRoot('/', routes$)[0].cursor.fullPath).toBe('/first/');
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

    expect(renderRoot('/', routes$)[0].cursor.fullPath).toBe('/first/');
  });

  test('can combine match strategies correctly', () => {
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

    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-b/');
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

    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/broken/url', routes$)[0].cursor.fullPath).toBe('/**/');
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

    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/broken/url', routes$)[0].cursor.fullPath).toBe('/second/**/');
    expect(renderRoot('/second/child-a/broken/url', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/broken/url', routes$)[0].cursor.fullPath).toBe('/**/');
  });

  test('can combine wildcard routes and redirects in nested routes correctly', () => {
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

    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/broken/url', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/child-a/broken/url', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/broken/url', routes$)[0].cursor.fullPath).toBe('/first/');
  });

  test('can combine wildcard routes and redirects in deeply nested routes correctly', () => {
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

    expect(renderRoot('/second/child-a', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/broken/url', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/child-a/broken/url', routes$)[0].cursor.fullPath).toBe('/second/child-a/');
    expect(renderRoot('/second/child-b/broken/url', routes$)[0].cursor.fullPath).toBe('/second/child-b/child-b-1/');
    expect(renderRoot('/second/child-b/child-b-1/broken/url', routes$)[0].cursor.fullPath).toBe(
      '/second/child-b/child-b-1/',
    );
    expect(renderRoot('/second/child-b/child-b-2/broken/url', routes$)[0].cursor.fullPath).toBe(
      '/second/child-b/child-b-2/',
    );
    expect(renderRoot('/broken/url', routes$)[0].cursor.fullPath).toBe('/first/');
  });

  test('can work with parameters correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        render: () => null,
      },
      {
        path: 'second/:id',
        render: () => null,
        children: [
          {
            path: 'child-a',
            render: () => null,
          },
          {
            path: 'child-b/:id',
            render: () => null,
          },
        ],
      },
    ];
    const routes$ = createRoutes(routes);

    expect(renderRoot('/second/1/child-a', routes$)[0].cursor.fullPath).toBe('/second/:id/child-a/');
    expect(renderRoot('/second/2/child-a', routes$)[0].cursor.fullPath).toBe('/second/:id/child-a/');
    expect(renderRoot('/second/1/child-b/2', routes$)[0].cursor.fullPath).toBe('/second/:id/child-b/:id/');
    expect(renderRoot('/second/100/child-b/2000', routes$)[0].cursor.fullPath).toBe('/second/:id/child-b/:id/');
  });
});
