import { type DarkElement, h, Fragment, component, Suspense, lazy } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';

import { GlobalStyle, Root, Header, Content, Footer } from './ui';
import { Spinner } from './spinner';

const Products = lazy(() => import('./products'));
const ProductList = lazy(() => import('./product-list'));
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
            path: ':id',
            component: ProductCard,
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

type ShellProps = {
  slot: DarkElement;
};

const Shell = component<ShellProps>(({ slot }) => {
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
});

export type AppProps = {
  url?: string;
};

const App = component<AppProps>(({ url }) => {
  return (
    <>
      <GlobalStyle />
      <Router routes={routes} url={url}>
        {slot => <Shell>{slot}</Shell>}
      </Router>
    </>
  );
});

export { App };
