import { h, component, Fragment, Suspense, lazy, useMemo, useEffect } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';
import { DataClient, DataClientProvider, InMemoryCache } from '@dark-engine/data';

import { GlobalStyle, Spinner, Root, Header, Menu, Content } from './ui';
import { type Api } from '../../contract';
import { detectIsBrowser, setItem } from '../utils';
import { Key } from '../api';

const Products = lazy(() => import('./products'));
const ProductList = lazy(() => import('./product-list'));
const ProductAdd = lazy(() => import('./product-add'));
const ProductEdit = lazy(() => import('./product-edit'));
const ProductRemove = lazy(() => import('./product-remove'));
const ProductCard = lazy(() => import('./product-card'));
const ProductAnalytics = lazy(() => import('./product-analytics'));
const ProductBalance = lazy(() => import('./product-balance'));
const Operations = lazy(() => import('./operations'));
const Invoices = lazy(() => import('./invoices'));
const routes: Routes = [
  {
    path: 'products',
    component: Products,
    children: [
      {
        path: 'list',
        component: ProductList,
        children: [
          {
            path: 'add',
            component: ProductAdd,
          },
          {
            path: ':id',
            component: ProductCard,
            children: [
              {
                path: 'edit',
                component: ProductEdit,
              },
              {
                path: 'remove',
                component: ProductRemove,
              },
            ],
          },
        ],
      },
      {
        path: 'analytics',
        component: ProductAnalytics,
      },
      {
        path: 'balance',
        component: ProductBalance,
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
    component: Operations,
  },
  {
    path: 'invoices',
    component: Invoices,
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
