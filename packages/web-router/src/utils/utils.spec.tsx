/** @jsx h */
import { createRoutes } from '../create-routes';
import { match } from './utils';

describe('[router/utils]', () => {
  test('can match simple routes correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/home',
          render: () => null,
        },
        {
          path: '/contacts',
          render: () => null,
        },
      ],
    });

    expect(match('/', routes).path).toBe('/');
    expect(match('', routes).path).toBe('/');
    expect(match('/home', routes).path).toBe('/home');
    expect(match('/contacts', routes).path).toBe('/contacts');
    expect(match('/tabs/unexpected/route', routes).path).toBe('/');
    expect(match('/unexpected/route', routes).path).toBe('/');
    expect(match('unexpected/route', routes).path).toBe('/');
  });

  test('can match simple routes with fallbacks correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/home',
          render: () => null,
        },
        {
          path: '/contacts',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/', routes).path).toBe('/404');
    expect(match('', routes).path).toBe('/404');
    expect(match('/home', routes).path).toBe('/home');
    expect(match('/contacts', routes).path).toBe('/contacts');
    expect(match('/home/unexpected/route', routes).path).toBe('/404');
    expect(match('/unexpected/route', routes).path).toBe('/404');
    expect(match('unexpected/route', routes).path).toBe('/404');
  });

  test('can match root correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/home',
          render: () => null,
        },
        {
          path: '/contacts',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/', routes).path).toBe('/');
    expect(match('', routes).path).toBe('/');
    expect(match('/home', routes).path).toBe('/home');
    expect(match('/contacts', routes).path).toBe('/contacts');
    expect(match('/home/unexpected/route', routes).path).toBe('/404');
    expect(match('/unexpected/route', routes).path).toBe('/404');
    expect(match('unexpected/route', routes).path).toBe('/404');
  });

  test('can match nested routes correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/tabs',
          render: () => null,
          routes: {
            schema: [
              {
                path: 'home',
                render: () => null,
              },
              {
                path: 'contacts',
                render: () => null,
              },
            ],
          },
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/', routes).path).toBe('/');
    expect(match('', routes).path).toBe('/');
    expect(match('/tabs', routes).path).toBe('/tabs');
    expect(match('/tabs1', routes).path).toBe('/404');
    expect(match('/1tabs', routes).path).toBe('/404');
    expect(match('/tabs/1', routes).path).toBe('/404');
    expect(match('/tabs/home', routes).path).toBe('/tabs/home');
    expect(match('/tabs/home/', routes).path).toBe('/tabs/home');
    expect(match('/tabs/home/1', routes).path).toBe('/404');
    expect(match('/tabs/contacts/', routes).path).toBe('/tabs/contacts');
    expect(match('/settings', routes).path).toBe('/settings');
  });

  test('can match nested routes with nested fallbacks correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/tabs',
          render: () => null,
          routes: {
            schema: [
              {
                path: 'home',
                render: () => null,
              },
              {
                path: 'contacts',
                render: () => null,
              },
            ],
            fallback: {
              path: 'nested-404',
              render: () => null,
            },
          },
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/', routes).path).toBe('/');
    expect(match('', routes).path).toBe('/');
    expect(match('/tabs', routes).path).toBe('/tabs');
    expect(match('/tabs1', routes).path).toBe('/404');
    expect(match('/1tabs', routes).path).toBe('/404');
    expect(match('/tabs/1', routes).path).toBe('/tabs/nested-404');
    expect(match('/tabs/home', routes).path).toBe('/tabs/home');
    expect(match('/tabs/home/', routes).path).toBe('/tabs/home');
    expect(match('/tabs/home1/', routes).path).toBe('/tabs/nested-404');
    expect(match('/tabs/home/1', routes).path).toBe('/tabs/nested-404');
    expect(match('/tabs/home/unexpeceted/route', routes).path).toBe('/tabs/nested-404');
    expect(match('/tabs/contacts/', routes).path).toBe('/tabs/contacts');
    expect(match('/tabs/contacts', routes).path).toBe('/tabs/contacts');
    expect(match('/tabs/contacts/', routes).path).toBe('/tabs/contacts');
    expect(match('/tabs/contacts1/', routes).path).toBe('/tabs/nested-404');
    expect(match('/tabs/contacts/1', routes).path).toBe('/tabs/nested-404');
    expect(match('/tabs/home/unexpeceted/route', routes).path).toBe('/tabs/nested-404');
    expect(match('/settings', routes).path).toBe('/settings');
  });

  test('can match deeply nested routes correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/tabs',
          render: () => null,
          routes: {
            schema: [
              {
                path: 'home',
                render: () => null,
                routes: {
                  schema: [
                    {
                      path: 'dashboard',
                      render: () => null,
                    },
                    {
                      path: 'profile',
                      render: () => null,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/', routes).path).toBe('/');
    expect(match('', routes).path).toBe('/');
    expect(match('/tabs', routes).path).toBe('/tabs');
    expect(match('/tabs/home', routes).path).toBe('/tabs/home');
    expect(match('/tabs/home/dashboard', routes).path).toBe('/tabs/home/dashboard');
    expect(match('/tabs/home/dashboard1', routes).path).toBe('/404');
    expect(match('/tabs/home/dashboard/1', routes).path).toBe('/404');
    expect(match('/tabs/home/dashboard1/1', routes).path).toBe('/404');
    expect(match('/tabs/home/1dashboard1/1', routes).path).toBe('/404');
    expect(match('/tabs/home/profile', routes).path).toBe('/tabs/home/profile');
    expect(match('/settings', routes).path).toBe('/settings');
  });

  test('can match params correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/profile/:id',
          render: () => null,
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/profile', routes).path).toBe('/404');
    expect(match('/profile/1', routes).path).toBe('/profile/:id');
    expect(match('/profile/1', routes).params).toEqual(['1']);
    expect(match('/profile/20', routes).path).toBe('/profile/:id');
    expect(match('/profile/20', routes).params).toEqual(['20']);
    expect(match('/profile/20/nested', routes).path).toBe('/404');
    expect(match('/settings', routes).path).toBe('/settings');
  });

  test('can match multiple params correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/profile/:id/photo/:id/deep/comment/:id',
          render: () => null,
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/profile', routes).path).toBe('/404');
    expect(match('/profile/1/photo/2/deep/comment/3', routes).path).toBe('/profile/:id/photo/:id/deep/comment/:id');
    expect(match('/profile/1/photo/2/deep/comment/3', routes).params).toEqual(['1', '2', '3']);
    expect(match('/profile/1/photo/2/broken/comment/3', routes).path).toBe('/404');
  });

  test('can match multiple params with nested routes correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/profile/:id',
          render: () => null,
          routes: {
            schema: [
              {
                path: 'photo/:id',
                render: () => null,
                routes: {
                  schema: [
                    {
                      path: 'deep/comment/:id',
                      render: () => null,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/profile', routes).path).toBe('/404');
    expect(match('/profile/1/photo/2/deep/comment/3', routes).path).toBe('/profile/:id/photo/:id/deep/comment/:id');
    expect(match('/profile/1', routes).params).toEqual(['1']);
    expect(match('/profile/1/photo/2', routes).params).toEqual(['2']);
    expect(match('/profile/1/photo/2/deep/comment/3', routes).params).toEqual(['3']);
    expect(match('/profile/1/photo/2/broken/comment/3', routes).path).toBe('/404');
  });

  test('can match multiple params with nested routes and nested fallbacks correctly', () => {
    const routes = createRoutes({
      schema: [
        {
          path: '/',
          render: () => null,
        },
        {
          path: '/profile/:id',
          render: () => null,
          routes: {
            schema: [
              {
                path: 'photo/:id',
                render: () => null,
                routes: {
                  schema: [
                    {
                      path: 'comment/:id',
                      render: () => null,
                    },
                  ],
                  fallback: {
                    path: 'photo-nested-404',
                    render: () => null,
                  },
                },
              },
            ],
            fallback: {
              path: 'profile-nested-404',
              render: () => null,
            },
          },
        },
        {
          path: '/settings',
          render: () => null,
        },
      ],
      fallback: {
        path: '/404',
        render: () => null,
      },
    });

    expect(match('/profile/1/photo/2', routes).path).toBe('/profile/:id/photo/:id');
    expect(match('/profile/1/photo/2/comment/3', routes).path).toBe('/profile/:id/photo/:id/comment/:id');

    expect(match('/profile/1/photo/2/comment3', routes).path).toBe('/profile/:id/profile-nested-404');
    expect(match('/profile/1/photo/2/comment/3/broken', routes).path).toBe('/profile/:id/profile-nested-404');
    expect(match('/profile/1/photo2', routes).path).toBe('/profile/:id/profile-nested-404');
    expect(match('/profile/1/photo/2/broken', routes).path).toBe('/profile/:id/profile-nested-404');
  });
});
