/** @jsx h */
import { Routes } from './types';
import { createRoutes, renderRoot, match } from './create-routes';

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
});
