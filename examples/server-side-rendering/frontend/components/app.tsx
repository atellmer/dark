import { h, component, Fragment, Suspense, lazy, useMemo, useEffect } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';
import { DataClient, DataClientProvider, InMemoryCache } from '@dark-engine/data';

import { GlobalStyle, Spinner, Root, Header, Menu, Content } from './ui';
import { type Api } from '../../contract';
import { detectIsBrowser, setItem } from '../utils';
import { Key } from '../api';

const routes: Routes = [
  {
    path: 'products',
    component: lazy(() => import('./products')),
    children: [
      {
        path: 'list',
        component: lazy(() => import('./product-list')),
        children: [
          {
            path: 'add',
            component: lazy(() => import('./product-add')),
          },
          {
            path: ':id',
            component: lazy(() => import('./product-card')),
            children: [
              {
                path: 'edit',
                component: lazy(() => import('./product-edit')),
              },
              {
                path: 'remove',
                component: lazy(() => import('./product-remove')),
              },
            ],
          },
        ],
      },
      {
        path: 'analytics',
        component: lazy(() => import('./product-analytics')),
      },
      {
        path: 'balance',
        component: lazy(() => import('./product-balance')),
      },
      {
        path: '',
        redirectTo: 'list',
      },
      {
        path: '**',
        redirectTo: 'list',
      },
    ],
  },
  {
    path: 'operations',
    component: lazy(() => import('./operations')),
  },
  {
    path: 'invoices',
    component: lazy(() => import('./invoices')),
  },
  {
    path: '',
    redirectTo: 'products',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];

export type AppProps = {
  url?: string;
  api: Api;
};

const App = component<AppProps>(({ url, api }) => {
  const client = useMemo(() => {
    const client = new DataClient<Api, Key>({ api, cache: new InMemoryCache() });

    if (detectIsBrowser()) {
      client.subscribe(({ key, record }) => {
        if (key === Key.FETCH_PRODUCTS && record.data) {
          setItem(key, record.data);
        }
      });
    }

    return client;
  }, []);

  useEffect(() => {
    client.monitor(x => console.log(x));
  }, []);

  return (
    <>
      <GlobalStyle />
      <DataClientProvider client={client}>
        <Router routes={routes} url={url}>
          {slot => {
            return (
              <Suspense fallback={<Spinner />}>
                <Root>
                  <Header>
                    <Menu>
                      <RouterLink to='/products'>Products</RouterLink>
                      <RouterLink to='/operations'>Operations</RouterLink>
                      <RouterLink to='/invoices'>Invoices</RouterLink>
                    </Menu>
                  </Header>
                  <Content>{slot}</Content>
                </Root>
              </Suspense>
            );
          }}
        </Router>
      </DataClientProvider>
    </>
  );
});

if (detectIsBrowser()) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    });
  }
}

export { App };
