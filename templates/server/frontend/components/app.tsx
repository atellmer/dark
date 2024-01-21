import { h, component, Fragment, Suspense, lazy, useMemo, useEffect } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';
import { DataClient, DataClientProvider, InMemoryCache } from '@dark-engine/data';

import { type Api } from '../../contract';
import { Key } from '../api';
import { GlobalStyle, Spinner, Root, Header, Menu, Content } from './ui';

const Products = lazy(() => import('./products'));
const Operations = lazy(() => import('./operations'));
const Invoices = lazy(() => import('./invoices'));
const routes: Routes = [
  {
    path: 'products',
    component: Products,
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
  const client = useMemo(() => new DataClient<Api, Key>({ api, cache: new InMemoryCache() }), []);

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

export { App };
