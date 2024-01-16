import { type DarkElement, h, component, useResource } from '@dark-engine/core';
import { RouterLink, useMatch, useLocation } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

import { State, api } from '../api';
import { Spinner, Error, AnimationFade, Button } from './ui';

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  padding: 16px 0;

  & h2 {
    margin: 0;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  width: 100%;
  background-color: #fff;
  margin: 6px 0;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  &:first-child {
    margin-top: 0;
  }
`;

const ProductList = component<{ slot: DarkElement }>(({ slot }) => {
  const { url } = useMatch();
  const { pathname } = useLocation();
  const { data, loading, error } = useResource(() => api.fetchProductList(), { key: State.PRODUCTS });
  const isList = pathname.endsWith('list/');
  const addUrl = url + 'add/';
  const renderList = () => {
    return (
      <List>
        {data.map(x => {
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
            <Button as={RouterLink} to={addUrl}>
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
