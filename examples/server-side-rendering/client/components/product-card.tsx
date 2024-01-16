import { type DarkElement, h, component, Fragment, useResource } from '@dark-engine/core';
import { RouterLink, useMatch, useParams } from '@dark-engine/web-router';

import { State, api } from '../api';
import { Spinner, Error, Card, Button } from './ui';

type ProductCardProps = {
  slot: DarkElement;
};

const ProductCard = component<ProductCardProps>(({ slot }) => {
  const params = useParams();
  const { url } = useMatch();
  const id = Number(params.get('id'));
  const { data, loading, error } = useResource(({ id }) => api.fetchProduct(id), {
    variables: { id },
    key: State.PRODUCT_ITEM,
    extractId: x => x.id,
  });
  const urlToEdit = url + 'edit/';
  const urlToRemove = url + 'remove/';

  if (loading) return <Spinner />;
  if (error) return <Error value={error} />;
  if (slot) return slot;

  return (
    <Card>
      {data ? (
        <>
          <h3>{data.name}</h3>
          <p>{data.description}</p>
        </>
      ) : (
        <h3>Item not found 😟</h3>
      )}
      {data && (
        <>
          <Button as={RouterLink} to={urlToEdit}>
            Edit
          </Button>
          <Button as={RouterLink} to={urlToRemove}>
            Remove
          </Button>
        </>
      )}
    </Card>
  );
});

export default ProductCard;
