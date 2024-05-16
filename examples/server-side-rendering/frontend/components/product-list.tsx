import { type DarkElement, component } from '@dark-engine/core';
import { Link, useMatch, useLocation } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

import { useProducts } from '../hooks';
import { Spinner, Error, AnimationFade, Button, List, ListItem } from './ui';
import { Metadata } from './metadata';

const Header = styled.header`
  padding-bottom: 16px;
`;

const ProductList = component<{ slot: DarkElement }>(({ slot }) => {
  const { url } = useMatch();
  const { pathname } = useLocation();
  const { isFetching, data, error } = useProducts();
  const isList = pathname.endsWith('list');
  const urlToAdd = url + '/add';
  const renderList = () => {
    return (
      <List>
        {[...data].reverse().map(x => {
          return (
            <ListItem key={x.id}>
              <Link to={`${url}/${x.id}`}>{x.name}</Link>
            </ListItem>
          );
        })}
      </List>
    );
  };

  if (isFetching && !data) return <Spinner />;
  if (error) return <Error value={error} />;

  return (
    <AnimationFade>
      <Metadata marker='products-list' />
      <Header>
        {isList ? (
          <Button as={Link} {...{ to: urlToAdd }}>
            Add product
          </Button>
        ) : (
          <Button onClick={() => history.back()}>Back</Button>
        )}
      </Header>
      <AnimationFade key={pathname}>{slot || renderList()}</AnimationFade>
    </AnimationFade>
  );
});

export default ProductList;
