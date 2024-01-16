import { h, component, Fragment, useResource } from '@dark-engine/core';
import { RouterLink, useMatch, useParams } from '@dark-engine/web-router';

import { State, api } from '../api';
import { Spinner, Error, Card, Button } from './ui';

const ProductCard = component(() => {
  const params = useParams();
  const { url } = useMatch();
  const id = Number(params.get('id'));
  const { data, loading, error } = useResource(({ id }) => api.fetchProduct(id), {
    variables: { id },
    key: State.PRODUCT_ITEM,
    extractId: x => x.id,
  });
  const editUrl = url + 'edit/';
  const removeUrl = url + 'remove/';

  if (loading) return <Spinner />;
  if (error) return <Error value={error} />;

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
          <Button as={RouterLink} to={editUrl}>
            Edit
          </Button>
          <Button as={RouterLink} to={removeUrl}>
            Remove
          </Button>
        </>
      )}
    </Card>
  );
});

export default ProductCard;
