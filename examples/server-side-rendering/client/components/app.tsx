import {
  h,
  component,
  Fragment,
  Suspense,
  lazy,
  useMemo,
  useEffect,
  InMemoryCache,
  CacheProvider,
} from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';

import { Key } from '../hooks';
import { GlobalStyle, Spinner, Root, Header, Content, Footer } from './ui';

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
};

const App = component<AppProps>(({ url }) => {
  const cache = useMemo(() => new InMemoryCache<Key>(), []);

  useEffect(() => {
    cache.monitor(x => console.log(x));
  }, []);

  return (
    <>
      <GlobalStyle />
      <CacheProvider cache={cache}>
        <Router routes={routes} url={url}>
          {slot => {
            return (
              <Suspense fallback={<Spinner />}>
                <Root>
                  <Header>
                    <RouterLink to='/products'>Products</RouterLink>
                    <RouterLink to='/operations'>Operations</RouterLink>
                    <RouterLink to='/invoices'>Invoices</RouterLink>
                  </Header>
                  <Content>{slot}</Content>
                  <Footer>© {new Date().getFullYear()} Some Cool Company Ltd.</Footer>
                </Root>
              </Suspense>
            );
          }}
        </Router>
      </CacheProvider>
    </>
  );
});

export { App };
