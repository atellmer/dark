import { component } from '@dark-engine/core';

import { Routes } from './types';
import { createRoutes, resolve } from './create-routes';

describe('@web-router/create-routes', () => {
  test('can match simple routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/first', $routes).path).toBe('first');
    expect(resolve('/first/', $routes).path).toBe('first');
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/second/', $routes).path).toBe('second');
    expect(resolve('/third', $routes).path).toBe('third');
    expect(resolve('/third/', $routes).path).toBe('third');
  });

  test('can match incorrect routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(() => resolve('/', $routes)).toThrowError();
    expect(() => resolve('', $routes)).toThrowError();
    expect(() => resolve('/xxx', $routes)).toThrowError();
    expect(resolve('/second', $routes).path).toBe('second');
    expect(() => resolve('/second/1', $routes)).toThrowError();
    expect(() => resolve('/first/1/xxx', $routes)).toThrowError();
    expect(() => resolve('/some/broken/url', $routes)).toThrowError();
    expect(resolve('/first', $routes).path).toBe('first');
  });

  test('can match nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
          },
          {
            path: 'b',
            component: component(() => null),
          },
        ],
      },
      {
        path: 'third',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/first', $routes).path).toBe('first');
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/second/b', $routes).path).toBe('second/b');
    expect(() => resolve('/second/b/some/broken/route', $routes)).toThrowError();
    expect(resolve('/third', $routes).path).toBe('third');
  });

  test('can match deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
            children: [
              {
                path: '1',
                component: component(() => null),
              },
              {
                path: '2',
                component: component(() => null),
              },
            ],
          },
          {
            path: 'b',
            component: component(() => null),
            children: [
              {
                path: '1',
                component: component(() => null),
              },
              {
                path: '2',
                component: component(() => null),
              },
            ],
          },
        ],
      },
      {
        path: 'third',
        component: () => null,
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/first', $routes).path).toBe('first');
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/third', $routes).path).toBe('third');
    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/second/a/1', $routes).path).toBe('second/a/1');
    expect(resolve('/second/a/2', $routes).path).toBe('second/a/2');
    expect(resolve('/second/b', $routes).path).toBe('second/b');
    expect(resolve('/second/b/1', $routes).path).toBe('second/b/1');
    expect(resolve('/second/b/2', $routes).path).toBe('second/b/2');
  });

  test('can work with redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/first', $routes).path).toBe('second');
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/third', $routes).path).toBe('third');
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
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/first', $routes).path).toBe('fourth');
    expect(resolve('/second', $routes).path).toBe('fourth');
    expect(resolve('/third', $routes).path).toBe('fourth');
    expect(resolve('/fourth', $routes).path).toBe('fourth');
  });

  test('can work with redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: component(() => null),
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
            component: component(() => null),
          },
        ],
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/second/a', $routes).path).toBe('second/c');
    expect(resolve('/second/b', $routes).path).toBe('second/c');
    expect(resolve('/second/c', $routes).path).toBe('second/c');
  });

  test('can work with root redirect correctly #1', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: '',
        redirectTo: 'first',
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe('first');
  });

  test('can work with root redirect correctly #2', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe('');
    expect(resolve('', $routes).path).toBe('');
    expect(resolve('/broken', $routes).path).toBe('');
    expect(resolve('/second', $routes).path).toBe(`second`);
    expect(resolve('/third', $routes).path).toBe(`third`);
  });

  test('can work with root redirect with full path strategy correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: '/',
        redirectTo: '/first',
        pathMatch: 'full',
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe('first');
  });

  test('can combine match strategies correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: '/second/a',
            redirectTo: '/second/b',
            pathMatch: 'full',
          },
          {
            path: 'b',
            component: component(() => null),
          },
        ],
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/second/a', $routes).path).toBe('second/b');
  });

  test('can work with wildcard routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
          },
          {
            path: 'b',
            component: component(() => null),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe('first');
    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/broken/url', $routes).path).toBe('**');
  });

  test('can work with wildcard in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
          },
          {
            path: 'b',
            component: component(() => null),
          },
          {
            path: '**',
            component: component(() => null),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => null),
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/second/broken/url', $routes).path).toBe('second/**');
    expect(resolve('/second/a/broken/url', $routes).path).toBe('second/**');
    expect(resolve('/broken/url', $routes).path).toBe('**');
  });

  test('can combine wildcard routes and redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
          },
          {
            path: 'b',
            component: component(() => null),
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
    const $routes = createRoutes(routes);

    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/second/broken/url', $routes).path).toBe('second/a');
    expect(resolve('/second/a/broken/url', $routes).path).toBe('second/a');
    expect(resolve('/broken/url', $routes).path).toBe('first');
  });

  test('can combine wildcard routes and redirects in deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
          },
          {
            path: 'b',
            component: component(() => null),
            children: [
              {
                path: '1',
                component: component(() => null),
              },
              {
                path: '2',
                component: component(() => null),
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
    const $routes = createRoutes(routes);

    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/second/broken/url', $routes).path).toBe('second/a');
    expect(resolve('/second/a/broken/url', $routes).path).toBe('second/a');
    expect(resolve('/second/b/broken/url', $routes).path).toBe('second/b/1');
    expect(resolve('/second/b', $routes).path).toBe('second/b');
    expect(resolve('/second/b/', $routes).path).toBe('second/b');
    expect(resolve('/second/b/1', $routes).path).toBe('second/b/1');
    expect(resolve('/second/b/1/', $routes).path).toBe('second/b/1');
    expect(resolve('/second/b/1/broken/url', $routes).path).toBe('second/b/1');
    expect(resolve('/second/b/2/broken/url', $routes).path).toBe('second/b/1');
    expect(resolve('/broken/url', $routes).path).toBe('first');
  });

  test('can work with parameters correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second/:id',
        component: component(() => null),
        children: [
          {
            path: 'a',
            component: component(() => null),
          },
          {
            path: 'b/:id',
            component: component(() => null),
          },
        ],
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/second/1/a', $routes).path).toBe('second/:id/a');
    expect(resolve('/second/2/a', $routes).path).toBe('second/:id/a');
    expect(resolve('/second/1/b/2', $routes).path).toBe('second/:id/b/:id');
    expect(resolve('/second/100/b/2000', $routes).path).toBe('second/:id/b/:id');
  });

  test('can redirect to any level correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second',
        component: component(() => null),
        children: [
          {
            path: 'child-a',
            component: component(() => null),
            children: [
              {
                path: '/second/child-a/1',
                redirectTo: '/first',
                pathMatch: 'full',
              },
              {
                path: '2',
                component: component(() => null),
              },
            ],
          },
          {
            path: 'child-b',
            component: component(() => null),
          },
        ],
      },
      {
        path: 'third',
        component: component(() => null),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/second/child-a/1/', $routes).path).toBe('first');
  });

  test('can work with flatten tree routes', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second/a/1',
        component: component(() => null),
      },
      {
        path: 'second/a/2',
        component: component(() => null),
      },
      {
        path: 'second/a',
        component: component(() => null),
      },
      {
        path: 'second/b',
        redirectTo: 'third',
      },
      {
        path: 'second',
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe('first');
    expect(resolve('/first', $routes).path).toBe('first');
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/second/a', $routes).path).toBe('second/a');
    expect(resolve('/second/a/1', $routes).path).toBe('second/a/1');
    expect(resolve('/second/a/2', $routes).path).toBe('second/a/2');
    expect(resolve('/second/b', $routes).path).toBe('third');
    expect(resolve('/third/', $routes).path).toBe('third');
  });

  test('can work with combined tree strategies', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
      },
      {
        path: 'second/a',
        component: component(() => null),
        children: [
          {
            path: '1',
            component: component(() => null),
          },
          {
            path: '2',
            component: component(() => null),
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
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe('first');
    expect(resolve('/first', $routes).path).toBe('first');
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/second/a', $routes).path).toBe('second/a/2');
    expect(resolve('/second/a/1', $routes).path).toBe('second/a/1');
    expect(resolve('/second/a/2', $routes).path).toBe('second/a/2');
    expect(resolve('/second/b', $routes).path).toBe('third');
    expect(resolve('/third/', $routes).path).toBe('third');
  });

  test('can work with combined roots, wildcards and parameters', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => null),
        children: [
          {
            path: 'nested',
            component: component(() => null),
          },
          {
            path: ':id',
            component: component(() => null),
          },
          {
            path: '',
            component: component(() => null),
          },
          {
            path: '**',
            redirectTo: '',
          },
        ],
      },
      {
        path: 'second',
        component: component(() => null),
      },
      {
        path: 'third',
        component: component(() => null),
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
    const $routes = createRoutes(routes);

    expect(resolve('/', $routes).path).toBe(`first`);
    expect(resolve('/first', $routes).path).toBe(`first`);
    expect(resolve('/first/nested', $routes).path).toBe('first/nested');
    expect(resolve('/first/666', $routes).path).toBe(`first/:id`);
    expect(resolve('/first/666/broken', $routes).path).toBe(`first`);
    expect(resolve('/second', $routes).path).toBe('second');
    expect(resolve('/third/', $routes).path).toBe('third');
    expect(resolve('/broken/url', $routes).path).toBe(`first`);
  });
});
