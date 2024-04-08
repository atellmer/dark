import { h, component } from '@dark-engine/core';
import { useMatch, useHistory, useParams } from '@dark-engine/web-router';

import { useProduct, useRemoveProductMutation } from '../hooks';
import { Card, Button } from './ui';

const ProductRemove = component(() => {
  const { url } = useMatch();
  const history = useHistory();
  const params = useParams();
  const id = Number(params.get('id'));
  const { data: product } = useProduct(id);
  const [removeProduct, { isFetching }] = useRemoveProductMutation();
  const urlToList = url.replace(`${id}/remove`, '');

  const handleRemove = async () => {
    if (isFetching) return;
    await removeProduct(id);
    history.push(urlToList);
  };

  return (
    <Card $isFetching={isFetching}>
      <h3>
        Do you want to remove product #{product.id} with name «{product.name}»? 🤔
      </h3>
      <Button onClick={handleRemove}>Yes</Button>
      <Button onClick={() => history.back()}>No</Button>
    </Card>
  );
});

export default ProductRemove;
