import { h, component } from '@dark-engine/core';
import { useMatch, useHistory, useParams } from '@dark-engine/web-router';

import { useRemoveProductMutation } from '../hooks';
import { Card, Button } from './ui';

const ProductRemove = component(() => {
  const { url } = useMatch();
  const history = useHistory();
  const params = useParams();
  const id = Number(params.get('id'));
  const [removeProduct, { loading }] = useRemoveProductMutation(id);
  const urlToList = url.replace(`${id}/remove/`, '');

  const handleRemove = async () => {
    if (loading) return;
    await removeProduct();
    history.push(urlToList);
  };

  return (
    <Card $loading={loading}>
      <h3>Do you want to remove product #{id}? 🤔</h3>
      <Button onClick={handleRemove}>Yes</Button>
      <Button onClick={() => history.back()}>No</Button>
    </Card>
  );
});

export default ProductRemove;
