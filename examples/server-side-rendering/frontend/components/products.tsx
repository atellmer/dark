import { type DarkElement, component } from '@dark-engine/core';
import { NavLink, useMatch } from '@dark-engine/web-router';

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
          <NavLink to={`${url}/list`}>List</NavLink>
          <NavLink to={`${url}/analytics`}>Analytics</NavLink>
          <NavLink to={`${url}/balance`}>Balance</NavLink>
        </Menu>
      </Sticky>
      {slot}
    </AnimationFade>
  );
});

export default Products;
