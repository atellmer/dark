import { type DarkElement, h, component } from '@dark-engine/core';
import { RouterLink, useMatch } from '@dark-engine/web-router';

import { AnimationFade, Menu, Sticky } from './ui';

type ProductsProps = {
  slot: DarkElement;
};

const Products = component<ProductsProps>(({ slot }) => {
  const { url } = useMatch();

  return (
    <AnimationFade>
      <Sticky>
        <h1>Products 📈</h1>
        <Menu $isSecondary>
          <RouterLink to={`${url}list`}>List</RouterLink>
          <RouterLink to={`${url}analytics`}>Analytics</RouterLink>
          <RouterLink to={`${url}balance`}>Balance</RouterLink>
        </Menu>
      </Sticky>
      {slot}
    </AnimationFade>
  );
});

export default Products;
