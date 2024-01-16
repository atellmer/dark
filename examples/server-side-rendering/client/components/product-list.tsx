import { type DarkElement, h, component } from '@dark-engine/core';
import { RouterLink, useMatch, useLocation } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

import { useProducts } from '../hooks';
import { Spinner, Error, AnimationFade, Button, List, ListItem } from './ui';

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  padding: 16px 0;

  & h2 {
    margin: 0;
  }
`;

const ProductList = component<{ slot: DarkElement }>(({ slot }) => {
  const { url } = useMatch();
  const { pathname } = useLocation();
  const { data, loading, error } = useProducts();
  const isList = pathname.endsWith('list/');
  const urlToAdd = url + 'add/';
  const renderList = () => {
    return (
      <List>
        {[...data].reverse().map(x => {
          return (
            <ListItem key={x.id}>
              <RouterLink to={`${url}${x.id}`}>{x.name}</RouterLink>
            </ListItem>
          );
        })}
      </List>
    );
  };

  if (loading) return <Spinner />;
  if (error) return <Error value={error} />;

  return (
    <AnimationFade>
      <Header>
        <div>
          {isList ? (
            <Button as={RouterLink} to={urlToAdd}>
              Add product
            </Button>
          ) : (
            <Button onClick={() => history.back()}>Back</Button>
          )}
        </div>
      </Header>
      <AnimationFade key={pathname}>{slot || renderList()}</AnimationFade>
    </AnimationFade>
  );
});

export default ProductList;
