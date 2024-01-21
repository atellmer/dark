import { h, component } from '@dark-engine/core';

import { Spinner, List, ListItem } from './ui';
import { useProducts } from '../hooks';

const Products = component(() => {
  const { isFetching, data, error } = useProducts();

  if (isFetching && !data) return <Spinner />;
  if (error) return error;

  return (
    <div>
      <h1>Products 📈</h1>
      <List>
        {[...data].reverse().map(x => {
          return <ListItem key={x.id}>{x.name}</ListItem>;
        })}
      </List>
    </div>
  );
});

export default Products;
