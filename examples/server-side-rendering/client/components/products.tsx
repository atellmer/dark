import { type DarkElement, h, component } from '@dark-engine/core';
import { RouterLink, useMatch } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

import { AnimationFade, Header } from './ui';

const Root = styled.div`
  position: sticky;
  top: 0;
  background-color: #fff8e1;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  margin: 0 -16px;

  & h1 {
    margin: 0;
  }
`;

type ProductsProps = {
  slot: DarkElement;
};

const Products = component<ProductsProps>(({ slot }) => {
  const { url } = useMatch();

  return (
    <AnimationFade>
      <Root>
        <h1>Products 🤓</h1>
        <Header $nested>
          <RouterLink to={`${url}list`}>List</RouterLink>
          <RouterLink to={`${url}analytics`}>Analytics</RouterLink>
          <RouterLink to={`${url}balance`}>Balance</RouterLink>
        </Header>
      </Root>
      {slot}
    </AnimationFade>
  );
});

export default Products;
