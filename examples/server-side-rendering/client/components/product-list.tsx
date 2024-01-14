import { type DarkElement, h, component, useResource } from '@dark-engine/core';
import { RouterLink, useMatch } from '@dark-engine/web-router';

import { api } from '../api';
import { Spinner } from './spinner';
import { Error } from './error';
import { AnimatedRoute } from './animated-route';

const ProductList = component<{ slot: DarkElement }>(({ slot }) => {
  const { url } = useMatch();
  const resource = useResource(() => api.fetchProductList());
  const { loading, data, error } = resource;
  const renderList = () => {
    return (
      <ul>
        {data.map(x => {
          return (
            <li>
              <RouterLink to={`${url}${x.id}`}>{x.title}</RouterLink>
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) return <Spinner />;
  if (error) return <Error value={error} />;

  return (
    <AnimatedRoute>
      <h2>List</h2>
      {slot || renderList()}
    </AnimatedRoute>
  );
});

export default ProductList;
