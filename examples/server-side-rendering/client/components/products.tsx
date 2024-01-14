import { type DarkElement, h, component } from '@dark-engine/core';
import { RouterLink, useMatch } from '@dark-engine/web-router';

import { Header } from './ui';
import { AnimatedRoute } from './animated-route';

type ProductsProps = {
  slot: DarkElement;
};

const Products = component<ProductsProps>(({ slot }) => {
  const { url } = useMatch();

  return (
    <AnimatedRoute>
      <h1>Products</h1>
      <Header $nested>
        <RouterLink to={`${url}list`}>List</RouterLink>
        <RouterLink to={`${url}analytics`}>Analytics</RouterLink>
        <RouterLink to={`${url}balance`}>Balance</RouterLink>
      </Header>
      {slot}
    </AnimatedRoute>
  );
});

export default Products;
