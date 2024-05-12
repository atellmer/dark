import { component, Suspense, lazy, useMemo, useEffect } from '@dark-engine/core';
import { detectIsBrowser } from '@dark-engine/platform-browser';
import { type Routes, Router, NavLink } from '@dark-engine/web-router';
import { DataClient, DataClientProvider, InMemoryCache } from '@dark-engine/data';

import { type Api, Key } from '../../contract';
import { GlobalStyle, Spinner, Root, Header, Menu, Content } from './ui';
import { setItem } from '../utils';

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

    detectIsBrowser() &&
      client.subscribe(({ key, record }) => {
        if (key === Key.FETCH_PRODUCTS && record.data) {
          setItem(key, record.data);
        }
      });

    return client;
  }, []);

  useEffect(() => {
    client.monitor(x => x.phase !== 'promise' && console.log(x));
  }, []);

  return (
    <>
      <GlobalStyle />
      <DataClientProvider client={client}>
        <Router routes={routes} url={url}>
          {slot => {
            return (
              <Root>
                <Header>
                  <Menu>
                    <NavLink to='/products'>Products</NavLink>
                    <NavLink to='/operations'>Operations</NavLink>
                    <NavLink to='/invoices'>Invoices</NavLink>
                  </Menu>
                </Header>
                <Content>
                  <Suspense fallback={<Spinner />}>{slot}</Suspense>
                </Content>
              </Root>
            );
          }}
        </Router>
      </DataClientProvider>
    </>
  );
});

export { App };
