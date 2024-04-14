import { component, Suspense, lazy, useMemo, useEffect } from '@dark-engine/core';
import { type Routes, Router, NavLink } from '@dark-engine/web-router';
import { DataClient, DataClientProvider, InMemoryCache } from '@dark-engine/data';

import { type Api, Key } from '../../contract';
import { GlobalStyle, Spinner, Root, Header, Menu, Content } from './ui';

const routes: Routes = [
  {
    path: 'products',
    component: lazy(() => import('./products')),
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
                      <NavLink to='/products'>Products</NavLink>
                      <NavLink to='/operations'>Operations</NavLink>
                      <NavLink to='/invoices'>Invoices</NavLink>
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
